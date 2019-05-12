const Pictures = require('./pictures.db')
const generateId = require('../utils/idGenerator')

const _ = require('lodash')
const exif = require('jpeg-exif')
const sharp = require('sharp')
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
      favorite: picture.favorite > 0,
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

module.exports = {
  getAllPictures: async function (filter) {
    let pictures = formatPicture(await Pictures.getAllPictures())
    if (filter) {
      if (filter.onlyFavorites) {
        pictures = pictures.filter(picture => picture.favorite)
      }
      if (filter.onMap) {
        pictures = pictures.filter(picture => picture.coordinates.latitude && picture.coordinates.longitude)
      }
      if (filter.id) {
        pictures = pictures.filter(picture => picture.id === filter.id)
      }
    }
    return pictures
  },
  getPicturesFromAlbum: async function (albumId) {
    const picturesOnAlbum = await Pictures.getPicturesFromAlbum(albumId)
    return formatPicture(picturesOnAlbum)
  },
  getPicture: async function (pictureId, { w, h, size }) {
    const picture = await Pictures.getSinglePicture(pictureId)
    if (picture.length > 0 && fs.existsSync(picture[0].path)) {
      let width = defaultSize
      let height = null
      if (w || h) {
        if (h && _.isFinite(parseInt(h))) {
          height = parseInt(h)
        }
        if (w && _.isFinite(parseInt(w))) {
          width = parseInt(w)
        }
      } else if (Object.keys(sizeValues).includes(size)) {
        const sizeName = Object.keys(sizeValues).find(function (mySize) {
          return mySize === size
        })
        if (sizeName) {
          if (sizeValues[sizeName] == null) {
            width = null
            height = null
          } else if (Number.isInteger(sizeValues[sizeName])) {
            width = sizeValues[sizeName]
          } else if (_.isObject(sizeValues[sizeName])) {
            width = sizeValues[sizeName].w
            height = sizeValues[sizeName].h
          }
        }
      }

      return sharp(picture[0].path).rotate().resize(width, height, 'fill').toBuffer()
    }
  },
  getPictureDetails: async function (pictureId, albumId) {
    const pictureArray = await Pictures.getSinglePicture(pictureId)
    if (pictureArray.length > 0) {
      const myPicture = pictureArray[0]
      if (albumId) {
        const picturesOnAlbum = await Pictures.getPicturesFromAlbum(albumId)
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
      return formatPicture(pictureArray)[0]
    } else {
      return null
    }
  },
  modifyPicture: async function (pictureId, data) {
    data.coord_lat = data.coordinates ? data.coordinates.latitude : undefined
    data.coord_lng = data.coordinates ? data.coordinates.longitude : undefined
    const picture = await Pictures.modifyPicture(data, pictureId)
    return formatPicture(picture)
  },
  deletePicture: async function (pictureId) {
    return Pictures.deletePicture(pictureId)
  },
  uploadPicture: async function (pictures) {
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
    return formatPicture(myPictures.map(function (pictures) {
      return pictures[0]
    }))
  }
}
