import express from 'express';
import {
  getTransactionsByCoinId,
  getTransactionById,
  createTransaction,
  getTransactionsByWalletAddress
} from '../controllers/transactionsController';
import {
  validateCreateTransaction,
  validateTransactionPagination as validatePagination
} from '../validators';
import { rateLimitMiddleware, authMiddleware } from '../middleware';

const router = express.Router();

// Public routes
router.get('/api/transactions/coin/:coinId', rateLimitMiddleware, validatePagination, getTransactionsByCoinId);
router.get('/api/transactions/wallet/:walletAddress', rateLimitMiddleware, validatePagination, getTransactionsByWalletAddress);
router.get('/api/transactions/:id', rateLimitMiddleware, getTransactionById);

// Protected routes (require authentication)
router.post('/api/transactions', rateLimitMiddleware, authMiddleware, validateCreateTransaction, createTransaction);

export default router;
