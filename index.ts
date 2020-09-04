import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import * as passportLocal from 'passport-local'
import session from 'express-session'

import User from './models/user'
import indexRoutes from './routes/index'

const app = express()
const LocalStrategy = passportLocal.Strategy
const port = 3000

mongoose.connect('mongodb://localhost/video_conference', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false })

app.use(session({
	secret: 'MEOWOWOWOW',
	resave: false,
	saveUninitialized: false,
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

app.use('/', indexRoutes)

app.listen(port, () => {
  console.log(`Video Conference Server started at http://localhost:${port}`)
})
