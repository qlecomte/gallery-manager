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
const transformCoordinates = (gpsData) => {
  // Latitude
  let latitude = null
  let longitude = null
  switch (gpsData.latitude.length) {
    case 1:
      if (gpsData.latitudeDirection === 'S') {
        latitude = -gpsData.latitude[0]
      } else {
        latitude = gpsData.latitude[0]
      }
      break
    case 2:
      latitude = gpsData.latitude[0] + gpsData.latitude[1] / 60
      if (gpsData.latitudeDirection === 'S') {
        latitude *= -1
      }
      break
    case 3:
      latitude = gpsData.latitude[0] + gpsData.latitude[1] / 60 + gpsData.latitude[2] / 3600
      if (gpsData.latitudeDirection === 'S') {
        latitude *= -1
      }
      break
    default:
      break
  }

  // Longitude
  switch (gpsData.longitude.length) {
    case 1:
      if (gpsData.longitudeDirection === 'W') {
        longitude = -gpsData.longitude[0]
      } else {
        longitude = gpsData.longitude[0]
      }
      break
    case 2:
      longitude = gpsData.longitude[0] + gpsData.longitude[1] / 60
      if (gpsData.longitudeDirection === 'W') {
        longitude *= -1
      }
      break
    case 3:
      longitude = gpsData.longitude[0] + gpsData.longitude[1] / 60 + gpsData.longitude[2] / 3600
      if (gpsData.longitudeDirection === 'W') {
        longitude *= -1
      }
      break
    default:
      break
  }
  return {
    latitude: latitude,
    longitude: longitude
  }
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
module.exports.getFavorites = async (req, res) => {
  res.status(200).send(formatPicture(await Pictures.getFavoritesPictures()))
}
module.exports.modifyPicture = async (req, res) => {
  req.body.coord_lat = req.body.coordinates ? req.body.coordinates.latitude : undefined
  req.body.coord_lng = req.body.coordinates ? req.body.coordinates.longitude : undefined

  const picture = await Pictures.modifyPicture(_.pick(req.body, 'name', 'description', 'favorite', 'coord_lat', 'coord_lng'), req.params.pictureId)
  if (picture.length > 0) {
    res.status(200).send(formatPicture(picture)[0])
  } else {
    res.status(404).send(error(`Picture with id ${req.params.albumId} not found`))
  }
}
module.exports.deletePicture = async (req, res) => {
  const picture = await Pictures.deletePicture(req.params.pictureId)
  if (picture > 0) {
    res.sendStatus(204)
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.upload = async (req, res) => {
  const relativePath = `./data/${req.files.picture.name}`
  fs.writeFileSync(relativePath, req.files.picture.data)
  const exifData = exif.parseSync(path.resolve(relativePath))

  const gpsData = transformCoordinates({
    latitude: exifData.GPSInfo ? exifData.GPSInfo.GPSLatitude : [],
    latitudeDirection: exifData.GPSInfo ? exifData.GPSInfo.GPSLatitudeRef : null,
    longitude: exifData.GPSInfo ? exifData.GPSInfo.GPSLongitude : [],
    longitudeDirection: exifData.GPSInfo ? exifData.GPSInfo.GPSLongitudeRef : null
  })

  const pictureData = {
    id: generateId(24),
    name: req.body.name || req.files.picture.name,
    description: req.body.description,
    path: path.resolve(relativePath),
    takenAt: exifData.DateTime,
    coord_lat: gpsData.latitude,
    coord_lng: gpsData.longitude
  }
  const picture = await Pictures.createPicture(pictureData)

  res.status(200).send(formatPicture(picture))
}
