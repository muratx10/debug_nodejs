const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../db');

const { SECRET } = process.env;

router.post('/signup', async (req, res) => {
  try {
    const { full_name, username, password, email } = req.body.user;

    const user = await User.create({
      full_name,
      username,
      passwordHash: bcrypt.hashSync(password, 10),
      email,
    });

    if (!user) return res.status(400);

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: 60 * 60 * 24 },
    );

    delete user?.dataValues?.passwordHash;
    delete user?._previousdataValues?.passwordHash;

    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post('/signin', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.user.username,
      },
    });

    if (!user) return res.status(404).send({ message: 'User not found' });

    const matches = await bcrypt.compare(req.body.user.password, user.passwordHash);

    if (matches) {
      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: 60 * 60 * 24 });

      delete user?.dataValues?.passwordHash;
      delete user?._previousdataValues?.passwordHash;

      res.json({
        user,
        message: 'Successfully authenticated',
        sessionToken: token,
      });
    } else {
      res.status(401).send({ error: 'Bad credentials.' });
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = router;
