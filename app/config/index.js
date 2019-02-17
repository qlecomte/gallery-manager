const _ = require('lodash')

const all = require('./all')
const dev = require('./development')
const prod = require('./prod')

let config

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod') {
  config = _.merge(all, prod)
} else {
  config = _.merge(all, dev)
}

module.exports = config
