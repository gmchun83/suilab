import request from 'supertest';
import express from 'express';
import coinsRoutes from '../../api/routes/coinsRoutes';
import { coinService } from '../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

// Mock the coinService
jest.mock('../../services', () => ({
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

// Create a test app
const app = express();
app.use(express.json());
app.use(coinsRoutes);

describe('Coin API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/coins', () => {
    it('should return coins with pagination', async () => {
      const mockCoins = [
        { id: '1', name: 'TestCoin1', symbol: 'TC1' },
        { id: '2', name: 'TestCoin2', symbol: 'TC2' }
      ];

      (coinService.getAllCoins as jest.Mock).mockResolvedValue(mockCoins);
      (coinService.getTotalCoins as jest.Mock).mockResolvedValue(2);

      const response = await request(app).get('/api/coins');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockCoins,
        pagination: {
          page: 1,
          limit: 10,
          total: 2
        }
      });
      expect(coinService.getAllCoins).toHaveBeenCalledWith(1, 10);
      expect(coinService.getTotalCoins).toHaveBeenCalled();
    });

    it('should handle custom pagination parameters', async () => {
      const mockCoins = [{ id: '3', name: 'TestCoin3', symbol: 'TC3' }];

      (coinService.getAllCoins as jest.Mock).mockResolvedValue(mockCoins);
      (coinService.getTotalCoins as jest.Mock).mockResolvedValue(3);

      const response = await request(app).get('/api/coins?page=2&limit=5');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockCoins,
        pagination: {
          page: 2,
          limit: 5,
          total: 3
        }
      });
      expect(coinService.getAllCoins).toHaveBeenCalledWith(2, 5);
    });

    it('should handle errors', async () => {
      (coinService.getAllCoins as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/coins');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('GET /api/coins/:id', () => {
    it('should return a coin by ID', async () => {
      const mockCoin = { id: '1', name: 'TestCoin', symbol: 'TC' };

      (coinService.getCoinById as jest.Mock).mockResolvedValue(mockCoin);

      const response = await request(app).get('/api/coins/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockCoin });
      expect(coinService.getCoinById).toHaveBeenCalledWith('1');
    });

    it('should handle coin not found', async () => {
      (coinService.getCoinById as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.COIN_NOT_FOUND));

      const response = await request(app).get('/api/coins/nonexistent');

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      (coinService.getCoinById as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/coins/1');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('GET /api/coins/trending', () => {
    it('should return trending coins', async () => {
      const mockTrendingCoins = [
        { id: '1', name: 'TrendingCoin1', symbol: 'TC1' },
        { id: '2', name: 'TrendingCoin2', symbol: 'TC2' }
      ];

      (coinService.getTrendingCoins as jest.Mock).mockResolvedValue(mockTrendingCoins);

      const response = await request(app).get('/api/coins/trending');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockTrendingCoins });
      expect(coinService.getTrendingCoins).toHaveBeenCalledWith(6);
    });

    it('should handle custom limit parameter', async () => {
      const mockTrendingCoins = [
        { id: '1', name: 'TrendingCoin1', symbol: 'TC1' },
        { id: '2', name: 'TrendingCoin2', symbol: 'TC2' },
        { id: '3', name: 'TrendingCoin3', symbol: 'TC3' }
      ];

      (coinService.getTrendingCoins as jest.Mock).mockResolvedValue(mockTrendingCoins);

      const response = await request(app).get('/api/coins/trending?limit=3');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockTrendingCoins });
      expect(coinService.getTrendingCoins).toHaveBeenCalledWith(3);
    });

    it('should handle errors', async () => {
      (coinService.getTrendingCoins as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/coins/trending');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('POST /api/coins', () => {
    it('should create a new coin', async () => {
      const mockCoinData = {
        name: 'NewCoin',
        symbol: 'NC',
        objectId: 'obj123',
        creatorAddress: '0x123'
      };

      const mockCreatedCoin = { id: '1', ...mockCoinData };

      (coinService.createCoin as jest.Mock).mockResolvedValue(mockCreatedCoin);

      const response = await request(app)
        .post('/api/coins')
        .send(mockCoinData);

      expect(response.status).toBe(HTTP_STATUS.CREATED);
      expect(response.body).toEqual({ data: mockCreatedCoin });
      expect(coinService.createCoin).toHaveBeenCalledWith(mockCoinData);
    });

    it('should handle coin already exists error', async () => {
      const mockCoinData = {
        name: 'ExistingCoin',
        symbol: 'EC',
        objectId: 'obj123',
        creatorAddress: '0x123'
      };

      (coinService.createCoin as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.COIN_ALREADY_EXISTS));

      const response = await request(app)
        .post('/api/coins')
        .send(mockCoinData);

      expect(response.status).toBe(HTTP_STATUS.CONFLICT);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_ALREADY_EXISTS
      });
    });

    it('should handle other errors', async () => {
      const mockCoinData = {
        name: 'NewCoin',
        symbol: 'NC',
        objectId: 'obj123',
        creatorAddress: '0x123'
      };

      (coinService.createCoin as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .post('/api/coins')
        .send(mockCoinData);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_CREATION_FAILED
      });
    });
  });

  describe('PUT /api/coins/:id', () => {
    it('should update a coin', async () => {
      const mockCoinData = {
        name: 'UpdatedCoin',
        symbol: 'UC'
      };

      const mockUpdatedCoin = { id: '1', ...mockCoinData };

      (coinService.updateCoin as jest.Mock).mockResolvedValue(mockUpdatedCoin);

      const response = await request(app)
        .put('/api/coins/1')
        .send(mockCoinData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockUpdatedCoin });
      expect(coinService.updateCoin).toHaveBeenCalledWith('1', mockCoinData);
    });

    it('should handle coin not found error', async () => {
      const mockCoinData = {
        name: 'UpdatedCoin',
        symbol: 'UC'
      };

      (coinService.updateCoin as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.COIN_NOT_FOUND));

      const response = await request(app)
        .put('/api/coins/nonexistent')
        .send(mockCoinData);

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      const mockCoinData = {
        name: 'UpdatedCoin',
        symbol: 'UC'
      };

      (coinService.updateCoin as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app)
        .put('/api/coins/1')
        .send(mockCoinData);

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_UPDATE_FAILED
      });
    });
  });

  describe('GET /api/coins/search', () => {
    it('should search coins by query', async () => {
      const mockCoins = [
        { id: '1', name: 'TestCoin', symbol: 'TC' },
        { id: '2', name: 'TestToken', symbol: 'TT' }
      ];

      (coinService.searchCoins as jest.Mock).mockResolvedValue(mockCoins);

      const response = await request(app).get('/api/coins/search?q=Test');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockCoins,
        pagination: {
          page: 1,
          limit: 10,
          query: 'Test'
        }
      });
      expect(coinService.searchCoins).toHaveBeenCalledWith('Test', 1, 10);
    });

    it('should handle missing query parameter', async () => {
      const response = await request(app).get('/api/coins/search');

      expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
      expect(response.body).toEqual({
        error: 'Search query is required'
      });
    });

    it('should handle custom pagination parameters', async () => {
      const mockCoins = [{ id: '3', name: 'TestCoin3', symbol: 'TC3' }];

      (coinService.searchCoins as jest.Mock).mockResolvedValue(mockCoins);

      const response = await request(app).get('/api/coins/search?q=Test&page=2&limit=5');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: mockCoins,
        pagination: {
          page: 2,
          limit: 5,
          query: 'Test'
        }
      });
      expect(coinService.searchCoins).toHaveBeenCalledWith('Test', 2, 5);
    });

    it('should handle errors', async () => {
      (coinService.searchCoins as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/coins/search?q=Test');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('GET /api/coins/:id/price-history', () => {
    it('should return price history for a coin', async () => {
      const mockPriceHistory = [
        { timestamp: 1625097600000, price: '0.00123' },
        { timestamp: 1625184000000, price: '0.00125' }
      ];

      (coinService.getCoinPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      const response = await request(app).get('/api/coins/1/price-history?period=24h');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockPriceHistory });
      expect(coinService.getCoinPriceHistory).toHaveBeenCalledWith('1', '24h');
    });

    it('should use default period if not specified', async () => {
      const mockPriceHistory = [
        { timestamp: 1625097600000, price: '0.00123' },
        { timestamp: 1625184000000, price: '0.00125' }
      ];

      (coinService.getCoinPriceHistory as jest.Mock).mockResolvedValue(mockPriceHistory);

      const response = await request(app).get('/api/coins/1/price-history');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockPriceHistory });
      expect(coinService.getCoinPriceHistory).toHaveBeenCalledWith('1', '24h');
    });

    it('should handle coin not found error', async () => {
      (coinService.getCoinPriceHistory as jest.Mock).mockRejectedValue(new Error(ERROR_MESSAGES.COIN_NOT_FOUND));

      const response = await request(app).get('/api/coins/nonexistent/price-history');

      expect(response.status).toBe(HTTP_STATUS.NOT_FOUND);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.COIN_NOT_FOUND
      });
    });

    it('should handle other errors', async () => {
      (coinService.getCoinPriceHistory as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/coins/1/price-history');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });

  describe('GET /api/coins/leaderboard', () => {
    it('should return leaderboard', async () => {
      const mockLeaderboard = [
        { id: '1', name: 'TopCoin1', marketCap: '1000000' },
        { id: '2', name: 'TopCoin2', marketCap: '900000' }
      ];

      (coinService.getLeaderboard as jest.Mock).mockResolvedValue(mockLeaderboard);

      const response = await request(app).get('/api/coins/leaderboard');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockLeaderboard });
      expect(coinService.getLeaderboard).toHaveBeenCalledWith(10, 'marketCap');
    });

    it('should handle custom parameters', async () => {
      const mockLeaderboard = [
        { id: '1', name: 'TopCoin1', price: '0.00123' },
        { id: '2', name: 'TopCoin2', price: '0.00120' }
      ];

      (coinService.getLeaderboard as jest.Mock).mockResolvedValue(mockLeaderboard);

      const response = await request(app).get('/api/coins/leaderboard?limit=5&sortBy=price');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockLeaderboard });
      expect(coinService.getLeaderboard).toHaveBeenCalledWith(5, 'price');
    });

    it('should handle errors', async () => {
      (coinService.getLeaderboard as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/api/coins/leaderboard');

      expect(response.status).toBe(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual({
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      });
    });
  });
});
