import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  getUserRecommendations,
  getNewUserRecommendations,
  getTrendingMovies,
  getSimilarMovies,
  getPopularMovies
} from '../controllers/recommendation.controller.js'

const router = express.Router()

// Get personalized recommendations (requires auth)
router.get('/user', authMiddleware, getUserRecommendations)

// Get recommendations for new users (no auth required)
router.get('/new-user', getNewUserRecommendations)

// Get trending movies (no auth required)
router.get('/trending', getTrendingMovies)

// Get popular movies (no auth required)
router.get('/popular', getPopularMovies)

// Get similar movies based on a specific movie (no auth required)
router.get('/similar/:movieId', getSimilarMovies)

export default router 