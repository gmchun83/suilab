import { TransactionRepository } from '../../../db/repositories/transactionRepository';
import { prisma } from '../../../config';
import { logger } from '../../../utils/logger';
import { TransactionType } from '../../../types/transaction';

// Mock Prisma
jest.mock('../../../config', () => ({
  prisma: {
    transaction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      count: jest.fn()
    }
  }
}));

// Mock logger
jest.mock('../../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('Transaction Repository', () => {
  let transactionRepository: TransactionRepository;

  beforeEach(() => {
    transactionRepository = new TransactionRepository();
    jest.clearAllMocks();
  });

  // Note: findAll method is not implemented in the repository

  describe('findById', () => {
    it('should return a transaction by ID', async () => {
      const mockTransaction = { id: '1', coinId: 'coin1', amount: '100' };

      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await transactionRepository.findById('1');

      expect(prisma.transaction.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual(mockTransaction);
    });

    it('should return null if transaction not found', async () => {
      (prisma.transaction.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await transactionRepository.findById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.transaction.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(transactionRepository.findById('1')).rejects.toThrow('Database error');
    });
  });

  describe('findByCoinId', () => {
    it('should return transactions by coin ID with pagination', async () => {
      const mockTransactions = [
        { id: '1', coinId: 'coin1', amount: '100' },
        { id: '2', coinId: 'coin1', amount: '200' }
      ];

      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await transactionRepository.findByCoinId('coin1', 1, 10);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { coinId: 'coin1' },
        skip: 0,
        take: 10,
        orderBy: { timestamp: 'desc' }
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should handle custom pagination', async () => {
      const mockTransactions = [{ id: '3', coinId: 'coin1', amount: '300' }];

      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await transactionRepository.findByCoinId('coin1', 2, 5);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { coinId: 'coin1' },
        skip: 5,
        take: 5,
        orderBy: { timestamp: 'desc' }
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.transaction.findMany as jest.Mock).mockRejectedValue(error);

      await expect(transactionRepository.findByCoinId('coin1', 1, 10)).rejects.toThrow('Database error');
    });
  });

  describe('findByWalletAddress', () => {
    it('should return transactions by wallet address with pagination', async () => {
      const mockTransactions = [
        { id: '1', coinId: 'coin1', amount: '100', walletAddress: '0x123' },
        { id: '2', coinId: 'coin2', amount: '200', walletAddress: '0x123' }
      ];

      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await transactionRepository.findByWalletAddress('0x123', 1, 10);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { walletAddress: '0x123' },
        skip: 0,
        take: 10,
        orderBy: { timestamp: 'desc' }
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should handle custom pagination', async () => {
      const mockTransactions = [{ id: '3', coinId: 'coin3', amount: '300', walletAddress: '0x123' }];

      (prisma.transaction.findMany as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await transactionRepository.findByWalletAddress('0x123', 2, 5);

      expect(prisma.transaction.findMany).toHaveBeenCalledWith({
        where: { walletAddress: '0x123' },
        skip: 5,
        take: 5,
        orderBy: { timestamp: 'desc' }
      });
      expect(result).toEqual(mockTransactions);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.transaction.findMany as jest.Mock).mockRejectedValue(error);

      await expect(transactionRepository.findByWalletAddress('0x123', 1, 10)).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      const mockTransactionData = {
        txId: '0xabc',
        coinId: 'coin1',
        type: TransactionType.BUY,
        amount: '100',
        price: 0.001,
        value: '0.1',
        walletAddress: '0x123',
        timestamp: new Date()
      };

      const mockCreatedTransaction = { id: '1', ...mockTransactionData };

      (prisma.transaction.create as jest.Mock).mockResolvedValue(mockCreatedTransaction);

      const result = await transactionRepository.create(mockTransactionData);

      expect(prisma.transaction.create).toHaveBeenCalledWith({
        data: {
          ...mockTransactionData,
          amount: BigInt(mockTransactionData.amount)
        }
      });
      expect(result).toEqual(mockCreatedTransaction);
    });

    it('should handle errors', async () => {
      const mockTransactionData = {
        txId: '0xabc',
        coinId: 'coin1',
        type: TransactionType.BUY,
        amount: '100',
        price: 0.001,
        value: '0.1',
        walletAddress: '0x123',
        timestamp: new Date()
      };

      const error = new Error('Database error');
      (prisma.transaction.create as jest.Mock).mockRejectedValue(error);

      await expect(transactionRepository.create(mockTransactionData)).rejects.toThrow('Database error');
    });
  });

  // Note: count method is not implemented in the repository

  describe('countByCoinId', () => {
    it('should return the count of transactions for a specific coin', async () => {
      (prisma.transaction.count as jest.Mock).mockResolvedValue(5);

      const result = await transactionRepository.countByCoinId('coin1');

      expect(prisma.transaction.count).toHaveBeenCalledWith({
        where: { coinId: 'coin1' }
      });
      expect(result).toEqual(5);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.transaction.count as jest.Mock).mockRejectedValue(error);

      await expect(transactionRepository.countByCoinId('coin1')).rejects.toThrow('Database error');
    });
  });
});
