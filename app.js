const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');
const validate_session = require('./middleware/validate-session')
require('dotenv').config();
const { User, Game } = require('./db');

const PORT = process.env.PORT;

User.sync({ force: true }).then(() => console.log('DB Connected'));
Game.sync({ force: true }).then(() => console.log('DB Game connected'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/auth', user);
app.use(validate_session);
app.use('/api/game', game);

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});
