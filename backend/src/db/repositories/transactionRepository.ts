import { prisma } from '../../config';
import { logger } from '../../utils/logger';
import { Transaction, TransactionCreateInput } from '../../types';

/**
 * Repository for transaction-related database operations
 */
export class TransactionRepository {
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
}

export default new TransactionRepository();
