const Sequelize = require('sequelize');
require('dotenv').config();

const DB_NAME = process.env.DB;
const USERNAME = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD;
const HOST_NAME = process.env.DB_HOST;

const sequelize = new Sequelize(
  DB_NAME,
  USERNAME,
  PASSWORD,
  {
    host: HOST_NAME,
    dialect: 'postgres',
      port: 5433,
})

sequelize.authenticate()
         .then(() => console.log("Connected to DB"))
         .catch(err => console.log(`Error: ${err}`));

module.exports = sequelize;
