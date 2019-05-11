const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const graphqlHTTP = require('express-graphql')
const { buildSchema } = require('graphql')

const app = express()

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())
app.use(express.static('public/dist', { maxAge: 86400000 }))

var schema = buildSchema(`
  scalar Date

  type Query {
    albums(id: String, onlyFavorites: Boolean): [Album]
  }
  
  type Album {
    id: String!
    name: String!
    url: String!
    description: String
    cover: String
    createdAt: Date
    updatedAt: Date
    pictures: [Picture]
  }
  
  type Picture {
    id: String!
    name: String!
    url: String
    favorite: Boolean
    takenAt: Date
    coordinates: Coordinate
  }
  
  type Coordinate {
    latitude: Float
    longitude: Float
  }
`)

var root = {
  albums: require('./app/albums/albums.graphql')
}

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

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
