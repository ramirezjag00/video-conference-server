import { Request, Response, NextFunction } from 'express'

import RequestStateTypes from '../types/UserRequest'

const isLoggedIn = (req: Request, res: Response, next: NextFunction): void | Response => {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.status(401).send({
    data: null,
    message: 'You are not authorized to do this task',
    status: RequestStateTypes.FAIL
  })
}

export default isLoggedIn
