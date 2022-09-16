const express = require('express')
require('./mongodb/mongoose')

const userRouter = require("./routes/user.route")
const postRouter = require("./routes/post.route")
const app = express()

app.use(express.json())

app.use("/api/posts", postRouter)
app.use("/api/user", userRouter)

module.exports = app