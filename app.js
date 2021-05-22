const express = require('express');
const bodyParser = require('body-parser');
const game = require('./controllers/gamecontroller');
const user = require('./controllers/usercontroller');
const validate_session = require('./middleware/validate-session')
const { User, Game } = require('./db');
require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

User.sync({ force: true }).then(() => console.log('DB Connected'));
Game.sync({ force: true }).then(() => console.log('DB Game connected'));

app.use(bodyParser.urlencoded({ extended: false }))
   .use(bodyParser.json())
   .use('/api/auth', user)
   .use(validate_session)
   .use('/api/game', game)
   .listen(PORT, () => {
     console.log(`App is listening on ${PORT}`);
   });
