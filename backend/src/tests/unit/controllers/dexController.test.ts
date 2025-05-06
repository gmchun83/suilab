import { Request, Response } from 'express';
import dexController from '../../../api/controllers/dexController';
import dexService from '../../../services/dexService';
import { logger } from '../../../utils/logger';

// Mock the dexService
jest.mock('../../../services/dexService', () => ({
  __esModule: true,
  default: {
    getPoolInfo: jest.fn(),
    getPriceHistory: jest.fn(),
    createCetusDexPool: jest.fn(),
    getDexPools: jest.fn(),
    getMarketCap: jest.fn()
  }
}));

// Mock the logger
jest.mock('../../../utils/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe('DexController', () => {
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

  describe('getPoolInfo', () => {
    it('should return pool info for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockPoolInfo = {
        poolId: 'pool1',
        liquidity: '1000',
        price: '0.001'
      };

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getPoolInfo as jest.Mock).mockResolvedValue(mockPoolInfo);

      await dexController.getPoolInfo(mockRequest as Request, mockResponse as Response);

      expect(dexService.getPoolInfo).toHaveBeenCalledWith(mockCoinId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockPoolInfo
      });
    });

    it('should handle errors', async () => {
      const mockCoinId = 'coin1';
      const mockError = new Error('Service error');

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getPoolInfo as jest.Mock).mockRejectedValue(mockError);

      await dexController.getPoolInfo(mockRequest as Request, mockResponse as Response);

      expect(dexService.getPoolInfo).toHaveBeenCalledWith(mockCoinId);
      expect(logger.error).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });

  describe('getPriceHistory', () => {
    it('should return price history for a coin with default timeframe', async () => {
      const mockCoinId = 'coin1';
      const mockPriceHistory = [
        { timestamp: '2023-01-01', price: '0.001' },
        { timestamp: '2023-01-02', price: '0.002' }
      ];

      mockRequest.params = { coinId: mockCoinId };
      mockRequest.query = {};

      (dexService.getPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      await dexController.getPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(dexService.getPriceHistory).toHaveBeenCalledWith(mockCoinId, '1d');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockPriceHistory
      });
    });

    it('should return price history for a coin with specified timeframe', async () => {
      const mockCoinId = 'coin1';
      const mockTimeframe = '1w';
      const mockPriceHistory = [
        { timestamp: '2023-01-01', price: '0.001' },
        { timestamp: '2023-01-08', price: '0.002' }
      ];

      mockRequest.params = { coinId: mockCoinId };
      mockRequest.query = { timeframe: mockTimeframe };

      (dexService.getPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      await dexController.getPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(dexService.getPriceHistory).toHaveBeenCalledWith(mockCoinId, mockTimeframe);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockPriceHistory
      });
    });

    it('should handle invalid timeframe', async () => {
      const mockCoinId = 'coin1';
      const mockInvalidTimeframe = 'invalid';
      const mockPriceHistory = [
        { timestamp: '2023-01-01', price: '0.001' },
        { timestamp: '2023-01-02', price: '0.002' }
      ];

      mockRequest.params = { coinId: mockCoinId };
      mockRequest.query = { timeframe: mockInvalidTimeframe };

      (dexService.getPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      await dexController.getPriceHistory(mockRequest as Request, mockResponse as Response);

      // Should default to '1d' when invalid timeframe is provided
      expect(dexService.getPriceHistory).toHaveBeenCalledWith(mockCoinId, '1d');
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockPriceHistory
      });
    });

    it('should handle errors', async () => {
      const mockCoinId = 'coin1';
      const mockError = new Error('Service error');

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getPriceHistory as jest.Mock).mockRejectedValue(mockError);

      await dexController.getPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(dexService.getPriceHistory).toHaveBeenCalledWith(mockCoinId, '1d');
      expect(logger.error).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });

  describe('createDexPool', () => {
    it('should create a DEX pool for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockPoolData = {
        suiAmount: '1000',
        tokenAmount: '1000000',
        walletAddress: '0x123'
      };
      const mockResult = {
        poolId: 'pool1',
        txHash: '0xabc'
      };

      mockRequest.params = { coinId: mockCoinId };
      mockRequest.body = mockPoolData;

      (dexService.createCetusDexPool as jest.Mock).mockResolvedValue(mockResult);

      await dexController.createDexPool(mockRequest as Request, mockResponse as Response);

      expect(dexService.createCetusDexPool).toHaveBeenCalledWith(
        mockCoinId,
        mockPoolData.suiAmount,
        mockPoolData.tokenAmount,
        mockPoolData.walletAddress
      );
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockResult
      });
    });

    it('should return 400 if required parameters are missing', async () => {
      const mockCoinId = 'coin1';
      const mockIncompleteData = {
        suiAmount: '1000',
        // Missing tokenAmount and walletAddress
      };

      mockRequest.params = { coinId: mockCoinId };
      mockRequest.body = mockIncompleteData;

      await dexController.createDexPool(mockRequest as Request, mockResponse as Response);

      expect(dexService.createCetusDexPool).not.toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: 'Validation error',
        details: ['suiAmount, tokenAmount, and walletAddress are required']
      });
    });

    it('should handle errors', async () => {
      const mockCoinId = 'coin1';
      const mockPoolData = {
        suiAmount: '1000',
        tokenAmount: '1000000',
        walletAddress: '0x123'
      };
      const mockError = new Error('Service error');

      mockRequest.params = { coinId: mockCoinId };
      mockRequest.body = mockPoolData;

      (dexService.createCetusDexPool as jest.Mock).mockRejectedValue(mockError);

      await dexController.createDexPool(mockRequest as Request, mockResponse as Response);

      expect(dexService.createCetusDexPool).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });

  describe('getDexPools', () => {
    it('should return DEX pools for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockPools = [
        { poolId: 'pool1', liquidity: '1000', price: '0.001' },
        { poolId: 'pool2', liquidity: '2000', price: '0.002' }
      ];

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getDexPools as jest.Mock).mockResolvedValue(mockPools);

      await dexController.getDexPools(mockRequest as Request, mockResponse as Response);

      expect(dexService.getDexPools).toHaveBeenCalledWith(mockCoinId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockPools
      });
    });

    it('should handle errors', async () => {
      const mockCoinId = 'coin1';
      const mockError = new Error('Service error');

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getDexPools as jest.Mock).mockRejectedValue(mockError);

      await dexController.getDexPools(mockRequest as Request, mockResponse as Response);

      expect(dexService.getDexPools).toHaveBeenCalledWith(mockCoinId);
      expect(logger.error).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });

  describe('getMarketCap', () => {
    it('should return market cap for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockMarketCap = '1000000';

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getMarketCap as jest.Mock).mockResolvedValue(mockMarketCap);

      await dexController.getMarketCap(mockRequest as Request, mockResponse as Response);

      expect(dexService.getMarketCap).toHaveBeenCalledWith(mockCoinId);
      expect(responseStatus).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({
        success: true,
        data: mockMarketCap
      });
    });

    it('should handle errors', async () => {
      const mockCoinId = 'coin1';
      const mockError = new Error('Service error');

      mockRequest.params = { coinId: mockCoinId };

      (dexService.getMarketCap as jest.Mock).mockRejectedValue(mockError);

      await dexController.getMarketCap(mockRequest as Request, mockResponse as Response);

      expect(dexService.getMarketCap).toHaveBeenCalledWith(mockCoinId);
      expect(logger.error).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error'
      });
    });
  });
});
