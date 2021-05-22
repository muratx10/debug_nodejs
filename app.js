const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');
const db = require('./db');
const validate_session = require('./middleware/validate-session')
require('dotenv').config();

const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/auth', user);
app.use(validate_session);
app.use('/api/game', game);

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});
