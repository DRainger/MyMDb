import axios from 'axios'
import { config } from '../config/index.js'

const OMDB_BASE_URL = 'http://www.omdbapi.com/'

export const searchMovies = async (req, res, next) => {
  try {
    const { q } = req.query
    if (!q) return res.status(400).json({ message: 'Query is required' })
    const omdbRes = await axios.get(OMDB_BASE_URL, {
      params: { apikey: config.omdbApiKey, s: q }
    })
    res.json(omdbRes.data)
  } catch (err) {
    next(err)
  }
}

export const getMovieById = async (req, res, next) => {
  try {
    const { imdbId } = req.params
    if (!imdbId) return res.status(400).json({ message: 'imdbId is required' })
    const omdbRes = await axios.get(OMDB_BASE_URL, {
      params: { apikey: config.omdbApiKey, i: imdbId }
    })
    res.json(omdbRes.data)
  } catch (err) {
    next(err)
  }
} 