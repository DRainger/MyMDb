import { RatingService } from '../services/index.js'

// Rate a movie
export const rateMovie = async (req, res, next) => {
  try {
    const { movieId, rating } = req.body
    
    if (!movieId || !rating) {
      return res.status(400).json({ message: 'Movie ID and rating are required' })
    }

    const result = await RatingService.rateMovie(req.user.id, movieId, rating)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get user's rating for a specific movie
export const getUserRating = async (req, res, next) => {
  try {
    const { movieId } = req.params
    
    const rating = await RatingService.getUserRating(req.user.id, movieId)
    res.json({ rating })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Get all user's ratings
export const getUserRatings = async (req, res, next) => {
  try {
    const ratings = await RatingService.getUserRatings(req.user.id)
    res.json({ ratings })
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Remove user's rating for a movie
export const removeRating = async (req, res, next) => {
  try {
    const { movieId } = req.params
    
    const result = await RatingService.removeRating(req.user.id, movieId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get average rating for a movie
export const getAverageRating = async (req, res, next) => {
  try {
    const { movieId } = req.params
    
    const result = await RatingService.getAverageRating(movieId)
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Get user's rating statistics
export const getUserRatingStats = async (req, res, next) => {
  try {
    const stats = await RatingService.getUserRatingStats(req.user.id)
    res.json(stats)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
}

// Get recent ratings for a user
export const getRecentRatings = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    
    // Handle case where limit might be passed as an object
    const limitValue = typeof limit === 'object' ? (limit.limit || 10) : parseInt(limit)
    
    const result = await RatingService.getRecentRatingsSimple(req.user.id, limitValue)
    
    res.json(result)
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
} 

// Fix ratings without ratedAt field
export const fixRatingsWithoutRatedAt = async (req, res, next) => {
  try {
    const result = await RatingService.fixRatingsWithoutRatedAt(req.user.id)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
} 

// Test endpoint to check database directly
export const testDatabase = async (req, res, next) => {
  try {
    const { default: User } = await import('../models/User.js')
    
    // Get all users
    const allUsers = await User.find()
    
    // Get the current user directly
    const currentUser = await User.findById(req.user.id)
    
    res.json({
      totalUsers: allUsers.length,
      currentUser: currentUser ? {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        ratingsCount: currentUser.ratings?.length || 0,
        ratings: currentUser.ratings?.slice(0, 3) || []
      } : null,
      allUserIds: allUsers.map(u => u._id.toString())
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
} 