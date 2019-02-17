const config = require('../config')

module.exports = require('knex')({
  client: 'mysql',
  version: '5.7',
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.username,
    password: config.database.password,
    database: config.database.database
  }
})
