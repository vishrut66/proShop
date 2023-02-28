import jwt from 'jsonwebtoken'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import User from '../models/userModel.js'

const protect = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {

    token = req.headers.authorization.split(' ')[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)


    if (!decoded) {
      return next(new AppError('Not authorized, token failed'), 401)
    }

    const user = await User.findById(decoded.id)

    req.user = user


    next()

  }


  if (!token) {
    return next(new AppError('Not authorized, no token'), 401);
  }
})

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    return next(new AppError('Not authorized as an admin'), 401)
  }
}

export { protect, admin }
