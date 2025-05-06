import { prisma } from '../../config';
import { logger } from '../../utils/logger';
import { Coin, CoinCreateInput, CoinUpdateInput, PricePoint } from '../../types';

/**
 * Repository for coin-related database operations
 */
export class CoinRepository {
  /**
   * Find all coins with optional pagination
   */
  async findAll(page = 1, limit = 10): Promise<Coin[]> {
    try {
      const skip = (page - 1) * limit;

      const coins = await prisma.coin.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return coins as unknown as Coin[];
    } catch (error) {
      logger.error('Error finding all coins:', error);
      throw error;
    }
  }

  /**
   * Find trending coins based on volume and price change
   */
  async findTrending(limit = 10): Promise<Coin[]> {
    try {
      // This is a simplified implementation
      // In a real app, you would calculate trending based on volume, price change, etc.
      const coins = await prisma.coin.findMany({
        take: limit,
        orderBy: [
          { price: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      return coins as unknown as Coin[];
    } catch (error) {
      logger.error('Error finding trending coins:', error);
      throw error;
    }
  }

  /**
   * Find a coin by ID
   */
  async findById(id: string): Promise<Coin | null> {
    try {
      const coin = await prisma.coin.findUnique({
        where: { id },
      });

      return coin as unknown as Coin | null;
    } catch (error) {
      logger.error(`Error finding coin with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Find a coin by object ID (blockchain identifier)
   */
  async findByObjectId(objectId: string): Promise<Coin | null> {
    try {
      const coin = await prisma.coin.findUnique({
        where: { objectId },
      });

      return coin as unknown as Coin | null;
    } catch (error) {
      logger.error(`Error finding coin with object ID ${objectId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new coin
   */
  async create(data: CoinCreateInput): Promise<Coin> {
    try {
      // Convert string supply to bigint for Prisma
      const prismaData = {
        ...data,
        supply: BigInt(data.supply)
      };

      const coin = await prisma.coin.create({
        data: prismaData as any,
      });

      return coin as unknown as Coin;
    } catch (error) {
      logger.error('Error creating coin:', error);
      throw error;
    }
  }

  /**
   * Update a coin
   */
  async update(id: string, data: CoinUpdateInput): Promise<Coin> {
    try {
      const coin = await prisma.coin.update({
        where: { id },
        data,
      });

      return coin as unknown as Coin;
    } catch (error) {
      logger.error(`Error updating coin with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Search coins by name or symbol
   */
  async search(query: string, page = 1, limit = 10): Promise<Coin[]> {
    try {
      const skip = (page - 1) * limit;

      const coins = await prisma.coin.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              symbol: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return coins as unknown as Coin[];
    } catch (error) {
      logger.error(`Error searching coins with query "${query}":`, error);
      throw error;
    }
  }

  /**
   * Count total number of coins
   */
  async count(): Promise<number> {
    try {
      const count = await prisma.coin.count();
      return count;
    } catch (error) {
      logger.error('Error counting coins:', error);
      throw error;
    }
  }

  /**
   * Get price history for a coin
   */
  async getPriceHistory(id: string, period: string = '24h'): Promise<PricePoint[]> {
    try {
      // First check if the coin exists
      const coin = await this.findById(id);
      if (!coin) {
        throw new Error('Coin not found');
      }

      // In a real app, we would fetch price history from the database
      // For now, we'll generate some mock price history data
      const startDate = this.getPeriodStartDate(period);
      const now = new Date();
      const priceHistory: PricePoint[] = [];

      // Generate price points from start date to now
      const basePrice = 0.001;
      const volatility = 0.2;
      let currentPrice = basePrice;

      // Calculate number of points based on period
      let numPoints = 24; // Default for 24h
      if (period === '7d') numPoints = 7 * 24;
      else if (period === '30d') numPoints = 30;
      else if (period === '90d') numPoints = 90;
      else if (period === '1y') numPoints = 365;

      const interval = (now.getTime() - startDate.getTime()) / numPoints;

      for (let i = 0; i < numPoints; i++) {
        const timestamp = new Date(startDate.getTime() + i * interval);
        // Random price movement
        const change = (Math.random() - 0.5) * volatility;
        currentPrice = Math.max(0.00001, currentPrice * (1 + change));

        priceHistory.push({
          timestamp: timestamp.getTime(),
          price: currentPrice.toString()
        });
      }

      return priceHistory;
    } catch (error) {
      logger.error(`Error getting price history for coin with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(sortBy: string = 'marketCap', limit: number = 10): Promise<Coin[]> {
    try {
      // Validate sortBy parameter
      const validSortFields = ['marketCap', 'price', 'volume24h', 'priceChange24h', 'holders'];
      const field = validSortFields.includes(sortBy) ? sortBy : 'marketCap';

      // Get coins sorted by the specified field
      const coins = await prisma.coin.findMany({
        take: limit,
        orderBy: {
          [field]: 'desc',
        },
      });

      return coins as unknown as Coin[];
    } catch (error) {
      logger.error(`Error getting leaderboard with sortBy=${sortBy}:`, error);
      throw error;
    }
  }

  /**
   * Helper method to get start date based on period
   */
  private getPeriodStartDate(period: string): Date {
    const now = new Date();

    switch (period) {
      case '1h':
        return new Date(now.getTime() - 60 * 60 * 1000);
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000); // Default to 24h
    }
  }
}

export default new CoinRepository();
