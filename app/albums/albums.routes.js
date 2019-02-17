const controller = require('./albums.controller')

module.exports = function (app) {
  app.route('/albums')
    .get(controller.getAlbums)
    .post(controller.createAlbum)
  app.route('/albums/:albumId')
    .get(controller.getSingleAlbum)
    .patch(controller.modifyAlbum)
    .delete(controller.deleteAlbum)
  app.route('/albums/:albumId/download')
    .get(controller.downloadAlbum)
}
