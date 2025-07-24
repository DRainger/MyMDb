import express from 'express'
import { searchMovies, getMovieById } from '../controllers/movie.controller.js'

const router = express.Router()

router.get('/search', searchMovies)
router.get('/:imdbId', getMovieById)

export default router 