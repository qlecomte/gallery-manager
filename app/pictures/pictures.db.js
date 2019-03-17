const knex = require('../database/knex')

module.exports.getAllPictures = async () => {
  return knex.select('id', 'takenAt').from('pictures').orderBy('takenAt', 'desc')
}
module.exports.getSinglePicture = async (id) => {
  return knex.select().from('pictures').where({ id: id })
}
module.exports.getFavoritesPictures = async () => {
  return knex.select().from('pictures').where({ favorite: 1 }).orderBy('takenAt', 'desc')
}
module.exports.createPicture = async (picture) => {
  await knex.insert(picture).into('pictures')
  return knex.select().from('pictures').where({ id: picture.id })
}
module.exports.modifyPicture = async (picture, id) => {
  await knex('pictures').where({ id: id }).update(picture)
  return knex.select().from('pictures').where({ id: id })
}
module.exports.deletePicture = async (id) => {
  return knex('pictures').del().where({ id: id })
}
