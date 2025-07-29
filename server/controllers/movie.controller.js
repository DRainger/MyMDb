import { MovieService } from '../services/index.js'

export const searchMovies = async (req, res, next) => {
  try {
    const { q, type, year, page } = req.query
    
    // Only pass the query parameter to the service
    const result = await MovieService.searchMovies(q)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const getMovieById = async (req, res, next) => {
  try {
    const result = await MovieService.getMovieById(req.params.imdbId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const getMovieWithFullPlot = async (req, res, next) => {
  try {
    const result = await MovieService.getMovieWithFullPlot(req.params.imdbId)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const searchMoviesAdvanced = async (req, res, next) => {
  try {
    // Only pass valid parameters
    const validParams = {}
    if (req.query.query) validParams.query = req.query.query
    if (req.query.type && ['movie', 'series', 'episode'].includes(req.query.type)) {
      validParams.type = req.query.type
    }
    if (req.query.year && /^\d{4}$/.test(req.query.year)) {
      validParams.year = req.query.year
    }
    if (req.query.page && parseInt(req.query.page) > 0) {
      validParams.page = req.query.page
    }
    
    const result = await MovieService.searchMoviesAdvanced(validParams)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const getPopularMovies = async (req, res, next) => {
  try {
    const result = await MovieService.getPopularMovies()
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
} 