const controller = require('./pictures.controller')

module.exports = (router) => {
  router.get('/pictures/favorites', controller.getFavorites)
  router.get('/pictures/calendar', controller.getCalendar)
  router.get('/pictures/map', controller.getMap)

  router.get('/pictures/:pictureId', controller.getPicture)
  router.patch('/pictures/:pictureId', controller.modifyPicture)
  router.delete('/pictures/:pictureId', controller.deletePicture)

  router.get('/pictures/:pictureId/details', controller.getPictureDetails)

  router.post('/upload', controller.upload)
}
