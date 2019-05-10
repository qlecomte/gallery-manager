const Albums = require('./albums.db')

const zipArchiver = require('../utils/zipArchiver')

const moment = require('moment')

const formatAlbum = async (albums) => {
  return Promise.all(albums.map(async function (album) {
    return {
      id: album.id,
      name: album.name,
      url: `/api/v1/albums/${album.id}`,
      description: album.description,
      cover: album.cover ? `/api/v1/pictures/${album.cover}` : null,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      pictures: (await Albums.getPictures(album.id))
    }
  }))
}

module.exports = {
  getAllAlbums: async function () {
    return formatAlbum(await Albums.getAlbums())
  },
  getSingleAlbum: async function (albumId) {
    return formatAlbum(await Albums.getSingleAlbum(albumId))
  },
  getFavorites: async function () {
    return formatAlbum(await Albums.getFavoriteAlbums())
  },
  createAlbum: async function (data) {
    const album = await Albums.createAlbum(data)
    return formatAlbum(album)
  },
  modifyAlbum: async function (albumId, data) {
    const album = await Albums.modifyAlbum(data, albumId)
    return formatAlbum(album)
  },
  deleteAlbum: async function (albumId) {
    return Albums.deleteAlbum(albumId)
  },
  downloadAlbum: async function (albumId) {
    const album = await Albums.getSingleAlbum(albumId)
    const pictures = await Albums.getPictures(albumId)
    const filename = `${album[0].name}-${moment().format('YYYYMMDDHHmmss')}.zip`
    const zipFile = await zipArchiver.compress(`./${filename}`, pictures)
    return { zipFile, filename }
  },
  addPictures: async function (albumId, data) {
    const album = await Albums.linkPictures(albumId, data)
    return formatAlbum(album)
  },
  removePictures: async function (albumId, data) {
    const album = await Albums.unlinkPictures(albumId, data)
    return formatAlbum(album)
  }
}
