const controller = require('./albums.controller')

module.exports = (router) => {
  router.get('/albums', controller.getAlbums)
  router.post('/albums', controller.createAlbum)

  router.get('/albums/favorites', controller.getFavorites)

  router.get('/albums/:albumId', controller.getSingleAlbum)
  router.patch('/albums/:albumId', controller.modifyAlbum)
  router.delete('/albums/:albumId', controller.deleteAlbum)

  router.get('/albums/:albumId/download', controller.downloadAlbum)

  router.post('/albums/:albumId/pictures', controller.addPictures)
  router.delete('/albums/:albumId/pictures', controller.removePictures)
}
