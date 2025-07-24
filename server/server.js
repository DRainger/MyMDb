import app from './app.js'
import {config} from './config/index.js'

const PORT = config.port

// Graceful shutdown function
const gracefulShutdown = (server) => {
  return (signal) => {
    console.log(`\nReceived ${signal}, shutting down server gracefully...`)
    
    server.close(() => {
      console.log('Server closed successfully')
      process.exit(0)
    })
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forcing shutdown after timeout')
      process.exit(1)
    }, 10000)
  }
}

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${config.nodeEnv}`)
  console.log(`URL: http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})

// טיפול בסגירה חלקה
process.on('SIGTERM', gracefulShutdown(server))
process.on('SIGINT', gracefulShutdown(server))

// טיפול בשגיאות לא מטופלות
process.on('uncaughtException', (error) => {
  console.error('💥 שגיאה לא מטופלת:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise לא מטופל:', promise, 'סיבה:', reason)
  process.exit(1)
})

export default server
