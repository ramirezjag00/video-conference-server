import express from 'express'
import passport from 'passport'

import User from '../models/user'
import UserType from '../types/User'

const router = express.Router()

router.post('/register', (req, res, next) => {
  const { username, mobile_token, password } = req.query
	const newUser: UserType = new User({ username, mobile_token })
	User.register(newUser, (password as string), (error: Error) => {
		if (error) {
			return res.status(400).send({
        data: null,
        message: error.message,
        status: 'fail'
      })
		}
		passport.authenticate('local', (authError: Error, user: UserType) => {
      if (authError) {
        return res.status(400).send({
          data: null,
          message: authError.message,
          status: 'fail'
        })
      } else if (!authError && !!user) {
        return res.status(200).send({
          data: user,
          message: 'Authenticated',
          status: 'success'
        })
      }
    })(req, res, next)
	})
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (authError: Error, user: UserType) => {
    if (authError) {
      return res.status(400).send({
        data: null,
        message: authError.message,
        status: 'fail'
      })
    } else if (!authError && !!user) {
      return res.status(200).send({
        data: user,
        message: 'Authenticated',
        status: 'success'
      })
    }
  })(req, res, next)
})

export default router
