import { ERROR_MESSAGES } from '../../../constants';
import { mockTransactionRepository, mockCoinRepository } from '../../mocks/repositories';
import { TransactionType } from '../../../types/transaction';

// Define variables to hold the mocked repositories
let transactionRepository: any;
let coinRepository: any;
let redisClient: any;
let logger: any;

// Mock the repositories
jest.mock('../../../db/repositories', () => ({
  transactionRepository: mockTransactionRepository,
  coinRepository: mockCoinRepository
}));

// Mock the redisClient
jest.mock('../../../utils/redisClient', () => {
  const mockRedisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn()
  };

  return {
    redisClient: mockRedisClient,
    redisGet: jest.fn().mockImplementation(async (key) => mockRedisClient.get(key)),
    redisSet: jest.fn().mockImplementation(async (key, value, ttl) => mockRedisClient.set(key, value, ttl)),
    redisDel: jest.fn().mockImplementation(async (key) => mockRedisClient.del(key)),
    __esModule: true,
    default: mockRedisClient
  };
});

// Mock the logger
jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Import after mocks to avoid circular dependency
import transactionService from '../../../services/transactionService';

describe('Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up the mocked repositories and utilities
    transactionRepository = mockTransactionRepository;
    coinRepository = mockCoinRepository;
    redisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn()
    };
    logger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    };
  });

  describe('getTransactionsByCoinId', () => {
    it('should return transactions from cache if available', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100' }];
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockTransactions));

      const result = await transactionService.getTransactionsByCoinId('coin1', 1, 20);

      expect(redisClient.get).toHaveBeenCalledWith('transactions:coin:coin1:1:20');
      expect(transactionRepository.findByCoinId).not.toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
    });

    it('should fetch transactions from repository if not in cache', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100' }];
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (coinRepository.findById as jest.Mock).mockResolvedValue({ id: 'coin1', name: 'TestCoin' });
      (transactionRepository.findByCoinId as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await transactionService.getTransactionsByCoinId('coin1', 1, 20);

      expect(redisClient.get).toHaveBeenCalledWith('transactions:coin:coin1:1:20');
      expect(coinRepository.findById).toHaveBeenCalledWith('coin1');
      expect(transactionRepository.findByCoinId).toHaveBeenCalledWith('coin1', 1, 20);
      expect(redisClient.set).toHaveBeenCalledWith(
        'transactions:coin:coin1:1:20',
        JSON.stringify(mockTransactions),
        'EX',
        expect.any(Number)
      );
      expect(result).toEqual(mockTransactions);
    });

    it('should throw error if coin not found', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (coinRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.getTransactionsByCoinId('nonexistent', 1, 20))
        .rejects.toThrow(ERROR_MESSAGES.COIN_NOT_FOUND);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (redisClient.get as jest.Mock).mockRejectedValue(error);

      await expect(transactionService.getTransactionsByCoinId('coin1', 1, 20))
        .rejects.toThrow(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getTransactionById', () => {
    it('should return transaction from cache if available', async () => {
      const mockTransaction = { id: '1', coinId: 'coin1', amount: '100' };
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockTransaction));

      const result = await transactionService.getTransactionById('1');

      expect(redisClient.get).toHaveBeenCalledWith('transactions:id:1');
      expect(transactionRepository.findById).not.toHaveBeenCalled();
      expect(result).toEqual(mockTransaction);
    });

    it('should fetch transaction from repository if not in cache', async () => {
      const mockTransaction = { id: '1', coinId: 'coin1', amount: '100' };
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (transactionRepository.findById as jest.Mock).mockResolvedValue(mockTransaction);

      const result = await transactionService.getTransactionById('1');

      expect(redisClient.get).toHaveBeenCalledWith('transactions:id:1');
      expect(transactionRepository.findById).toHaveBeenCalledWith('1');
      expect(redisClient.set).toHaveBeenCalledWith(
        'transactions:id:1',
        JSON.stringify(mockTransaction),
        'EX',
        expect.any(Number)
      );
      expect(result).toEqual(mockTransaction);
    });

    it('should throw error if transaction not found', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (transactionRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.getTransactionById('nonexistent'))
        .rejects.toThrow(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (redisClient.get as jest.Mock).mockRejectedValue(error);

      await expect(transactionService.getTransactionById('1'))
        .rejects.toThrow(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('createTransaction', () => {
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

      (coinRepository.findById as jest.Mock).mockResolvedValue({ id: 'coin1', name: 'TestCoin' });
      (transactionRepository.create as jest.Mock).mockResolvedValue(mockCreatedTransaction);

      const result = await transactionService.createTransaction(mockTransactionData);

      expect(coinRepository.findById).toHaveBeenCalledWith('coin1');
      expect(transactionRepository.create).toHaveBeenCalledWith(mockTransactionData);
      expect(redisClient.del).toHaveBeenCalledWith('transactions:coin:coin1:*');
      expect(result).toEqual(mockCreatedTransaction);
    });

    it('should throw error if coin not found', async () => {
      const mockTransactionData = {
        txId: '0xabc',
        coinId: 'nonexistent',
        type: TransactionType.BUY,
        amount: '100',
        price: 0.001,
        value: '0.1',
        walletAddress: '0x123',
        timestamp: new Date()
      };

      (coinRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.createTransaction(mockTransactionData))
        .rejects.toThrow(ERROR_MESSAGES.COIN_NOT_FOUND);
    });

    it('should throw error if validation fails', async () => {
      const mockTransactionData = {
        txId: '0xabc',
        coinId: 'coin1',
        type: TransactionType.BUY,
        amount: '-100',
        price: 0.001,
        value: '-0.1',
        walletAddress: '0x123',
        timestamp: new Date()
      };

      (coinRepository.findById as jest.Mock).mockResolvedValue({ id: 'coin1', name: 'TestCoin' });
      (transactionRepository.create as jest.Mock).mockImplementation(() => {
        throw new Error('Validation error');
      });

      await expect(transactionService.createTransaction(mockTransactionData))
        .rejects.toThrow(ERROR_MESSAGES.TRANSACTION_CREATION_FAILED);
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
      const error = new Error('Test error');

      (coinRepository.findById as jest.Mock).mockRejectedValue(error);

      await expect(transactionService.createTransaction(mockTransactionData))
        .rejects.toThrow(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getTransactionsByWalletAddress', () => {
    it('should return transactions from cache if available', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100', walletAddress: '0x123' }];
      (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockTransactions));

      const result = await transactionService.getTransactionsByWalletAddress('0x123', 1, 20);

      expect(redisClient.get).toHaveBeenCalledWith('transactions:wallet:0x123:1:20');
      expect(transactionRepository.findByWalletAddress).not.toHaveBeenCalled();
      expect(result).toEqual(mockTransactions);
    });

    it('should fetch transactions from repository if not in cache', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100', walletAddress: '0x123' }];
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (transactionRepository.findByWalletAddress as jest.Mock).mockResolvedValue(mockTransactions);

      const result = await transactionService.getTransactionsByWalletAddress('0x123', 1, 20);

      expect(redisClient.get).toHaveBeenCalledWith('transactions:wallet:0x123:1:20');
      expect(transactionRepository.findByWalletAddress).toHaveBeenCalledWith('0x123', 1, 20);
      expect(redisClient.set).toHaveBeenCalledWith(
        'transactions:wallet:0x123:1:20',
        JSON.stringify(mockTransactions),
        'EX',
        expect.any(Number)
      );
      expect(result).toEqual(mockTransactions);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (redisClient.get as jest.Mock).mockRejectedValue(error);

      await expect(transactionService.getTransactionsByWalletAddress('0x123', 1, 20))
        .rejects.toThrow(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getTotalTransactionsByCoinId', () => {
    it('should return count from cache if available', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue('10');

      const result = await transactionService.getTotalTransactionsByCoinId('coin1');

      expect(redisClient.get).toHaveBeenCalledWith('transactions:count:coin1');
      expect(transactionRepository.countByCoinId).not.toHaveBeenCalled();
      expect(result).toEqual(10);
    });

    it('should fetch count from repository if not in cache', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (coinRepository.findById as jest.Mock).mockResolvedValue({ id: 'coin1', name: 'TestCoin' });
      (transactionRepository.countByCoinId as jest.Mock).mockResolvedValue(10);

      const result = await transactionService.getTotalTransactionsByCoinId('coin1');

      expect(redisClient.get).toHaveBeenCalledWith('transactions:count:coin1');
      expect(coinRepository.findById).toHaveBeenCalledWith('coin1');
      expect(transactionRepository.countByCoinId).toHaveBeenCalledWith('coin1');
      expect(redisClient.set).toHaveBeenCalledWith(
        'transactions:count:coin1',
        '10',
        'EX',
        expect.any(Number)
      );
      expect(result).toEqual(10);
    });

    it('should throw error if coin not found', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (coinRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(transactionService.getTotalTransactionsByCoinId('nonexistent'))
        .rejects.toThrow(ERROR_MESSAGES.COIN_NOT_FOUND);
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (redisClient.get as jest.Mock).mockRejectedValue(error);

      await expect(transactionService.getTotalTransactionsByCoinId('coin1'))
        .rejects.toThrow(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  // We'll implement this test when the getTransactionByTxId method is added to the service
  // describe('getTransactionByTxId', () => {
  //   it('should return transaction from cache if available', async () => {
  //     const mockTransaction = { id: '1', txId: '0xabc', coinId: 'coin1', amount: '100' };
  //     (redisClient.get as jest.Mock).mockResolvedValue(JSON.stringify(mockTransaction));

  //     const result = await transactionService.getTransactionByTxId('0xabc');

  //     expect(redisClient.get).toHaveBeenCalledWith('transactions:txId:0xabc');
  //     expect(transactionRepository.findByTxId).not.toHaveBeenCalled();
  //     expect(result).toEqual(mockTransaction);
  //   });

  //   it('should fetch transaction from repository if not in cache', async () => {
  //     const mockTransaction = { id: '1', txId: '0xabc', coinId: 'coin1', amount: '100' };
  //     (redisClient.get as jest.Mock).mockResolvedValue(null);
  //     (transactionRepository.findByTxId as jest.Mock).mockResolvedValue(mockTransaction);

  //     const result = await transactionService.getTransactionByTxId('0xabc');

  //     expect(redisClient.get).toHaveBeenCalledWith('transactions:txId:0xabc');
  //     expect(transactionRepository.findByTxId).toHaveBeenCalledWith('0xabc');
  //     expect(redisClient.set).toHaveBeenCalledWith(
  //       'transactions:txId:0xabc',
  //       JSON.stringify(mockTransaction),
  //       'EX',
  //       expect.any(Number)
  //     );
  //     expect(result).toEqual(mockTransaction);
  //   });

  //   it('should throw error if transaction not found', async () => {
  //     (redisClient.get as jest.Mock).mockResolvedValue(null);
  //     (transactionRepository.findByTxId as jest.Mock).mockResolvedValue(null);

  //     await expect(transactionService.getTransactionByTxId('0xnonexistent'))
  //       .rejects.toThrow(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
  //   });

  //   it('should handle errors', async () => {
  //     const error = new Error('Test error');
  //     (redisClient.get as jest.Mock).mockRejectedValue(error);

  //     await expect(transactionService.getTransactionByTxId('0xabc'))
  //       .rejects.toThrow(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  //     expect(logger.error).toHaveBeenCalled();
  //   });
  // });
});
