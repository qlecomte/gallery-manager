const knex = require('../database/knex')

module.exports.getAlbums = async function () {
  return knex.select().from('albums')
}

module.exports.getSingleAlbum = async function (id) {
  return knex.select().from('albums').where({ id: id })
}

module.exports.createAlbum = async function (album) {
  await knex.insert(album).returning(['id', 'name']).into('albums')
  return knex.select().from('albums').where({ id: album.id })
}

module.exports.modifyAlbum = async function (album, id) {
  await knex('albums').where({ id: id }).update(album)
  return knex.select().from('albums').where({ id: id })
}

module.exports.deleteAlbum = async function (id) {
  return knex('albums').del().where({ id: id })
}
