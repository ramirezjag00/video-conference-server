import express from 'express'
import passport from 'passport'

import User from '../models/user'
import UserType from '../types/User'
import RequestStateTypes from '../types/UserRequest'
import isLoggedIn from '../middlware/isLoggedIn'

const router = express.Router()

router.post('/register', (req, res, next) => {
  const { username, mobile_token, password } = req.query
	const newUser: UserType = new User({ username, mobile_token })
	User.register(newUser, (password as string), (error: Error) => {
		if (error) {
			return res.status(500).send({
        data: null,
        message: error.message,
        status: RequestStateTypes.FAIL
      })
		}
		passport.authenticate('local', (authError: Error, user: UserType) => {
      if (authError) {
        return res.status(401).send({
          data: null,
          message: authError.message,
          status: RequestStateTypes.FAIL
        })
      } else if (!authError && !!user) {
        req.login(user, (err: Error) => {
          if (err) {
            return res.status(401).send({
              data: null,
              message: err.message,
              status: RequestStateTypes.FAIL
            })
          }
          const filteredUser = {
            id: user._id,
            username: user.username,
            mobile_token: mobile_token || user.mobile_token,
          }
          return res.status(200).send({
            data: filteredUser,
            message: 'Authenticated',
            status: RequestStateTypes.SUCCESS
          })
        })
      }
    })(req, res, next)
	})
})

router.post('/login', (req, res, next) => {
  const { mobile_token, username }: { mobile_token?: string, username?: string } = req.query
  passport.authenticate('local', async (authError: Error, user: UserType) => {
    if (authError) {
      return res.status(401).send({
        data: null,
        message: authError.message,
        status: RequestStateTypes.FAIL
      })
    } else if (!authError && !!user) {
      req.login(user, async (error: Error) => {
        if (error) {
          return res.status(401).send({
            data: null,
            message: error.message,
            status: RequestStateTypes.FAIL
          })
        }

        const filteredUser = {
          id: user._id,
          username: user.username,
          mobile_token: mobile_token || user.mobile_token,
        }
        if (mobile_token) {
          await User.findOneAndUpdate({ username }, { mobile_token }, { new: true, upsert: true }, (dbError: Error) => {
            if (dbError) {
              return res.status(500).send({
                data: null,
                message: dbError.message,
                status: RequestStateTypes.FAIL
              })
            }
          })
          return res.status(200).send({
            data: filteredUser ,
            message: 'Authenticated',
            status: RequestStateTypes.SUCCESS
          })
        }
        return res.status(200).send({
          data: filteredUser ,
          message: 'Authenticated',
          status: RequestStateTypes.SUCCESS
        })
      })
    }
  })(req, res, next)
})

router.get('/users', async (_req, res) => {
  await User.find({ username: { $exists: true } }, (dbError: Error, users: UserType[]) => {
    if (dbError) {
      return res.status(500).send({
        data: null,
        message: dbError.message,
        status: RequestStateTypes.FAIL
      })
    } else if (users.length === 0) {
      return res.status(200).send({
        data: [],
        message: 'No users found',
        status: RequestStateTypes.SUCCESS
      })
    }
    const filteredUsers = users.map(user => (
      {
        id: user._id,
        username: user.username,
        mobile_token: user.mobile_token,
      }
    ))
    return res.status(200).send({
      data: filteredUsers,
      message: null,
      status: RequestStateTypes.SUCCESS
    })
  })
})

router.get('/user', async (req, res) => {
  const { username }: { username?: string } = req.query
  await User.findOne({ username }, (dbError: Error, user: UserType) => {
    if (dbError) {
      return res.status(500).send({
        data: null,
        message: dbError.message,
        status: RequestStateTypes.FAIL
      })
    } else if (!user) {
      return res.status(200).send({
        data: null,
        message: `No account with username ${username} found`,
        status: RequestStateTypes.SUCCESS
      })
    }
    const filteredUser = {
      id: user._id,
      username: user.username,
      mobile_token: user.mobile_token,
    }
    return res.status(200).send({
      data: filteredUser,
      message: null,
      status: RequestStateTypes.SUCCESS
    })
  })
})

router.delete("/user", isLoggedIn, async (req, res) => {
  const { username } = req.query
  const user = await User.findByUsername((username as string), false)
  User.findByIdAndRemove(user._id, (err: Error) => {
		if(err){
			return res.status(400).send({
        data: null,
        message: err.message,
        status: RequestStateTypes.FAIL
      })
		} else {
      req.logout()
			return res.status(200).send({
        data: null,
        message: `Deleted account with username ${username}`,
        status: RequestStateTypes.SUCCESS
      })
		}
	})
})


router.get('/logout', (req, res) => {
	req.logout()
	res.status(200).send({
    data: null,
    message: 'Logged Out',
    status: RequestStateTypes.SUCCESS
  })
})

export default router
