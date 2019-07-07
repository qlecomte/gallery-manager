const config = require('../config')

const knex = require('knex')({
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

knex.on('query', (queryData) => {
  if (queryData && queryData.sql) {
    console.debug('SQL Query: ' + queryData.sql)
  }
})

module.exports = knex
