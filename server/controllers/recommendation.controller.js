import { RecommendationService } from '../services/index.js'

// Get personalized recommendations for the current user
export const getUserRecommendations = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    
    const recommendations = await RecommendationService.getUserRecommendations(
      req.user.id, 
      parseInt(limit)
    )
    
    res.json({
      recommendations,
      count: recommendations.length,
      type: 'personalized'
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get recommendations for new users
export const getNewUserRecommendations = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    
    const recommendations = await RecommendationService.getNewUserRecommendations(
      parseInt(limit)
    )
    
    res.json({
      recommendations,
      count: recommendations.length,
      type: 'new_user'
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get trending movies
export const getTrendingMovies = async (req, res, next) => {
  try {
    const { limit = 8 } = req.query
    
    const trendingMovies = await RecommendationService.getTrendingMovies(
      parseInt(limit)
    )
    
    res.json({
      recommendations: trendingMovies,
      count: trendingMovies.length,
      type: 'trending'
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get similar movies based on a specific movie
export const getSimilarMovies = async (req, res, next) => {
  try {
    const { movieId } = req.params
    const { limit = 6 } = req.query
    
    const similarMovies = await RecommendationService.getSimilarMovies(
      movieId,
      parseInt(limit)
    )
    
    res.json({
      recommendations: similarMovies,
      count: similarMovies.length,
      type: 'similar',
      baseMovieId: movieId
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// Get popular movies
export const getPopularMovies = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query
    
    const popularMovies = await RecommendationService.getPopularMovies(
      parseInt(limit)
    )
    
    res.json({
      recommendations: popularMovies,
      count: popularMovies.length,
      type: 'popular'
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
} 