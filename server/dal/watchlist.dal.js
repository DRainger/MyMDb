import User from '../models/User.js'

/**
 * Watchlist Data Access Layer
 * Contains all database operations related to user watchlists
 */

// Get user watchlist
export const getUserWatchlist = async (userId) => {
  try {
    const user = await User.findById(userId)
    return user ? user.watchlist : null
  } catch (error) {
    throw error
  }
}

// Add movie to watchlist
export const addMovieToWatchlist = async (userId, movieId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    // Check if movie already exists in watchlist
    if (user.watchlist.some(item => item.movieId === movieId)) {
      throw new Error('Movie already in watchlist')
    }
    
    user.watchlist.push({ movieId })
    return await user.save()
  } catch (error) {
    throw error
  }
}

// Remove movie from watchlist
export const removeMovieFromWatchlist = async (userId, movieId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    user.watchlist = user.watchlist.filter(item => item.movieId !== movieId)
    return await user.save()
  } catch (error) {
    throw error
  }
}

// Update entire watchlist
export const updateUserWatchlist = async (userId, watchlist) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    user.watchlist = watchlist.map(item => ({ 
      movieId: item.movieId, 
      addedAt: item.addedAt || new Date() 
    }))
    return await user.save()
  } catch (error) {
    throw error
  }
}

// Check if movie is in user's watchlist
export const isMovieInWatchlist = async (userId, movieId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    return user.watchlist.some(item => item.movieId === movieId)
  } catch (error) {
    throw error
  }
}

// Get watchlist count
export const getWatchlistCount = async (userId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    return user.watchlist.length
  } catch (error) {
    throw error
  }
}

// Clear entire watchlist
export const clearWatchlist = async (userId) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    user.watchlist = []
    return await user.save()
  } catch (error) {
    throw error
  }
}

// Get watchlist with pagination
export const getWatchlistPaginated = async (userId, page = 1, limit = 10) => {
  try {
    const user = await User.findById(userId)
    if (!user) return null
    
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    
    const watchlist = user.watchlist.slice(startIndex, endIndex)
    const total = user.watchlist.length
    const totalPages = Math.ceil(total / limit)
    
    return {
      watchlist,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  } catch (error) {
    throw error
  }
} 