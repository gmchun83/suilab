import { coinRepository } from '../db/repositories';
import { redisClient } from '../utils/redisClient';
import { logger } from '../utils/logger';
import { Coin, CoinCreateInput, CoinUpdateInput, CoinWithPriceHistory, PricePoint } from '../types';
import { ERROR_MESSAGES } from '../constants';

/**
 * Service for coin-related business logic
 */
export class CoinService {
  private readonly CACHE_TTL = 60 * 5; // 5 minutes

  /**
   * Get all coins with pagination
   */
  async getAllCoins(page = 1, limit = 10): Promise<Coin[]> {
    const cacheKey = `coins:all:${page}:${limit}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, get from database
      const coins = await coinRepository.findAll(page, limit);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(coins), { EX: this.CACHE_TTL });

      return coins;
    } catch (error) {
      logger.error('Error getting all coins:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins(limit = 10): Promise<Coin[]> {
    const cacheKey = `coins:trending:${limit}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, get from database
      const coins = await coinRepository.findTrending(limit);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(coins), { EX: this.CACHE_TTL });

      return coins;
    } catch (error) {
      logger.error('Error getting trending coins:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get a coin by ID
   */
  async getCoinById(id: string): Promise<Coin> {
    const cacheKey = `coins:id:${id}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, get from database
      const coin = await coinRepository.findById(id);

      if (!coin) {
        throw new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      }

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(coin), { EX: this.CACHE_TTL });

      return coin;
    } catch (error) {
      logger.error(`Error getting coin with ID ${id}:`, error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new coin
   */
  async createCoin(data: CoinCreateInput): Promise<Coin> {
    try {
      // Check if coin with same objectId already exists
      const existingCoin = await coinRepository.findByObjectId(data.objectId);
      if (existingCoin) {
        throw new Error(ERROR_MESSAGES.COIN_ALREADY_EXISTS);
      }

      // Create the coin
      const coin = await coinRepository.create(data);

      // Invalidate cache
      await redisClient.del('coins:all:*');
      await redisClient.del('coins:trending:*');

      return coin;
    } catch (error) {
      logger.error('Error creating coin:', error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_ALREADY_EXISTS) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.COIN_CREATION_FAILED);
    }
  }

  /**
   * Update a coin
   */
  async updateCoin(id: string, data: CoinUpdateInput): Promise<Coin> {
    try {
      // Check if coin exists
      const existingCoin = await coinRepository.findById(id);
      if (!existingCoin) {
        throw new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      }

      // Update the coin
      const updatedCoin = await coinRepository.update(id, data);

      // Invalidate cache
      await redisClient.del(`coins:id:${id}`);
      await redisClient.del('coins:all:*');
      await redisClient.del('coins:trending:*');

      return updatedCoin;
    } catch (error) {
      logger.error(`Error updating coin with ID ${id}:`, error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.COIN_UPDATE_FAILED);
    }
  }

  /**
   * Search coins by name or symbol
   */
  async searchCoins(query: string, page = 1, limit = 10): Promise<Coin[]> {
    const cacheKey = `coins:search:${query}:${page}:${limit}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // If not in cache, search in database
      const coins = await coinRepository.search(query, page, limit);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(coins), { EX: this.CACHE_TTL });

      return coins;
    } catch (error) {
      logger.error(`Error searching coins with query "${query}":`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get total number of coins
   */
  async getTotalCoins(): Promise<number> {
    const cacheKey = 'coins:count';

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return parseInt(cachedData, 10);
      }

      // If not in cache, get from database
      const count = await coinRepository.count();

      // Cache the result
      await redisClient.set(cacheKey, count.toString(), { EX: this.CACHE_TTL });

      return count;
    } catch (error) {
      logger.error('Error getting total coins count:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get coin price history
   */
  async getCoinPriceHistory(id: string, period: string = '24h'): Promise<PricePoint[]> {
    const cacheKey = `coins:${id}:priceHistory:${period}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // Check if coin exists
      const coin = await coinRepository.findById(id);
      if (!coin) {
        throw new Error(ERROR_MESSAGES.COIN_NOT_FOUND);
      }

      // Get price history from repository
      const priceHistory = await coinRepository.getPriceHistory(id, period);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(priceHistory), { EX: this.CACHE_TTL });

      return priceHistory;
    } catch (error) {
      logger.error(`Error getting price history for coin with ID ${id}:`, error);
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        throw error;
      }
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit: number = 10, sortBy: string = 'marketCap'): Promise<Coin[]> {
    const cacheKey = `coins:leaderboard:${sortBy}:${limit}`;

    try {
      // Try to get from cache first
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      // Get leaderboard from repository
      const leaderboard = await coinRepository.getLeaderboard(limit, sortBy);

      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(leaderboard), { EX: this.CACHE_TTL });

      return leaderboard;
    } catch (error) {
      logger.error(`Error getting leaderboard with sortBy=${sortBy}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }
}

export default new CoinService();
