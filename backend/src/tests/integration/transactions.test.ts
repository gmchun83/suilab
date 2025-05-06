import request from 'supertest';
import express from 'express';
import transactionsRoutes from '../../api/routes/transactionsRoutes';
import { transactionService } from '../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

// Mock the transactionService
jest.mock('../../services', () => ({
  transactionService: {
    getTransactionsByCoinId: jest.fn(),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn(),
    getTransactionsByWalletAddress: jest.fn(),
    getTotalTransactionsByCoinId: jest.fn()
  }
}));

// Create a test app
const app = express();
app.use(express.json());
app.use(transactionsRoutes);

describe('Transaction API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/transactions/coin/:coinId', () => {
    it('should return transactions by coin ID with pagination', async () => {
      const mockTransactions = [
        { id: '1', coinId: 'coin1', amount: '100' },
        { id: '2', coinId: 'coin1', amount: '200' }
      ];

      (transactionService.getTransactionsByCoinId as jest.Mock).mockResolvedValue(mockTransactions);
      (transactionService.getTotalTransactionsByCoinId as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/transactions/coin/coin1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockTransactions,
        pagination: {
          page: 1,
          limit: 10,
          total: 2
        }
      });
      expect(transactionService.getTransactionsByCoinId).toHaveBeenCalledWith('coin1', 1, 10);
      expect(transactionService.getTotalTransactionsByCoinId).toHaveBeenCalledWith('coin1');
    });

    it('should handle custom pagination parameters', async () => {
      const mockTransactions = [{ id: '3', coinId: 'coin1', amount: '300' }];

      (transactionService.getTransactionsByCoinId as jest.Mock).mockResolvedValue(mockTransactions);
      (transactionService.getTotalTransactionsByCoinId as jest.Mock).mockResolvedValue(3);

      const response = await request(app).get('/api/transactions/coin/coin1?page=2&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockTransactions,
        pagination: {
          page: 2,
          limit: 10,
          total: 3
        }
      });
      expect(transactionService.getTransactionsByCoinId).toHaveBeenCalledWith('coin1', 2, 10);
    });

    it('should handle coin not found error', async () => {
      (transactionService.getTransactionsByCoinId as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.COIN_NOT_FOUND));

      const response = await request(app).get('/api/transactions/coin/nonexistent');

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      (transactionService.getTransactionsByCoinId as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/transactions/coin/coin1');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('GET /api/transactions/:id', () => {
    it('should return a transaction by ID', async () => {
      const mockTransaction = { id: '1', coinId: 'coin1', amount: '100' };

      (transactionService.getTransactionById as jest.Mock).mockResolvedValue(mockTransaction);

      const response = await request(app).get('/api/transactions/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockTransaction });
      expect(transactionService.getTransactionById).toHaveBeenCalledWith('1');
    });

    it('should handle transaction not found error', async () => {
      (transactionService.getTransactionById as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.TRANSACTION_NOT_FOUND));

      const response = await request(app).get('/api/transactions/nonexistent');

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      (transactionService.getTransactionById as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/transactions/1');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('POST /api/transactions', () => {
    it('should create a new transaction', async () => {
      const mockTransactionData = {
        txId: '0xabc123',
        coinId: 'coin1',
        amount: '100',
        type: 'BUY',
        walletAddress: '0x123',
        price: 0.001,
        value: '0.1',
        timestamp: new Date().toISOString()
      };

      const mockCreatedTransaction = { id: '1', ...mockTransactionData };

      (transactionService.createTransaction as jest.Mock).mockResolvedValue(mockCreatedTransaction);

      const response = await request(app)
        .post('/api/transactions')
        .send(mockTransactionData);

      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(response.body).toEqual({ data: mockCreatedTransaction });
      expect(transactionService.createTransaction).toHaveBeenCalledWith(mockTransactionData);
    });

    it('should handle coin not found error', async () => {
      const mockTransactionData = {
        txId: '0xabc123',
        coinId: 'nonexistent',
        amount: '100',
        type: 'BUY',
        walletAddress: '0x123',
        price: 0.001,
        value: '0.1',
        timestamp: new Date().toISOString()
      };

      (transactionService.createTransaction as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.COIN_NOT_FOUND));

      const response = await request(app)
        .post('/api/transactions')
        .send(mockTransactionData);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle validation error', async () => {
      const mockTransactionData = {
        txId: '0xabc123',
        coinId: 'coin1',
        amount: '-100',
        type: 'BUY',
        walletAddress: '0x123',
        price: 0.001,
        value: '0.1',
        timestamp: new Date().toISOString()
      };

      (transactionService.createTransaction as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED));

      const response = await request(app)
        .post('/api/transactions')
        .send(mockTransactionData);

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED
      });
    });

    it('should handle other errors', async () => {
      const mockTransactionData = {
        txId: '0xabc123',
        coinId: 'coin1',
        amount: '100',
        type: 'BUY',
        walletAddress: '0x123',
        price: 0.001,
        value: '0.1',
        timestamp: new Date().toISOString()
      };

      (transactionService.createTransaction as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/api/transactions')
        .send(mockTransactionData);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.TRANSACTION_CREATION_FAILED
      });
    });
  });

  describe('GET /api/transactions/wallet/:walletAddress', () => {
    it('should return transactions by wallet address with pagination', async () => {
      const mockTransactions = [
        { id: '1', coinId: 'coin1', amount: '100', walletAddress: '0x123' },
        { id: '2', coinId: 'coin2', amount: '200', walletAddress: '0x123' }
      ];

      (transactionService.getTransactionsByWalletAddress as jest.Mock).mockResolvedValue(mockTransactions);

      const response = await request(app).get('/api/transactions/wallet/0x123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockTransactions,
        pagination: {
          page: 1,
          limit: 10
        }
      });
      expect(transactionService.getTransactionsByWalletAddress).toHaveBeenCalledWith('0x123', 1, 10);
    });

    it('should handle custom pagination parameters', async () => {
      const mockTransactions = [{ id: '3', coinId: 'coin3', amount: '300', walletAddress: '0x123' }];

      (transactionService.getTransactionsByWalletAddress as jest.Mock).mockResolvedValue(mockTransactions);

      const response = await request(app).get('/api/transactions/wallet/0x123?page=2&limit=10');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockTransactions,
        pagination: {
          page: 2,
          limit: 10
        }
      });
      expect(transactionService.getTransactionsByWalletAddress).toHaveBeenCalledWith('0x123', 2, 10);
    });

    it('should handle errors', async () => {
      (transactionService.getTransactionsByWalletAddress as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/transactions/wallet/0x123');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });
});
