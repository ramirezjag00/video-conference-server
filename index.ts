import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import { v4 as uuidv4 } from 'uuid'
import * as passportLocal from 'passport-local'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import User from './models/user'
import indexRoutes from './routes/index'

const app = express()
const LocalStrategy = passportLocal.Strategy
const MongoStore = connectMongo(session)
const port = 3000

mongoose.connect('mongodb://localhost/video_conference', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

const db = mongoose.connection
db.on('error', console.error.bind(console, '# MongoDB - connection error:'))
app.use(cookieParser('asddsasd'))
app.use(session({
  genid: () => uuidv4(),
	secret: 'asddsasd',
  resave: false,
  proxy: true,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 2, secure: false, httpOnly:
    true },
  unset: 'destroy',
  store: new MongoStore({ mongooseConnection: db, ttl: 2 * 24 * 60 * 60 }),
}))

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
})

app.use(cors())

app.use('/', indexRoutes)

app.listen(port, () => {
  console.log(`Video Conference Server started at http://localhost:${port}`)
})
