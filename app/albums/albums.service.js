const Albums = require('./albums.db')
const PictureService = require('../pictures/pictures.service')
const generateId = require('../utils/idGenerator')

const zipArchiver = require('../utils/zipArchiver')

const moment = require('moment')

const formatAlbum = async (albums) => {
  return Promise.all(albums.map(async function (album) {
    return {
      id: album.id,
      name: album.name,
      url: `/api/v1/albums/${album.id}`,
      description: album.description,
      favorite: album.favorite > 0,
      cover: album.cover ? `/api/v1/pictures/${album.cover}` : null,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt
    }
  }))
}

module.exports = {
  getAllAlbums: async function (filters) {
    let albums = await formatAlbum(await Albums.getAlbums())
    if (filters) {
      if (filters.onlyFavorites) {
        albums = albums.filter(album => album.favorite)
      }
      if (filters.id) {
        albums = albums.filter(album => album.id === filters.id)
      }
      if (filters.withPictures) {
        albums = Promise.all(albums.map(async album => {
          album.pictures = (await PictureService.getPicturesFromAlbum(album.id))
          return album
        }))
      }
    }
    return albums
  },
  createAlbum: async function (data) {
    data.id = generateId(10)
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
