const controller = require('./albums.controller')

module.exports = (app) => {
  app.route('/albums')
    .get(controller.getAlbums)
    .post(controller.createAlbum)
  app.route('/albums/favorites')
    .get(controller.getFavorites)
  app.route('/albums/:albumId')
    .get(controller.getSingleAlbum)
    .patch(controller.modifyAlbum)
    .delete(controller.deleteAlbum)
  app.route('/albums/:albumId/download')
    .get(controller.downloadAlbum)
  app.route('/albums/:albumId/pictures')
    .post(controller.addPictures)
    .delete(controller.removePictures)
}
