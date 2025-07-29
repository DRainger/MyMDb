import express from 'express'
import { 
  searchMovies, 
  getMovieById, 
  getMovieWithFullPlot, 
  searchMoviesAdvanced,
  getPopularMovies
} from '../controllers/movie.controller.js'

const router = express.Router()

// Basic search
router.get('/search', searchMovies)

// Advanced search with filters
router.get('/search/advanced', searchMoviesAdvanced)

// Get popular movies for home page
router.get('/popular', getPopularMovies)

// Get movie/series details
router.get('/:imdbId', getMovieById)

// Get movie/series with full plot
router.get('/:imdbId/full', getMovieWithFullPlot)

export default router 