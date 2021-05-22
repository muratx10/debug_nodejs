const Sequelize = require('sequelize');
const { DataTypes } = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.DB;
const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST_NAME = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DIALECT = process.env.DB_DIALECT;

const sequelize = new Sequelize(
  DB_NAME,
  USERNAME,
  PASSWORD,
  {
    host: HOST_NAME,
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
