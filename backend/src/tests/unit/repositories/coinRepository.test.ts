import { CoinRepository } from '../../../db/repositories/coinRepository';
import { prisma } from '../../../config';
import { logger } from '../../../utils/logger';

// Mock Prisma
jest.mock('../../../config', () => ({
  prisma: {
    coin: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
      upsert: jest.fn()
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

describe('Coin Repository', () => {
  let coinRepository: CoinRepository;

  beforeEach(() => {
    coinRepository = new CoinRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all coins with pagination', async () => {
      const mockCoins = [
        { id: '1', name: 'Coin1' },
        { id: '2', name: 'Coin2' }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.findAll(1, 10);

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle pagination correctly', async () => {
      const mockCoins = [
        { id: '3', name: 'Coin3' },
        { id: '4', name: 'Coin4' }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.findAll(2, 2);

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        skip: 2,
        take: 2,
        orderBy: {
          createdAt: 'desc'
        }
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.coin.findMany as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.findAll(1, 10)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a coin by ID', async () => {
      const mockCoin = { id: '1', name: 'TestCoin' };

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);

      const result = await coinRepository.findById('1');

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual(mockCoin);
    });

    it('should return null if coin not found', async () => {
      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await coinRepository.findById('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.coin.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.findById('1')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findByObjectId', () => {
    it('should return a coin by object ID', async () => {
      const mockCoin = { id: '1', objectId: 'obj123', name: 'TestCoin' };

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);

      const result = await coinRepository.findByObjectId('obj123');

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { objectId: 'obj123' }
      });
      expect(result).toEqual(mockCoin);
    });

    it('should return null if coin not found', async () => {
      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await coinRepository.findByObjectId('nonexistent');

      expect(result).toBeNull();
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.coin.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.findByObjectId('obj123')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new coin', async () => {
      const mockCoinData = {
        objectId: 'obj123',
        name: 'NewCoin',
        symbol: 'NC',
        creatorAddress: '0x123',
        supply: '1000000',
        price: 0.001,
        marketCap: '1000',
        volume24h: '100',
        priceChange24h: '5',
        holders: 10
      };

      const mockCreatedCoin = { id: '1', ...mockCoinData };

      (prisma.coin.create as jest.Mock).mockResolvedValue(mockCreatedCoin);

      const result = await coinRepository.create(mockCoinData);

      expect(prisma.coin.create).toHaveBeenCalledWith({
        data: {
          ...mockCoinData,
          supply: BigInt(mockCoinData.supply)
        }
      });
      expect(result).toEqual(mockCreatedCoin);
    });

    it('should handle errors', async () => {
      const mockCoinData = {
        objectId: 'obj123',
        name: 'NewCoin',
        symbol: 'NC',
        creatorAddress: '0x123',
        supply: '1000000',
        price: 0.001,
        marketCap: '1000',
        volume24h: '100',
        priceChange24h: '5',
        holders: 10
      };

      const error = new Error('Database error');
      (prisma.coin.create as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.create(mockCoinData)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a coin', async () => {
      const mockCoinData = {
        price: 0.002,
        marketCap: '2000',
        volume24h: '200'
      };

      const mockUpdatedCoin = {
        id: '1',
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'NC',
        price: 0.002,
        marketCap: '2000',
        volume24h: '200'
      };

      (prisma.coin.update as jest.Mock).mockResolvedValue(mockUpdatedCoin);

      const result = await coinRepository.update('1', mockCoinData);

      expect(prisma.coin.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: mockCoinData
      });
      expect(result).toEqual(mockUpdatedCoin);
    });

    it('should handle errors', async () => {
      const mockCoinData = {
        price: 0.002,
        marketCap: '2000'
      };

      const error = new Error('Database error');
      (prisma.coin.update as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.update('1', mockCoinData)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return the total count of coins', async () => {
      (prisma.coin.count as jest.Mock).mockResolvedValue(10);

      const result = await coinRepository.count();

      expect(prisma.coin.count).toHaveBeenCalled();
      expect(result).toEqual(10);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (prisma.coin.count as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.count()).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search coins by name or symbol', async () => {
      const mockCoins = [
        { id: '1', name: 'TestCoin', symbol: 'TC' },
        { id: '2', name: 'Another Test', symbol: 'AT' }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.search('test');

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              name: {
                contains: 'test',
                mode: 'insensitive',
              },
            },
            {
              symbol: {
                contains: 'test',
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle pagination in search', async () => {
      const mockCoins = [
        { id: '3', name: 'TestCoin3', symbol: 'TC3' }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.search('test', 2, 1);

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            {
              name: {
                contains: 'test',
                mode: 'insensitive',
              },
            },
            {
              symbol: {
                contains: 'test',
                mode: 'insensitive',
              },
            },
          ],
        },
        skip: 1,
        take: 1,
        orderBy: {
          createdAt: 'desc',
        },
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle errors in search', async () => {
      const error = new Error('Database error');
      (prisma.coin.findMany as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.search('test')).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('findTrending', () => {
    it('should return trending coins', async () => {
      const mockCoins = [
        { id: '1', name: 'TrendingCoin1', volume24h: '5000' },
        { id: '2', name: 'TrendingCoin2', volume24h: '3000' }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.findTrending(5);

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: [
          { price: 'desc' },
          { createdAt: 'desc' }
        ]
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle errors in findTrending', async () => {
      const error = new Error('Database error');
      (prisma.coin.findMany as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.findTrending(5)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getLeaderboard', () => {
    it('should return coin leaderboard', async () => {
      const mockCoins = [
        { id: '1', name: 'LeaderCoin1', marketCap: '10000' },
        { id: '2', name: 'LeaderCoin2', marketCap: '8000' }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.getLeaderboard('marketCap', 5);

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: {
          marketCap: 'desc'
        }
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle different sort criteria', async () => {
      const mockCoins = [
        { id: '1', name: 'LeaderCoin1', holders: 500 },
        { id: '2', name: 'LeaderCoin2', holders: 300 }
      ];

      (prisma.coin.findMany as jest.Mock).mockResolvedValue(mockCoins);

      const result = await coinRepository.getLeaderboard('holders', 5);

      expect(prisma.coin.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: {
          holders: 'desc'
        }
      });
      expect(result).toEqual(mockCoins);
    });

    it('should handle errors in getLeaderboard', async () => {
      const error = new Error('Database error');
      (prisma.coin.findMany as jest.Mock).mockRejectedValue(error);

      await expect(coinRepository.getLeaderboard('marketCap', 5)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
