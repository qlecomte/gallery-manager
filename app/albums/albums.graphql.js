const AlbumService = require('./albums.service')

module.exports = async ({ id, onlyFavorites }) => {
  return AlbumService.getAllAlbums({ id, onlyFavorites })
}
