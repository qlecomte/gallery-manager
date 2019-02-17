const Albums = require('./albums.db')
const error = require('../utils/errorsGenerator')
const idGenerator = require('../utils/idGenerator')
const _ = require('lodash')

const formatAlbum = async (albums) => {
  return Promise.all(albums.map(async function (album) {
    return {
      id: album.id,
      name: album.name,
      url: `/albums/${album.id}`,
      description: album.description,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      pictures: (await Albums.getPictures(album.id)).map(function (picture) {
        return `/pictures/${picture.id}`
      })
    }
  }))
}

module.exports.getAlbums = async (req, res) => {
  res.status(200).send(await formatAlbum(await Albums.getAlbums()))
}
module.exports.getSingleAlbum = async (req, res) => {
  const album = await Albums.getSingleAlbum(req.params.albumId)
  if (album.length > 0) {
    res.status(200).send((await formatAlbum(album))[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.getFavorites = async (req, res) => {
  res.status(200).send(await formatAlbum(await Albums.getFavoriteAlbums()))
}
module.exports.createAlbum = async (req, res) => {
  if (_.isString(req.body.name) && !_.isEmpty(req.body.name)) {
    req.body.id = idGenerator()
    const album = await Albums.createAlbum(_.pick(req.body, 'id', 'name', 'description'))
    res.status(201).send((await formatAlbum(album))[0])
  } else {
    res.status(400).send(error('"name" field is missing or is not a string'))
  }
}
module.exports.modifyAlbum = async (req, res) => {
  const album = await Albums.modifyAlbum(_.pick(req.body, 'name', 'description', 'favorite'), req.params.albumId)
  if (album.length > 0) {
    res.status(200).send((await formatAlbum(album))[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.deleteAlbum = async (req, res) => {
  const album = await Albums.deleteAlbum(req.params.albumId)
  if (album > 0) {
    res.sendStatus(204)
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.downloadAlbum = async (req, res) => {
  res.sendStatus(501)
}
module.exports.addPictures = async (req, res) => {
  const album = await Albums.linkPictures(req.params.albumId, req.body)
  if (album.length > 0) {
    res.status(200).send((await formatAlbum(album))[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
module.exports.removePictures = async (req, res) => {
  const album = await Albums.unlinkPictures(req.params.albumId, req.body)
  if (album.length > 0) {
    res.status(200).send((await formatAlbum(album))[0])
  } else {
    res.status(404).send(error(`Album with id ${req.params.albumId} not found`))
  }
}
