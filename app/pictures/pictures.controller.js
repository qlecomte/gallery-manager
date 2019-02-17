const Pictures = require('./pictures.db')
const error = require('../utils/errorsGenerator')
const generateId = require('../utils/idGenerator')
const exif = require('jpeg-exif')
const sharp = require('sharp')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const sizeValues = { 'small': 480, 'medium': 720, 'large': 1440, 'full': null }
const defaultSize = 720

const formatPicture = (pictures) => {
  return pictures.map(function (picture) {
    return {
      id: picture.id,
      name: picture.name,
      url: `/pictures/${picture.id}`,
      description: picture.description,
      takenAt: picture.takenAt,
      importedAt: picture.importedAt,
      coordinates: {
        latitude: picture.coord_lat,
        longitude: picture.coord_lng
      },
      exif: exif.parseSync(picture.path)
    }
  })
}

module.exports.getPicture = async (req, res) => {
  const picture = await Pictures.getSinglePicture(req.params.pictureId)
  if (picture.length > 0 && fs.existsSync(picture[0].path)) {
    let width = defaultSize
    let height = null
    if (req.query.w || req.query.h) {
      if (req.query.h && _.isFinite(parseInt(req.query.h))) {
        height = parseInt(req.query.h)
      }
      if (req.query.w && _.isFinite(parseInt(req.query.w))) {
        width = parseInt(req.query.w)
      }
    } else if (Object.keys(sizeValues).includes(req.query.size)) {
      const sizeName = Object.keys(sizeValues).find(function (size) {
        return size === req.query.size
      })
      width = sizeValues[sizeName]
    }

    const image = await sharp(picture[0].path).rotate().resize(width, height, 'fill').toBuffer()
    res.status(200).contentType('jpeg').end(image, 'binary')
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.getPictureDetails = async (req, res) => {
  const picture = await Pictures.getSinglePicture(req.params.pictureId)
  if (picture.length > 0) {
    res.status(200).send(formatPicture(picture)[0])
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.upload = async (req, res) => {
  const relativePath = `./data/${req.files.picture.name}`
  fs.writeFileSync(relativePath, req.files.picture.data)

  const pictureData = {
    id: generateId(24),
    name: req.body.name,
    description: req.body.description,
    path: path.resolve(relativePath),
    takenAt: exif.parseSync(path.resolve(relativePath)).DateTime
  }
  const picture = await Pictures.createPicture(pictureData)

  res.status(200).send(formatPicture(picture))
}
module.exports.getFavorites = async (req, res) => {
  res.status(200).send(formatPicture(await Pictures.getFavoritesPictures()))
}
