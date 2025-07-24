import express from 'express'
import authMiddleware from '../middleware/auth.js'
import {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlist
} from '../controllers/user.controller.js'

const router = express.Router()

// Self-service endpoints
router.get('/me', authMiddleware, getMe)
router.put('/me', authMiddleware, updateMe)
router.delete('/me', authMiddleware, deleteMe)

// Watchlist endpoints
router.get('/me/watchlist', authMiddleware, getWatchlist)
router.post('/me/watchlist', authMiddleware, addToWatchlist)
router.delete('/me/watchlist/:movieId', authMiddleware, removeFromWatchlist)
router.put('/me/watchlist', authMiddleware, updateWatchlist)

// Admin endpoints (add admin middleware later)
router.get('/', authMiddleware, getAllUsers)
router.get('/:id', authMiddleware, getUserById)
router.put('/:id', authMiddleware, updateUserById)
router.delete('/:id', authMiddleware, deleteUserById)

export default router 