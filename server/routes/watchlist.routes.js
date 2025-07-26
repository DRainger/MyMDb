import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlist,
  checkMovieInWatchlist,
  getWatchlistCount,
  clearWatchlist,
  getWatchlistPaginated
} from '../controllers/watchlist.controller.js'

const router = express.Router()

// All watchlist routes require authentication
router.use(authMiddleware)

// Get user's watchlist
router.get('/', getWatchlist)

// Get watchlist with pagination
router.get('/paginated', getWatchlistPaginated)

// Get watchlist count
router.get('/count', getWatchlistCount)

// Check if specific movie is in watchlist
router.get('/check/:movieId', checkMovieInWatchlist)

// Add movie to watchlist
router.post('/', addToWatchlist)

// Remove movie from watchlist
router.delete('/:movieId', removeFromWatchlist)

// Update entire watchlist (reorder, bulk operations)
router.put('/', updateWatchlist)

// Clear entire watchlist
router.delete('/', clearWatchlist)

export default router 