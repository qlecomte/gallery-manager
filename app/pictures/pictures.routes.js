const controller = require('./pictures.controller')

module.exports = (app) => {
  app.route('/pictures/favorites')
    .get(controller.getFavorites)
  app.route('/pictures/:pictureId')
    .get(controller.getPicture)
  app.route('/pictures/:pictureId/details')
    .get(controller.getPictureDetails)
  app.route('/upload')
    .post(controller.upload)
}
