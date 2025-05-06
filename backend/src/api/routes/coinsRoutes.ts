import express from 'express';
import {
  getCoins,
  getCoinById,
  getTrendingCoins,
  createCoin,
  updateCoin,
  searchCoins,
  getCoinPriceHistory,
  getLeaderboard
} from '../controllers/coinsController';
import {
  validateCreateCoin,
  validateUpdateCoin,
  validateCoinPagination as validatePagination,
  validateSearch
} from '../validators';
import { rateLimitMiddleware, authMiddleware } from '../middleware';

const router = express.Router();

// Public routes
router.get('/api/coins', rateLimitMiddleware, validatePagination, getCoins);
router.get('/api/coins/trending', rateLimitMiddleware, getTrendingCoins);
router.get('/api/coins/search', rateLimitMiddleware, validateSearch, searchCoins);
router.get('/api/coins/leaderboard', rateLimitMiddleware, getLeaderboard);
router.get('/api/coins/:id', rateLimitMiddleware, getCoinById);
router.get('/api/coins/:id/price-history', rateLimitMiddleware, getCoinPriceHistory);

// Protected routes (require authentication)
router.post('/api/coins', rateLimitMiddleware, authMiddleware, validateCreateCoin, createCoin);
router.put('/api/coins/:id', rateLimitMiddleware, authMiddleware, validateUpdateCoin, updateCoin);

export default router;
