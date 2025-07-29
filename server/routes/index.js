import express from 'express'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import movieRoutes from './movie.routes.js'
import watchlistRoutes from './watchlist.routes.js'
import ratingRoutes from './rating.routes.js'
import recommendationRoutes from './recommendation.routes.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/movies', movieRoutes)
router.use('/watchlist', watchlistRoutes)
router.use('/ratings', ratingRoutes)
router.use('/recommendations', recommendationRoutes)

export default router
