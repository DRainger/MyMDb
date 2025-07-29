import { WatchlistService } from '../services/index.js'

// Get current user's watchlist
export const getWatchlist = async (req, res, next) => {
  try {
    const result = await WatchlistService.getUserWatchlist(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Add a movie to watchlist
export const addToWatchlist = async (req, res, next) => {
  try {
    const watchlist = await WatchlistService.addMovieToWatchlist(req.user.id, req.body.movieId)
    res.status(201).json({ message: 'Movie added to watchlist', watchlist })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Remove a movie from watchlist
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const watchlist = await WatchlistService.removeMovieFromWatchlist(req.user.id, req.params.movieId)
    res.json({ message: 'Movie removed from watchlist', watchlist })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Update/reorder entire watchlist
export const updateWatchlist = async (req, res, next) => {
  try {
    const watchlist = await WatchlistService.updateWatchlist(req.user.id, req.body.watchlist)
    res.json({ message: 'Watchlist updated', watchlist })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Check if movie is in user's watchlist
export const checkMovieInWatchlist = async (req, res, next) => {
  try {
    const result = await WatchlistService.checkMovieInWatchlist(req.user.id, req.params.movieId)
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Get watchlist count
export const getWatchlistCount = async (req, res, next) => {
  try {
    const result = await WatchlistService.getWatchlistCount(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Clear entire watchlist
export const clearWatchlist = async (req, res, next) => {
  try {
    const result = await WatchlistService.clearWatchlist(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Get watchlist with pagination
export const getWatchlistPaginated = async (req, res, next) => {
  try {
    const { page, limit } = req.query
    const result = await WatchlistService.getWatchlistPaginated(req.user.id, page, limit)
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
} 