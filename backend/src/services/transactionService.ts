import { transactionRepository, coinRepository } from '../db/repositories';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';
import { Transaction, TransactionCreateInput } from '../types';
import { ERROR_MESSAGES } from '../constants';

/**
 * Service for transaction-related business logic
 */
export class TransactionService {
  private readonly CACHE_TTL = 60 * 5; // 5 minutes

  /**
   * Get transactions for a coin
   */
  async getTransactionsByCoinId(coinId: string, page = 1, limit = 10): Promise<Transaction[]> {
    const cacheKey = `transactions:coin:${coinId}:${page}:${limit}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // Check if coin exists
      const coin = await coinRepository.findById(coinId);
      if (!coin) {
        throw new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      }

      // If not in cache, get from database
      const transactions = await transactionRepository.findByCoinId(coinId, page, limit);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(transactions), { EX: this.CACHE_TTL });

      return transactions;
    } catch (error) {
      logger.error(`Error getting transactions for coin ${coinId}:`, error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a transaction by ID
   */
  async getTransactionById(id: string): Promise<Transaction> {
    const cacheKey = `transactions:id:${id}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, get from database
      const transaction = await transactionRepository.findById(id);

      if (!transaction) {
        throw new Error(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
      }

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(transaction), { EX: this.CACHE_TTL });

      return transaction;
    } catch (error) {
      logger.error(`Error getting transaction with ID ${id}:`, error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.TRANSACTION_NOT_FOUND) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: TransactionCreateInput): Promise<Transaction> {
    try {
      // Check if coin exists
      const coin = await coinRepository.findById(data.coinId);
      if (!coin) {
        throw new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      }

      // Check if transaction with same txId already exists
      const existingTransaction = await transactionRepository.findByTxId(data.txId);
      if (existingTransaction) {
        throw new Error(ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED);
      }

      // Create the transaction
      const transaction = await transactionRepository.create(data);

      // Invalidate cache
      await redisClient.del(`transactions:coin:${data.coinId}:*`);

      return transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      if (error instanceof Error &&
          (error.message === ERROR_MESSAGES.COIN_NOT_FOUND ||
           error.message === ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED)) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.TRANSACTION_CREATION_FAILED);
    }
  }

  /**
   * Get transactions by wallet address
   */
  async getTransactionsByWalletAddress(walletAddress: string, page = 1, limit = 10): Promise<Transaction[]> {
    const cacheKey = `transactions:wallet:${walletAddress}:${page}:${limit}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, get from database
      const transactions = await transactionRepository.findByWalletAddress(walletAddress, page, limit);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(transactions), { EX: this.CACHE_TTL });

      return transactions;
    } catch (error) {
      logger.error(`Error getting transactions for wallet ${walletAddress}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get total number of transactions for a coin
   */
  async getTotalTransactionsByCoinId(coinId: string): Promise<number> {
    const cacheKey = `transactions:count:${coinId}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return parseInt(cachedData, 10);
      }

      // Check if coin exists
      const coin = await coinRepository.findById(coinId);
      if (!coin) {
        throw new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      }

      // If not in cache, get from database
      const count = await transactionRepository.countByCoinId(coinId);

      // Cache the result
      await redisClient.set(cacheKey, count.toString(), { EX: this.CACHE_TTL });

      return count;
    } catch (error) {
      logger.error(`Error getting total transactions count for coin ${coinId}:`, error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new TransactionService();
