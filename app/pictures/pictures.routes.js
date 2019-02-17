const controller = require('./pictures.controller')

module.exports = (app) => {
  app.route('/pictures/favorites')
    .get(controller.getFavorites)
  app.route('/pictures/:pictureId')
    .get(controller.getPicture)
    .patch(controller.modifyPicture)
    .delete(controller.deletePicture)
  app.route('/pictures/:pictureId/details')
    .get(controller.getPictureDetails)
  app.route('/upload')
    .post(controller.upload)
}
