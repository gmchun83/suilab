import { prisma } from '../../config';
import { logger } from '../../utils/logger';
import { Transaction, TransactionCreateInput } from '../../types';

// Transaction types enum
export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  BURN = 'BURN'
}

/**
 * Repository for transaction-related database operations
 */
export class TransactionRepository {
  /**
   * Find all transactions with pagination
   */
  async findAll(page = 1, limit = 10): Promise<Transaction[]> {
    try {
      const skip = (page - 1) * limit;

      const transactions = await prisma.transaction.findMany({
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
      });

      return transactions as unknown as Transaction[];
    } catch (error) {
      logger.error('Error finding all transactions:', error);
      throw error;
    }
  }
  /**
   * Find all transactions for a coin
   */
  async findByCoinId(coinId: string, page = 1, limit = 10): Promise<Transaction[]> {
    try {
      const skip = (page - 1) * limit;

      const transactions = await prisma.transaction.findMany({
        where: { coinId },
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
      });

      return transactions as unknown as Transaction[];
    } catch (error) {
      logger.error(`Error finding transactions for coin ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Find a transaction by ID
   */
  async findById(id: string): Promise<Transaction | null> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { id },
      });

      return transaction as unknown as Transaction | null;
    } catch (error) {
      logger.error(`Error finding transaction with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a transaction by transaction hash
   */
  async findByTxId(txId: string): Promise<Transaction | null> {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { txId },
      });

      return transaction as unknown as Transaction | null;
    } catch (error) {
      logger.error(`Error finding transaction with txId ${txId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new transaction
   */
  async create(data: TransactionCreateInput): Promise<Transaction> {
    try {
      // Convert string amount to bigint for Prisma
      const prismaData = {
        ...data,
        amount: BigInt(data.amount)
      };

      const transaction = await prisma.transaction.create({
        data: prismaData as any,
      });

      return transaction as unknown as Transaction;
    } catch (error) {
      logger.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Find transactions by wallet address
   */
  async findByWalletAddress(walletAddress: string, page = 1, limit = 10): Promise<Transaction[]> {
    try {
      const skip = (page - 1) * limit;

      const transactions = await prisma.transaction.findMany({
        where: { walletAddress },
        skip,
        take: limit,
        orderBy: {
          timestamp: 'desc',
        },
      });

      return transactions as unknown as Transaction[];
    } catch (error) {
      logger.error(`Error finding transactions for wallet ${walletAddress}:`, error);
      throw error;
    }
  }

  /**
   * Count total number of transactions for a coin
   */
  async countByCoinId(coinId: string): Promise<number> {
    try {
      const count = await prisma.transaction.count({
        where: { coinId },
      });

      return count;
    } catch (error) {
      logger.error(`Error counting transactions for coin ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Count total number of transactions
   */
  async count(): Promise<number> {
    try {
      const count = await prisma.transaction.count();
      return count;
    } catch (error) {
      logger.error('Error counting transactions:', error);
      throw error;
    }
  }

  /**
   * Get transaction statistics for a coin
   */
  async getTransactionStats(coinId: string): Promise<{ totalVolume: string; buyCount: number; sellCount: number }> {
    try {
      // Get total volume
      const volumeData = await prisma.transaction.aggregate({
        where: { coinId },
        _sum: { amount: true }
      });

      // Get buy count
      const buyCount = await prisma.transaction.count({
        where: {
          coinId,
          type: TransactionType.BUY
        }
      });

      // Get sell count
      const sellCount = await prisma.transaction.count({
        where: {
          coinId,
          type: TransactionType.SELL
        }
      });

      return {
        totalVolume: volumeData._sum.amount?.toString() || '0',
        buyCount,
        sellCount
      };
    } catch (error) {
      logger.error(`Error getting transaction stats for coin ${coinId}:`, error);
      throw error;
    }
  }

  /**
   * Get recent transactions across all coins
   */
  async getRecentTransactions(limit: number): Promise<Transaction[]> {
    try {
      const transactions = await prisma.transaction.findMany({
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: { coin: true }
      });

      return transactions as unknown as Transaction[];
    } catch (error) {
      logger.error('Error getting recent transactions:', error);
      throw error;
    }
  }

  /**
   * Get transactions by type for a coin
   */
  async getTransactionsByType(
    coinId: string,
    type: TransactionType,
    page = 1,
    limit = 10
  ): Promise<Transaction[]> {
    try {
      const skip = (page - 1) * limit;

      const transactions = await prisma.transaction.findMany({
        where: {
          coinId,
          type
        },
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' }
      });

      return transactions as unknown as Transaction[];
    } catch (error) {
      logger.error(`Error getting transactions by type for coin ${coinId}:`, error);
      throw error;
    }
  }
}

export default new TransactionRepository();
