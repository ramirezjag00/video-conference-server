import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

const app = express()
const port = 3000

mongoose.connect('mongodb://localhost/video_conference', { useNewUrlParser: true, useUnifiedTopology: true })
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Video Conference Server started at http://localhost:${port}`)
})
