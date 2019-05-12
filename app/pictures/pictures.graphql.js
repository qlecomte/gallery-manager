const PictureService = require('./pictures.service')

module.exports = async ({ id, onlyFavorites, onMap }) => {
  return PictureService.getAllPictures({ id, onlyFavorites, onMap })
}
