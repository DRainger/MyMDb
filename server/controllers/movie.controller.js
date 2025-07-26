import { MovieService } from '../services/index.js'

export const searchMovies = async (req, res, next) => {
  try {
    const result = await MovieService.searchMovies(req.query.q)
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
    const result = await MovieService.searchMoviesAdvanced(req.query)
    res.json(result)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
} 