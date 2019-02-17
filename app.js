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

require('./app/albums/albums.routes')(app)
require('./app/pictures/pictures.routes')(app)

module.exports = app
