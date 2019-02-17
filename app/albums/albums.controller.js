const Albums = require('./albums.db')
const error = require('../utils/errorsGenerator')
const idGenerator = require('../utils/idGenerator')
const _ = require('lodash')

function formatAlbum (albums) {
  return albums.map(function (album) {
    return {
      id: album.id,
      name: album.name,
      url: `/albums/${album.id}`,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      pictures: ['INSERT ARRAY']
    }
  })
}

module.exports.getAlbums = async function (req, res) {
  const albums = await Albums.getAlbums()
  res.status(200).send(formatAlbum(albums))
}
module.exports.getSingleAlbum = async function (req, res) {
  const album = await Albums.getSingleAlbum(req.params.albumId)
  if (album.length > 0) {
    res.status(200).send(formatAlbum(album)[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.createAlbum = async function (req, res) {
  if (_.isString(req.body.name) && !_.isEmpty(req.body.name)) {
    req.body.id = idGenerator()
    const album = await Albums.createAlbum(_.pick(req.body, 'id', 'name', 'description'))
    res.status(201).send(formatAlbum(album)[0])
  } else {
    res.status(400).send(error('"name" field is missing or is not a string'))
  }
}
module.exports.modifyAlbum = async function (req, res) {
  const album = await Albums.modifyAlbum(_.pick(req.body, 'name', 'description', 'favorite'), req.params.albumId)
  if (album.length > 0) {
    res.status(200).send(formatAlbum(album)[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.deleteAlbum = async function (req, res) {
  const album = await Albums.deleteAlbum(req.params.albumId)
  if (album > 0) {
    res.sendStatus(204)
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.downloadAlbum = async function (req, res) {
  res.sendStatus(501)
}
