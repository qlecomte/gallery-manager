const AlbumService = require('./albums.service')
const error = require('../utils/errorsGenerator')
const _ = require('lodash')

function formatPictureUrls (albums) {
  return albums.map(album => {
    album.pictures = album.pictures.map(picture => `/api/v1/pictures/${picture.id}`)
    return album
  })
}

module.exports.getAlbums = async (req, res) => {
  res.status(200).send(await AlbumService.getAllAlbums())
}
module.exports.getSingleAlbum = async (req, res) => {
  const album = formatPictureUrls(await AlbumService.getAllAlbums({ id: req.params.albumId, withPictures: true }))
  if (album.length > 0) {
    res.status(200).send(album[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.getFavorites = async (req, res) => {
  res.status(200).send(await AlbumService.getAllAlbums({ onlyFavorites: true }))
}
module.exports.createAlbum = async (req, res) => {
  if (_.isString(req.body.name) && !_.isEmpty(req.body.name)) {
    const album = await AlbumService.createAlbum(_.pick(req.body, 'name', 'description'))
    res.status(201).send(album[0])
  } else {
    res.status(400).send(error('"name" field is missing or is not a string'))
  }
}
module.exports.modifyAlbum = async (req, res) => {
  const album = await AlbumService.modifyAlbum(req.params.albumId, _.pick(req.body, 'name', 'description', 'favorite'))
  if (album.length > 0) {
    res.status(200).send(album[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.deleteAlbum = async (req, res) => {
  const album = await AlbumService.deleteAlbum(req.params.albumId)
  if (album > 0) {
    res.sendStatus(204)
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.downloadAlbum = async (req, res) => {
  const { zipFile, filename } = await AlbumService.downloadAlbum(req.params.albumId)
  res.download(zipFile, filename)
}
module.exports.addPictures = async (req, res) => {
  const album = await AlbumService.addPictures(req.params.albumId, req.body)
  if (album.length > 0) {
    res.status(200).send(album[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.removePictures = async (req, res) => {
  const album = await AlbumService.removePictures(req.params.albumId, req.body)
  if (album.length > 0) {
    res.status(200).send(album[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
