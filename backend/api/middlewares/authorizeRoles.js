import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const authorizeRoles = (...roles) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed!' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found!' })
    }

    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: 'Access denied: You do not have the right role.' })
    }

    req.user = user
    next()
  }
}
