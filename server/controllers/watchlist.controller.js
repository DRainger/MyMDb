import { createLogger } from '../utils/logger.js'
import {
  getUserWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  updateUserWatchlist,
  isMovieInWatchlist,
  getWatchlistCount as getWatchlistCountFromDAL,
  clearWatchlist as clearWatchlistFromDAL,
  getWatchlistPaginated as getWatchlistPaginatedFromDAL
} from '../dal/index.js'

const logger = createLogger('WATCHLIST-CONTROLLER')

// Get current user's watchlist
export const getWatchlist = async (req, res, next) => {
  try {
    const watchlist = await getUserWatchlist(req.user.id)
    if (watchlist === null) return res.status(404).json({ message: 'User not found' })
    res.json(watchlist)
  } catch (err) {
    next(err)
  }
}

// Add a movie to watchlist
export const addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.body
    if (!movieId) {
      logger.warn(`Add to watchlist attempt without movieId for user: ${req.user.id}`)
      return res.status(400).json({ message: 'movieId is required' })
    }
    
    logger.info(`Adding movie ${movieId} to watchlist for user: ${req.user.id}`)
    const user = await addMovieToWatchlist(req.user.id, movieId)
    if (!user) {
      logger.warn(`User not found when adding to watchlist: ${req.user.id}`)
      return res.status(404).json({ message: 'User not found' })
    }
    
    logger.info(`Movie ${movieId} added to watchlist for user: ${req.user.id}`)
    res.status(201).json(user.watchlist)
  } catch (err) {
    if (err.message === 'Movie already in watchlist') {
      logger.warn(`Duplicate movie add attempt: ${req.body.movieId} for user: ${req.user.id}`)
      return res.status(400).json({ message: err.message })
    }
    logger.error(`Error adding to watchlist: ${err.message}`)
    next(err)
  }
}

// Remove a movie from watchlist
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const user = await removeMovieFromWatchlist(req.user.id, movieId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.watchlist)
  } catch (err) {
    next(err)
  }
}

// Update/reorder entire watchlist
export const updateWatchlist = async (req, res, next) => {
  try {
    const { watchlist } = req.body // should be an array of { movieId }
    if (!Array.isArray(watchlist)) return res.status(400).json({ message: 'watchlist must be an array' })
    
    const user = await updateUserWatchlist(req.user.id, watchlist)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json(user.watchlist)
  } catch (err) {
    next(err)
  }
}

// Check if movie is in user's watchlist
export const checkMovieInWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const isInWatchlist = await isMovieInWatchlist(req.user.id, movieId)
    if (isInWatchlist === null) return res.status(404).json({ message: 'User not found' })
    
    res.json({ isInWatchlist, movieId })
  } catch (err) {
    next(err)
  }
}

// Get watchlist count
export const getWatchlistCount = async (req, res, next) => {
  try {
    const count = await getWatchlistCountFromDAL(req.user.id)
    if (count === null) return res.status(404).json({ message: 'User not found' })
    
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

// Clear entire watchlist
export const clearWatchlist = async (req, res, next) => {
  try {
    const user = await clearWatchlistFromDAL(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    
    res.json({ message: 'Watchlist cleared', watchlist: user.watchlist })
  } catch (err) {
    next(err)
  }
}

// Get watchlist with pagination
export const getWatchlistPaginated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const result = await getWatchlistPaginatedFromDAL(req.user.id, parseInt(page), parseInt(limit))
    if (!result) return res.status(404).json({ message: 'User not found' })
    
    res.json(result)
  } catch (err) {
    next(err)
  }
} 