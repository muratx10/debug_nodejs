const jwt = require('jsonwebtoken');
const { User } = require('../db');

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next();   // allowing options as a method for request
    } else {
        const sessionToken = req.headers.authorization;

        if (!sessionToken) return res.status(403).send({ auth: false, message: "No token provided." });
        else {
            jwt.verify(sessionToken, 'lets_play_sum_games_man', (err, decoded) => {
                if (decoded) {
                    User.findOne({ where: { id: decoded.id } }).then(user => {
                        req.user = user;
                        next()
                    }).catch(err => {
                        console.error(`Error: ${err.message}`);
                        res.status(401).send({ error: "not authorized" });
                    })

                } else {
                    console.error(`Error: ${err.message}`);
                    res.status(400).send({ error: "not authorized" })
                }
            });
        }
    }
}
