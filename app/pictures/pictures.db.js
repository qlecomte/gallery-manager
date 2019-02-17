const knex = require('../database/knex')

module.exports.getSinglePicture = async (id) => {
  return knex.select().from('pictures').where({ id: id })
}
module.exports.getFavoritesPictures = async () => {
  return knex.select().from('pictures').where({ favorite: 1 })
}
module.exports.createPicture = async (picture) => {
  await knex.insert(picture).into('pictures')
  return knex.select().from('pictures').where({ id: picture.id })
}
