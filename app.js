const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())
app.use(express.static('public'))

const routerV1 = express.Router()

require('./app/albums/albums.routes')(routerV1)
require('./app/pictures/pictures.routes')(routerV1)

app.use('/api/v1', routerV1)

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

module.exports = app
