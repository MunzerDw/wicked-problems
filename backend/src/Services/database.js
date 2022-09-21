const { Sequelize } = require('sequelize')
const sequelizeNoUpdateAttributes = require('sequelize-noupdate-attributes')
require('dotenv').config()

//DATABASE
const database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
)
sequelizeNoUpdateAttributes(database)

module.exports = database
