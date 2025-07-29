import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  rateMovie,
  getUserRating,
  getUserRatings,
  removeRating,
  getAverageRating,
  getUserRatingStats,
  getRecentRatings,
  fixRatingsWithoutRatedAt
} from '../controllers/rating.controller.js'

const router = express.Router()

// All rating routes require authentication
router.use(authMiddleware)

// Rate a movie
router.post('/', rateMovie)

// Get user's rating for a specific movie
router.get('/movie/:movieId', getUserRating)

// Get all user's ratings
router.get('/user', getUserRatings)

// Get user's rating statistics
router.get('/stats', getUserRatingStats)

// Get recent ratings for a user
router.get('/recent', getRecentRatings)

// Fix ratings without ratedAt field
router.post('/fix-ratings', fixRatingsWithoutRatedAt)

// Remove user's rating for a movie
router.delete('/:movieId', removeRating)

// Get average rating for a movie (public endpoint)
router.get('/average/:movieId', getAverageRating)

export default router 