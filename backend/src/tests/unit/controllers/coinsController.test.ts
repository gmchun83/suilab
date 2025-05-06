import { Request, Response } from 'express';
import { getCoins, getCoinById, getTrendingCoins, createCoin, updateCoin, searchCoins, getCoinPriceHistory, getLeaderboard } from '../../../api/controllers/coinsController';
import { coinService } from '../../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../../constants';

// Mock the coinService
jest.mock('../../../services', () => ({
  coinService: {
    getAllCoins: jest.fn(),
    getCoinById: jest.fn(),
    getTrendingCoins: jest.fn(),
    createCoin: jest.fn(),
    updateCoin: jest.fn(),
    searchCoins: jest.fn(),
    getTotalCoins: jest.fn(),
    getCoinPriceHistory: jest.fn(),
    getLeaderboard: jest.fn()
  }
}));

describe('Coins Controller', () => {
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

  describe('getCoins', () => {
    it('should return coins with pagination', async () => {
      const mockCoins = [{ id: '1', name: 'TestCoin' }];
      const mockTotal = 1;

      (coinService.getAllCoins as jest.Mock).mockResolvedValue(mockCoins);
      (coinService.getTotalCoins as jest.Mock).mockResolvedValue(mockTotal);

      await getCoins(mockRequest as Request, mockResponse as Response);

      expect(coinService.getAllCoins).toHaveBeenCalledWith(1, 10);
      expect(coinService.getTotalCoins).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith({
        data: mockCoins,
        pagination: {
          page: 1,
          limit: 10,
          total: mockTotal
        }
      });
    });

    it('should handle custom pagination parameters', async () => {
      const mockCoins = [{ id: '1', name: 'TestCoin' }];
      const mockTotal = 1;

      mockRequest.query = { page: '2', limit: '20' };

      (coinService.getAllCoins as jest.Mock).mockResolvedValue(mockCoins);
      (coinService.getTotalCoins as jest.Mock).mockResolvedValue(mockTotal);

      await getCoins(mockRequest as Request, mockResponse as Response);

      expect(coinService.getAllCoins).toHaveBeenCalledWith(2, 20);
      expect(responseJson).toHaveBeenCalledWith({
        data: mockCoins,
        pagination: {
          page: 2,
          limit: 20,
          total: mockTotal
        }
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (coinService.getAllCoins as jest.Mock).mockRejectedValue(error);

      await getCoins(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('getCoinById', () => {
    it('should return a coin by ID', async () => {
      const mockCoin = { id: '1', name: 'TestCoin' };
      mockRequest.params = { id: '1' };

      (coinService.getCoinById as jest.Mock).mockResolvedValue(mockCoin);

      await getCoinById(mockRequest as Request, mockResponse as Response);

      expect(coinService.getCoinById).toHaveBeenCalledWith('1');
      expect(responseJson).toHaveBeenCalledWith({ data: mockCoin });
    });

    it('should handle not found error', async () => {
      mockRequest.params = { id: 'nonexistent' };

      const error = new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      (coinService.getCoinById as jest.Mock).mockRejectedValue(error);

      await getCoinById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      mockRequest.params = { id: '1' };

      const error = new Error('Test error');
      (coinService.getCoinById as jest.Mock).mockRejectedValue(error);

      await getCoinById(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('getTrendingCoins', () => {
    it('should return trending coins', async () => {
      const mockCoins = [{ id: '1', name: 'TrendingCoin' }];

      (coinService.getTrendingCoins as jest.Mock).mockResolvedValue(mockCoins);

      await getTrendingCoins(mockRequest as Request, mockResponse as Response);

      expect(coinService.getTrendingCoins).toHaveBeenCalledWith(6);
      expect(responseJson).toHaveBeenCalledWith({ data: mockCoins });
    });

    it('should handle custom limit parameter', async () => {
      const mockCoins = [{ id: '1', name: 'TrendingCoin' }];
      mockRequest.query = { limit: '3' };

      (coinService.getTrendingCoins as jest.Mock).mockResolvedValue(mockCoins);

      await getTrendingCoins(mockRequest as Request, mockResponse as Response);

      expect(coinService.getTrendingCoins).toHaveBeenCalledWith(3);
      expect(responseJson).toHaveBeenCalledWith({ data: mockCoins });
    });

    it('should handle errors', async () => {
      const error = new Error('Test error');
      (coinService.getTrendingCoins as jest.Mock).mockRejectedValue(error);

      await getTrendingCoins(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('createCoin', () => {
    it('should create a new coin', async () => {
      const mockCoinData = { name: 'NewCoin', symbol: 'NC' };
      const mockCreatedCoin = { id: '1', ...mockCoinData };

      mockRequest.body = mockCoinData;

      (coinService.createCoin as jest.Mock).mockResolvedValue(mockCreatedCoin);

      await createCoin(mockRequest as Request, mockResponse as Response);

      expect(coinService.createCoin).toHaveBeenCalledWith(mockCoinData);
      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(responseJson).toHaveBeenCalledWith({ data: mockCreatedCoin });
    });

    it('should handle coin already exists error', async () => {
      const mockCoinData = { name: 'ExistingCoin', symbol: 'EC' };
      mockRequest.body = mockCoinData;

      const error = new Error(ERROR_MESSAGES.COIN_ALREADY_EXISTS);
      (coinService.createCoin as jest.Mock).mockRejectedValue(error);

      await createCoin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.CONFLICT);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_ALREADY_EXISTS
      });
    });

    it('should handle other errors', async () => {
      const mockCoinData = { name: 'NewCoin', symbol: 'NC' };
      mockRequest.body = mockCoinData;

      const error = new Error('Test error');
      (coinService.createCoin as jest.Mock).mockRejectedValue(error);

      await createCoin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_CREATION_FAILED
      });
    });
  });

  describe('updateCoin', () => {
    it('should update a coin', async () => {
      const mockCoinData = { name: 'UpdatedCoin' };
      const mockUpdatedCoin = { id: '1', name: 'UpdatedCoin' };

      mockRequest.params = { id: '1' };
      mockRequest.body = mockCoinData;

      (coinService.updateCoin as jest.Mock).mockResolvedValue(mockUpdatedCoin);

      await updateCoin(mockRequest as Request, mockResponse as Response);

      expect(coinService.updateCoin).toHaveBeenCalledWith('1', mockCoinData);
      expect(responseJson).toHaveBeenCalledWith({ data: mockUpdatedCoin });
    });

    it('should handle coin not found error', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.body = { name: 'UpdatedCoin' };

      const error = new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      (coinService.updateCoin as jest.Mock).mockRejectedValue(error);

      await updateCoin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'UpdatedCoin' };

      const error = new Error('Test error');
      (coinService.updateCoin as jest.Mock).mockRejectedValue(error);

      await updateCoin(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_UPDATE_FAILED
      });
    });
  });

  describe('searchCoins', () => {
    it('should search coins by query', async () => {
      const mockCoins = [{ id: '1', name: 'TestCoin' }];
      mockRequest.query = { q: 'test', page: '1', limit: '10' };

      (coinService.searchCoins as jest.Mock).mockResolvedValue(mockCoins);

      await searchCoins(mockRequest as Request, mockResponse as Response);

      expect(coinService.searchCoins).toHaveBeenCalledWith('test', 1, 10);
      expect(responseJson).toHaveBeenCalledWith({
        data: mockCoins,
        pagination: {
          page: 1,
          limit: 10,
          query: 'test'
        }
      });
    });

    it('should handle missing query parameter', async () => {
      mockRequest.query = { page: '1', limit: '10' };

      await searchCoins(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Search query is required'
      });
    });

    it('should handle errors', async () => {
      mockRequest.query = { q: 'test' };

      const error = new Error('Test error');
      (coinService.searchCoins as jest.Mock).mockRejectedValue(error);

      await searchCoins(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('getCoinPriceHistory', () => {
    it('should return price history for a coin', async () => {
      const mockPriceHistory = [
        { timestamp: 1625097600000, price: '0.00123' },
        { timestamp: 1625184000000, price: '0.00125' }
      ];
      mockRequest.params = { id: '1' };
      mockRequest.query = { period: '24h' };

      (coinService.getCoinPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      await getCoinPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(coinService.getCoinPriceHistory).toHaveBeenCalledWith('1', '24h');
      expect(responseJson).toHaveBeenCalledWith({ data: mockPriceHistory });
    });

    it('should use default period if not specified', async () => {
      const mockPriceHistory = [
        { timestamp: 1625097600000, price: '0.00123' },
        { timestamp: 1625184000000, price: '0.00125' }
      ];
      mockRequest.params = { id: '1' };
      mockRequest.query = {};

      (coinService.getCoinPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      await getCoinPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(coinService.getCoinPriceHistory).toHaveBeenCalledWith('1', '24h');
      expect(responseJson).toHaveBeenCalledWith({ data: mockPriceHistory });
    });

    it('should handle coin not found error', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockRequest.query = { period: '24h' };

      const error = new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      (coinService.getCoinPriceHistory as jest.Mock).mockRejectedValue(error);

      await getCoinPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.query = { period: '24h' };

      const error = new Error('Test error');
      (coinService.getCoinPriceHistory as jest.Mock).mockRejectedValue(error);

      await getCoinPriceHistory(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('getLeaderboard', () => {
    it('should return leaderboard', async () => {
      const mockLeaderboard = [
        { id: '1', name: 'TopCoin1', marketCap: '1000000' },
        { id: '2', name: 'TopCoin2', marketCap: '900000' }
      ];
      mockRequest.query = { limit: '10', sortBy: 'marketCap' };

      (coinService.getLeaderboard as jest.Mock).mockResolvedValue(mockLeaderboard);

      await getLeaderboard(mockRequest as Request, mockResponse as Response);

      expect(coinService.getLeaderboard).toHaveBeenCalledWith(10, 'marketCap');
      expect(responseJson).toHaveBeenCalledWith({ data: mockLeaderboard });
    });

    it('should use default parameters if not specified', async () => {
      const mockLeaderboard = [
        { id: '1', name: 'TopCoin1', marketCap: '1000000' },
        { id: '2', name: 'TopCoin2', marketCap: '900000' }
      ];
      mockRequest.query = {};

      (coinService.getLeaderboard as jest.Mock).mockResolvedValue(mockLeaderboard);

      await getLeaderboard(mockRequest as Request, mockResponse as Response);

      expect(coinService.getLeaderboard).toHaveBeenCalledWith(10, 'marketCap');
      expect(responseJson).toHaveBeenCalledWith({ data: mockLeaderboard });
    });

    it('should handle custom parameters', async () => {
      const mockLeaderboard = [
        { id: '1', name: 'TopCoin1', price: '0.00123' },
        { id: '2', name: 'TopCoin2', price: '0.00120' }
      ];
      mockRequest.query = { limit: '5', sortBy: 'price' };

      (coinService.getLeaderboard as jest.Mock).mockResolvedValue(mockLeaderboard);

      await getLeaderboard(mockRequest as Request, mockResponse as Response);

      expect(coinService.getLeaderboard).toHaveBeenCalledWith(5, 'price');
      expect(responseJson).toHaveBeenCalledWith({ data: mockLeaderboard });
    });

    it('should handle errors', async () => {
      mockRequest.query = { limit: '10', sortBy: 'marketCap' };

      const error = new Error('Test error');
      (coinService.getLeaderboard as jest.Mock).mockRejectedValue(error);

      await getLeaderboard(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(responseJson).toHaveBeenCalledWith({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });
});
