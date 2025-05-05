import express from 'express';
import {
  getTransactionsByCoinId,
  getTransactionById,
  createTransaction,
  getTransactionsByWalletAddress
} from '../controllers/transactionsController';
import {
  validateCreateTransaction,
  validatePagination
} from '../validators';
import { rateLimitMiddleware, authMiddleware } from '../middleware';

const router = express.Router();

// Public routes
router.get('/transactions/coin/:coinId', rateLimitMiddleware, validatePagination, getTransactionsByCoinId);
router.get('/transactions/:id', rateLimitMiddleware, getTransactionById);
router.get('/transactions/wallet/:walletAddress', rateLimitMiddleware, validatePagination, getTransactionsByWalletAddress);

// Protected routes (require authentication)
router.post('/transactions', rateLimitMiddleware, authMiddleware, validateCreateTransaction, createTransaction);

export default router;
