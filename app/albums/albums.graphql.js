const AlbumService = require('./albums.service')

module.exports = async ({ id, onlyFavorites }) => {
  if (onlyFavorites) {
    return AlbumService.getFavorites()
  } else if (id) {
    return AlbumService.getSingleAlbum(id)
  } else {
    return AlbumService.getAllAlbums()
  }
}
