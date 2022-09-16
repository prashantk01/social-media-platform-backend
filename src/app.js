const express = require('express')
require('./mongodb/mongoose')
require('dotenv').config()

const app = express()

app.use(express.json())
module.exports = app