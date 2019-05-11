const controller = require('./pictures.controller')

function catchAsyncErrors(fn) {
  return (req, res, next) => {
    const routePromise = fn(req, res, next)
    if (routePromise.catch) {
      routePromise.catch(err => next(err))
    }
  }
}

module.exports = (router) => {
  router.get('/pictures/favorites', catchAsyncErrors(controller.getFavorites))
  router.get('/pictures/calendar', catchAsyncErrors(controller.getCalendar))
  router.get('/pictures/map', catchAsyncErrors(controller.getMap))

  router.get('/pictures/:pictureId', catchAsyncErrors(controller.getPicture))
  router.patch('/pictures/:pictureId', catchAsyncErrors(controller.modifyPicture))
  router.delete('/pictures/:pictureId', catchAsyncErrors(controller.deletePicture))

  router.get('/pictures/:pictureId/details', catchAsyncErrors(controller.getPictureDetails))

  router.post('/upload', catchAsyncErrors(controller.upload))
}
