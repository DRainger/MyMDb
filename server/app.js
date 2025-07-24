import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import {config} from './config/index.js'
import connectDB from './config/database.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import router from './routes/index.js'


const app = express()

// חיבור למסד נתונים
connectDB()

// Middleware בסיסי
app.use(cors({
  origin: config.clientUrl,
  credentials: true
}))
app.use(express.json({ limit: config.maxFileSize }))
app.use(express.urlencoded({ extended: true }))

// נתיב בריאות השרת
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Server is running properly',
    environment: process.env.NODE_ENV || 'development'
  })
})

// נתיב בסיסי
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the project server!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  })
})

// TODO: הוסף נתיבי API
app.use('/api', router)

// Middleware לטיפול ב-404
app.use(notFound)

// Middleware לטיפול בשגיאות כלליות
app.use(errorHandler)

export default app
