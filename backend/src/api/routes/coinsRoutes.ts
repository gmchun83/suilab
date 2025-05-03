import express from 'express'
import { getCoins, getCoinById, getTrendingCoins, getLeaderboard } from '../controllers/coinsController'
import rateLimitMiddleware from '../middleware/rateLimitMiddleware'

const router = express.Router()

router.get('/coins', rateLimitMiddleware, getCoins)
router.get('/coins/trending', rateLimitMiddleware, getTrendingCoins)
router.get('/coins/leaderboard', rateLimitMiddleware, getLeaderboard)
router.get('/coins/:id', rateLimitMiddleware, getCoinById)

export default router
