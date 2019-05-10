const Pictures = require('./pictures.db')

const _ = require('lodash')
const exif = require('jpeg-exif')

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

module.exports = {
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
  }
}
