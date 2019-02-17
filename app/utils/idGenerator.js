module.exports = (length) => {
  const nanoId = require('nanoid/generate')
  return nanoId('1234567890abcdefghijklmnopqrstuvwxyz', length || 10)
}
