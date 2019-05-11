const PictureService = require('./pictures.service')
const error = require('../utils/errorsGenerator')
const _ = require('lodash')

module.exports.getPicture = async (req, res) => {
  const picture = await PictureService.getPicture(req.params.pictureId, req.query)
  if (picture) {
    res.status(200).set('Cache-Control', 'public, max-age=86400').contentType('jpeg').end(picture, 'binary')
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.getPictureDetails = async (req, res) => {
  const pictureId = req.params.pictureId
  const albumId = req.query.album
  const picture = await PictureService.getPictureDetails(pictureId, albumId)
  if (picture) {
    res.status(200).send(picture)
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.getFavorites = async (req, res) => {
  res.status(200).send(await PictureService.getFavorites())
}
module.exports.getCalendar = async (req, res) => {
  const pictures = await PictureService.getCalendar()
  res.status(200).send(pictures.map(function (picture) {
    const { id, url, takenAt } = picture
    return { id, url, takenAt }
  }))
}
module.exports.getMap = async (req, res) => {
  const pictures = await PictureService.getMap()
  res.status(200).send(pictures.map(function (picture) {
    return {
      id: picture.id,
      url: picture.url,
      coordinates: picture.coordinates
    }
  }))
}
module.exports.modifyPicture = async (req, res) => {
  const picture = await PictureService.modifyPicture(_.pick(req.body, 'name', 'description', 'favorite', 'coordinates'), req.params.pictureId)
  if (picture.length > 0) {
    res.status(200).send(picture[0])
  } else {
    res.status(404).send(error(`Picture with id ${req.params.albumId} not found`))
  }
}
module.exports.deletePicture = async (req, res) => {
  const picture = await PictureService.deletePicture(req.params.pictureId)
  if (picture > 0) {
    res.sendStatus(204)
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.upload = async (req, res) => {
  const pictures = []
  if (_.isArray(req.files.pictures)) {
    req.files.pictures.forEach(function (picture) {
      pictures.push(picture)
    })
  } else {
    pictures.push(req.files.pictures)
  }

  let myPictures = await PictureService.uploadPicture(pictures)
  res.status(200).send(myPictures)
}
