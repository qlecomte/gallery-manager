const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

module.exports.compress = function (outputPath, inputFiles) {
  const output = fs.createWriteStream(outputPath)

  const archive = archiver('zip', {
    gzip: true,
    zlib: { level: 9 } // Sets the compression level.
  })

  return new Promise(function (resolve) {
    archive.on('error', function (err) {
      throw err
    })

    output.on('error', function (err) {
      throw err
    })

    output.on('close', function () {
      resolve(path.resolve(outputPath))
    })

    archive.pipe(output)

    inputFiles.forEach(function (file) {
      const extension = path.extname(file.path)
      let name = file.name
      if (!file.name.endsWith(extension)) {
        name = file.name + extension
      }
      archive.file(file.path, { name: name })
    })

    archive.finalize()
  })
}
