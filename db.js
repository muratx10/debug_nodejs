const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
require('dotenv').config();

const { DB, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_DIALECT } = process.env;

const sequelize = new Sequelize(
  DB,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: DB_DIALECT,
    port: DB_PORT,
  });

const Game = require('./models/game')(sequelize, DataTypes);
const User = require('./models/user')(sequelize, DataTypes);

sequelize.authenticate()
         .then(() => console.log('Connected to DB'))
         .catch(err => console.log(`Error: ${err}`));

module.exports = {
  sequelize,
  Game,
  User,
};
