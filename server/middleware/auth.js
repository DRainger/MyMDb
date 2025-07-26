import { verifyToken } from '../utils/token.js'
import { createLogger } from '../utils/logger.js'

const logger = createLogger('AUTH-MIDDLEWARE')

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization')
  const token = authHeader && authHeader.replace('Bearer ', '')

  if (!token) {
    logger.warn('Authentication attempt without token')
    return res.status(401).json({ message: 'No token, authorization denied' })
  }

  try {
    const decoded = await verifyToken(token)
    req.user = decoded // Attach user info to request
    logger.debug(`User authenticated: ${decoded.id}`)
    next()
  } catch (err) {
    logger.warn(`Token verification failed: ${err.message}`)
    res.status(401).json({ message: 'Token is not valid' })
  }
}

export default authMiddleware
