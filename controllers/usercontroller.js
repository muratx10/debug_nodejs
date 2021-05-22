const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../db');

router.post('/signup', async (req, res) => {
  try {
    const user = await User.create({
      full_name: req.body.full_name,
      username: req.body.username,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      email: req.body.email,
    });

    if (!user) {
      return res.status(400);
    }

    const token = jwt.sign({id: user.id}, 'lets_play_sum_games_man', {expiresIn: 60 * 60 * 24});

    res.status(200).json({
      user: user,
      token: token,
    });
  } catch (e) {
    res.status(500).send(e.message)
  }
});

router.post('/signin', (req, res) => {
  User.findOne({ where: { username: req.body.user.username }}).then(user => {
    if (user) {
      bcrypt.compare(req.body.user.password, user.passwordHash, function (err, matches) {
        if (matches) {
          const token = jwt.sign({id: user.id}, 'lets_play_sum_games_man', {expiresIn: 60 * 60 * 24});

          res.json({
            user: user,
            message: 'Successfully authenticated.',
            sessionToken: token,
          });
        } else {
          res.status(502).send({error: 'Passwords do not match.'})
        }
      });
    } else {
      res.status(403).send({error: 'User not found.'})
    }

  })
})

module.exports = router;
