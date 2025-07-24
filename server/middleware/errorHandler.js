import {config} from '../config/index.js'

// middleware לטיפול בשגיאות כלליות
const errorHandler = (error, req, res, next) => {
  console.error('Error:', error.stack)

  // שגיאות ידועות
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message)
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    })
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID'
    })
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    })
  }

  // שגיאה כללית
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(config.nodeEnv === 'development' && { 
      stack: error.stack,
      details: error 
    })
  })
}

// middleware ליצירת שגיאה מותאמת אישית
const createError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

// middleware לטיפול בנתיבים לא נמצאו
const notFound = (req, res, next) => {
  const error = createError(404, `Route '${req.originalUrl}' not found`)
  next(error)
}

// wrapper לפונקציות async
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

export { errorHandler, createError, notFound, asyncHandler }
