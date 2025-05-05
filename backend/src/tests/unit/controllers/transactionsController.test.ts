import { Request, Response } from 'express';
import { 
  getTransactionsByCoinId, 
  getTransactionById, 
  createTransaction, 
  getTransactionsByWalletAddress 
} from '../../../api/controllers/transactionsController';
import { transactionService } from '../../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../constants';

// Mock the transactionService
jest.mock('../../../services', () => ({
  transactionService: {
    getTransactionsByCoinId: jest.fn(),
    getTransactionById: jest.fn(),
    createTransaction: jest.fn(),
    getTransactionsByWalletAddress: jest.fn(),
    getTotalTransactionsByCoinId: jest.fn()
  }
}));

// Mock the logger
jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn()
  }
}));

describe('Transactions Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    responseJson = jest.fn().mockReturnThis();
    responseStatus = jest.fn().mockReturnValue({ json: responseJson });
    
    mockRequest = {
      params: {},
      query: {},
      body: {}
    };
    
    mockResponse = {
      json: responseJson,
      status: responseStatus
    };
    
    jest.clearAllMocks();
  });

  describe('getTransactionsByCoinId', () => {
    it('should return transactions with pagination', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100' }];
      const mockTotal = 1;
      
      mockRequest.params = { coinId: 'coin1' };
      
      (transactionService.getTransactionsByCoinId as jest.Mock).mockResolvedValue(mockTransactions);
      (transactionService.getTotalTransactionsByCoinId as jest.Mock).mockResolvedValue(mockTotal);
      
      await getTransactionsByCoinId(mockRequest as Request, mockResponse as Response);
      
      expect(transactionService.getTransactionsByCoinId).toHaveBeenCalledWith('coin1', 1, 20);
      expect(transactionService.getTotalTransactionsByCoinId).toHaveBeenCalledWith('coin1');
      expect(responseJson).toHaveBeenCalledWith({
        data: mockTransactions,
        pagination: {
          page: 1,
          limit: 20,
          total: mockTotal
        }
      });
    });
    
    it('should handle custom pagination parameters', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100' }];
      const mockTotal = 1;
      
      mockRequest.params = { coinId: 'coin1' };
      mockRequest.query = { page: '2', limit: '10' };
      
      (transactionService.getTransactionsByCoinId as jest.Mock).mockResolvedValue(mockTransactions);
      (transactionService.getTotalTransactionsByCoinId as jest.Mock).mockResolvedValue(mockTotal);
      
      await getTransactionsByCoinId(mockRequest as Request, mockResponse as Response);
      
      expect(transactionService.getTransactionsByCoinId).toHaveBeenCalledWith('coin1', 2, 10);
      expect(responseJson).toHaveBeenCalledWith({
        data: mockTransactions,
        pagination: {
          page: 2,
          limit: 10,
          total: mockTotal
        }
      });
    });
    
    it('should handle coin not found error', async () => {
      mockRequest.params = { coinId: 'nonexistent' };
      
      const error = new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      (transactionService.getTransactionsByCoinId as jest.Mock).mockRejectedValue(error);
      
      await getTransactionsByCoinId(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });
    
    it('should handle other errors', async () => {
      mockRequest.params = { coinId: 'coin1' };
      
      const error = new Error('Test error');
      (transactionService.getTransactionsByCoinId as jest.Mock).mockRejectedValue(error);
      
      await getTransactionsByCoinId(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction by ID', async () => {
      const mockTransaction = { id: '1', coinId: 'coin1', amount: '100' };
      mockRequest.params = { id: '1' };
      
      (transactionService.getTransactionById as jest.Mock).mockResolvedValue(mockTransaction);
      
      await getTransactionById(mockRequest as Request, mockResponse as Response);
      
      expect(transactionService.getTransactionById).toHaveBeenCalledWith('1');
      expect(responseJson).toHaveBeenCalledWith({ data: mockTransaction });
    });
    
    it('should handle transaction not found error', async () => {
      mockRequest.params = { id: 'nonexistent' };
      
      const error = new Error(ERROR_MESSAGES.TRANSACTION_NOT_FOUND);
      (transactionService.getTransactionById as jest.Mock).mockRejectedValue(error);
      
      await getTransactionById(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND
      });
    });
    
    it('should handle other errors', async () => {
      mockRequest.params = { id: '1' };
      
      const error = new Error('Test error');
      (transactionService.getTransactionById as jest.Mock).mockRejectedValue(error);
      
      await getTransactionById(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('createTransaction', () => {
    it('should create a new transaction', async () => {
      const mockTransactionData = { coinId: 'coin1', amount: '100', type: 'buy' };
      const mockCreatedTransaction = { id: '1', ...mockTransactionData };
      
      mockRequest.body = mockTransactionData;
      
      (transactionService.createTransaction as jest.Mock).mockResolvedValue(mockCreatedTransaction);
      
      await createTransaction(mockRequest as Request, mockResponse as Response);
      
      expect(transactionService.createTransaction).toHaveBeenCalledWith(mockTransactionData);
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(responseJson).toHaveBeenCalledWith({ data: mockCreatedTransaction });
    });
    
    it('should handle coin not found error', async () => {
      mockRequest.body = { coinId: 'nonexistent', amount: '100', type: 'buy' };
      
      const error = new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      (transactionService.createTransaction as jest.Mock).mockRejectedValue(error);
      
      await createTransaction(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });
    
    it('should handle validation error', async () => {
      mockRequest.body = { coinId: 'coin1', amount: '-100', type: 'buy' };
      
      const error = new Error(ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED);
      (transactionService.createTransaction as jest.Mock).mockRejectedValue(error);
      
      await createTransaction(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED
      });
    });
    
    it('should handle other errors', async () => {
      mockRequest.body = { coinId: 'coin1', amount: '100', type: 'buy' };
      
      const error = new Error('Test error');
      (transactionService.createTransaction as jest.Mock).mockRejectedValue(error);
      
      await createTransaction(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.TRANSACTION_CREATION_FAILED
      });
    });
  });

  describe('getTransactionsByWalletAddress', () => {
    it('should return transactions by wallet address with pagination', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100', walletAddress: '0x123' }];
      
      mockRequest.params = { walletAddress: '0x123' };
      
      (transactionService.getTransactionsByWalletAddress as jest.Mock).mockResolvedValue(mockTransactions);
      
      await getTransactionsByWalletAddress(mockRequest as Request, mockResponse as Response);
      
      expect(transactionService.getTransactionsByWalletAddress).toHaveBeenCalledWith('0x123', 1, 20);
      expect(responseJson).toHaveBeenCalledWith({
        data: mockTransactions,
        pagination: {
          page: 1,
          limit: 20
        }
      });
    });
    
    it('should handle custom pagination parameters', async () => {
      const mockTransactions = [{ id: '1', coinId: 'coin1', amount: '100', walletAddress: '0x123' }];
      
      mockRequest.params = { walletAddress: '0x123' };
      mockRequest.query = { page: '2', limit: '10' };
      
      (transactionService.getTransactionsByWalletAddress as jest.Mock).mockResolvedValue(mockTransactions);
      
      await getTransactionsByWalletAddress(mockRequest as Request, mockResponse as Response);
      
      expect(transactionService.getTransactionsByWalletAddress).toHaveBeenCalledWith('0x123', 2, 10);
      expect(responseJson).toHaveBeenCalledWith({
        data: mockTransactions,
        pagination: {
          page: 2,
          limit: 10
        }
      });
    });
    
    it('should handle errors', async () => {
      mockRequest.params = { walletAddress: '0x123' };
      
      const error = new Error('Test error');
      (transactionService.getTransactionsByWalletAddress as jest.Mock).mockRejectedValue(error);
      
      await getTransactionsByWalletAddress(mockRequest as Request, mockResponse as Response);
      
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });
});
