import { prisma } from '../../config';
import { logger } from '../../utils/logger';
import { Coin, CoinCreateInput, CoinUpdateInput } from '../../types';

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
      
      return coins;
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
          {
            volume24h: 'desc',
          },
          {
            priceChange24h: 'desc',
          },
        ],
      });
      
      return coins;
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
      
      return coin;
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
      
      return coin;
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
      const coin = await prisma.coin.create({
        data,
      });
      
      return coin;
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
      
      return coin;
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
      
      return coins;
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
}

export default new CoinRepository();
