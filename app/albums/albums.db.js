const knex = require('../database/knex')

module.exports.getAlbums = async () => {
  return knex.select().from('albums')
}
module.exports.getSingleAlbum = async (id) => {
  return knex.select().from('albums').where({ id: id })
}
module.exports.getFavoriteAlbums = async () => {
  return knex.select().from('albums').where({ favorite: 1 })
}
module.exports.getPictures = async (id) => {
  return knex.select().from('pictures').join('albums_pictures', 'pictures.id', 'albums_pictures.pictureId').where({ 'albums_pictures.albumId': id })
}
module.exports.createAlbum = async (album) => {
  await knex.insert(album).into('albums')
  return knex.select().from('albums').where({ id: album.id })
}
module.exports.modifyAlbum = async (album, id) => {
  await knex('albums').where({ id: id }).update(album)
  return knex.select().from('albums').where({ id: id })
}
module.exports.deleteAlbum = async (id) => {
  return knex('albums').del().where({ id: id })
}
module.exports.linkPictures = async (albumId, pictureIds) => {
  let body = pictureIds.map(function (pictureId) {
    return {
      albumId: albumId,
      pictureId: pictureId
    }
  })
  await knex.insert(body).into('albums_pictures')
  return knex.select().from('albums').where({ id: albumId })
}
