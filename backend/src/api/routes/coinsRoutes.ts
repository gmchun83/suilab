import express from 'express';
import {
  getCoins,
  getCoinById,
  getTrendingCoins,
  createCoin,
  updateCoin,
  searchCoins
} from '../controllers/coinsController';
import {
  validateCreateCoin,
  validateUpdateCoin,
  validatePagination,
  validateSearch
} from '../validators';
import { rateLimitMiddleware, authMiddleware } from '../middleware';

const router = express.Router();

// Public routes
router.get('/coins', rateLimitMiddleware, validatePagination, getCoins);
router.get('/coins/trending', rateLimitMiddleware, getTrendingCoins);
router.get('/coins/search', rateLimitMiddleware, validateSearch, searchCoins);
router.get('/coins/:id', rateLimitMiddleware, getCoinById);

// Protected routes (require authentication)
router.post('/coins', rateLimitMiddleware, authMiddleware, validateCreateCoin, createCoin);
router.put('/coins/:id', rateLimitMiddleware, authMiddleware, validateUpdateCoin, updateCoin);

export default router;
