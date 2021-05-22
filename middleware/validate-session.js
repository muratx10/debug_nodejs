const jwt = require('jsonwebtoken');
const { User } = require('../db');

const { SECRET } = process.env;

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') next();
  else {
    const sessionToken = req.headers.authorization;

    if (!sessionToken) return res.status(403).send({ auth: false, message: 'No token provided.' });
    else {
      jwt.verify(sessionToken, SECRET, async (err, decoded) => {
        if (decoded) {
          try {
            const user = User.findOne({
              where: {
                id: decoded.id,
              },
            });

            if (!user) return res.status(404).send({ message: 'User not found.' });

            req.user = user;
            next();
          } catch (err) {
            console.error(`Error: ${err.message}`);
            res.status(403).send({ error: 'Not authenticated' });
          }
        } else {
          console.error(`Error: ${err.message}`);
          res.status(401).send({ error: 'Not authorized' })
        }
      });
    }
  }
}
