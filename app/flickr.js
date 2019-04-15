const fs = require('fs')
const _ = require('lodash')
const Promise = require('bluebird')
const picturesDb = require('./pictures/pictures.db')

const albums = JSON.parse(fs.readFileSync('data/metadatas_flickr/albums.json')).albums
const album = _.find(albums, function (album) {
  return album.title === 'Bilbao'
})

Promise.map(album.photos, function (photoName) {
  const photo = JSON.parse(fs.readFileSync(`data/metadatas_flickr/photo_${photoName}.json`))
  return picturesDb.modifyCoord(photo.name, photo.geo.latitude / 1000000, photo.geo.longitude / 1000000)
}, { concurrency: 10 })
