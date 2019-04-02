const Pictures = require('./pictures.db')
const Albums = require('../albums/albums.db')
const error = require('../utils/errorsGenerator')
const generateId = require('../utils/idGenerator')
const exif = require('jpeg-exif')
const sharp = require('sharp')
const _ = require('lodash')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const sizeValues = { 'small': 480, 'medium': 720, 'large': 1440, 'full': null, 'thumbnail': { w: 300, h: 180 } }
const defaultSize = 720

const formatPicture = (pictures) => {
  return pictures.map(function (picture) {
    return {
      id: picture.id,
      name: picture.name,
      url: `/api/v1/pictures/${picture.id}`,
      description: picture.description,
      takenAt: picture.takenAt,
      importedAt: picture.importedAt,
      coordinates: {
        latitude: picture.coord_lat,
        longitude: picture.coord_lng
      },
      next: picture.next ? `/api/v1/pictures/${picture.next}` : null,
      previous: picture.previous ? `/api/v1/pictures/${picture.previous}` : null,
      exif: exif.parseSync(picture.path)
    }
  })
}
const transformCoordinates = (gpsData) => {
  // Latitude
  let latitude = null
  let longitude = null
  if (gpsData && gpsData.latitude && gpsData.longitude) {
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
      if (sizeName) {
        if (Number.isInteger(sizeValues[sizeName])) {
          width = sizeValues[sizeName]
        } else if (_.isObject(sizeValues[sizeName])) {
          width = sizeValues[sizeName].w
          height = sizeValues[sizeName].h
        }
      }
    }

    const image = await sharp(picture[0].path).rotate().resize(width, height, 'fill').toBuffer()
    res.status(200).set('Cache-Control', 'public, max-age=86400').contentType('jpeg').end(image, 'binary')
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.getPictureDetails = async (req, res) => {
  const pictureArray = await Pictures.getSinglePicture(req.params.pictureId)
  const albumId = req.query.album
  if (pictureArray.length > 0) {
    const myPicture = pictureArray[0]
    if (albumId) {
      const picturesOnAlbum = await Albums.getPictures(albumId)
      const pictureIndex = _.findIndex(picturesOnAlbum, function (picture) {
        return picture.id === myPicture.id
      })
      // If the picture is not the last, we retrieve the next one
      if (pictureIndex < (picturesOnAlbum.length - 1)) {
        myPicture.next = picturesOnAlbum[pictureIndex + 1].id
      }

      // If the picture is not the first, we retrieve the previous one
      if (pictureIndex > 0) {
        myPicture.previous = picturesOnAlbum[pictureIndex - 1].id
      }
    }
    res.status(200).send(formatPicture(pictureArray)[0])
  } else {
    res.status(404).send(error(`Picture with id ${req.params.pictureId} not found`))
  }
}
module.exports.getFavorites = async (req, res) => {
  res.status(200).send(formatPicture(await Pictures.getFavoritesPictures()))
}
module.exports.getCalendar = async (req, res) => {
  const pictures = await Pictures.getAllPictures()
  res.status(200).send(pictures.map(function (picture) {
    return {
      id: picture.id,
      url: `/api/v1/pictures/${picture.id}`,
      takenAt: picture.takenAt
    }
  }))
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
  const pictures = []
  if (_.isArray(req.files.pictures)) {
    req.files.pictures.forEach(function (picture) {
      pictures.push(picture)
    })
  } else {
    pictures.push(req.files.pictures)
  }

  let myPictures = await Promise.all(pictures.map(async function (picture) {
    const relativePath = `./data/${picture.name}`
    fs.writeFileSync(relativePath, picture.data)
    const exifData = exif.parseSync(path.resolve(relativePath))

    const gpsData = transformCoordinates({
      latitude: exifData.GPSInfo ? exifData.GPSInfo.GPSLatitude : [],
      latitudeDirection: exifData.GPSInfo ? exifData.GPSInfo.GPSLatitudeRef : null,
      longitude: exifData.GPSInfo ? exifData.GPSInfo.GPSLongitude : [],
      longitudeDirection: exifData.GPSInfo ? exifData.GPSInfo.GPSLongitudeRef : null
    })

    const pictureData = {
      id: generateId(24),
      name: picture.name,
      description: null,
      path: path.resolve(relativePath),
      takenAt: exifData.DateTime || new Date(),
      coord_lat: gpsData.latitude,
      coord_lng: gpsData.longitude
    }
    return Pictures.createPicture(pictureData)
  }))
  myPictures = myPictures.map(function (pictures) {
    return pictures[0]
  })

  res.status(200).send(formatPicture(myPictures))
}
