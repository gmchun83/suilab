import express from 'express'
import { getTransactionsByCoinId } from '../controllers/transactionsController'
import rateLimitMiddleware from '../middleware/rateLimitMiddleware'

const router = express.Router()

router.get('/transactions/:coinId', rateLimitMiddleware, getTransactionsByCoinId)

export default router
