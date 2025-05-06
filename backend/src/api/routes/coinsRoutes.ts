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
router.get('/coins', rateLimitMiddleware, validatePagination, getCoins);
router.get('/coins/trending', rateLimitMiddleware, getTrendingCoins);
router.get('/coins/search', rateLimitMiddleware, validateSearch, searchCoins);
router.get('/coins/leaderboard', rateLimitMiddleware, getLeaderboard);
router.get('/coins/:id', rateLimitMiddleware, getCoinById);
router.get('/coins/:id/price-history', rateLimitMiddleware, getCoinPriceHistory);

// Protected routes (require authentication)
router.post('/coins', rateLimitMiddleware, authMiddleware, validateCreateCoin, createCoin);
router.put('/coins/:id', rateLimitMiddleware, authMiddleware, validateUpdateCoin, updateCoin);

export default router;
