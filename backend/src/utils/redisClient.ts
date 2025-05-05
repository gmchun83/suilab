import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';
import { REDIS_CONFIG } from '../config';
import { ERROR_MESSAGES } from '../constants';

// Create Redis client
export const redisClient: RedisClientType = createClient({
  url: REDIS_CONFIG.url
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect();
    logger.info(`Connected to Redis at ${REDIS_CONFIG.url}`);
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Don't throw error, allow app to continue without Redis
  }
};

// Handle Redis errors
redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

// Handle Redis reconnection
redisClient.on('reconnecting', () => {
  logger.info('Reconnecting to Redis...');
});

// Handle Redis connection
redisClient.on('connect', () => {
  logger.info('Redis client connected');
});

// Handle Redis ready
redisClient.on('ready', () => {
  logger.info('Redis client ready');
});

// Handle Redis end
redisClient.on('end', () => {
  logger.info('Redis client connection closed');
});

// Initialize connection
connectRedis();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing Redis connection');
  await redisClient.quit();
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing Redis connection');
  await redisClient.quit();
});

/**
 * Wrapper for Redis get with error handling
 */
export const redisGet = async (key: string): Promise<string | null> => {
  try {
    return await redisClient.get(key);
  } catch (error) {
    logger.error(`Redis get error for key ${key}:`, error);
    return null;
  }
};

/**
 * Wrapper for Redis set with error handling
 */
export const redisSet = async (key: string, value: string, ttl?: number): Promise<boolean> => {
  try {
    if (ttl) {
      await redisClient.set(key, value, { EX: ttl });
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    logger.error(`Redis set error for key ${key}:`, error);
    return false;
  }
};

/**
 * Wrapper for Redis del with error handling
 */
export const redisDel = async (key: string): Promise<boolean> => {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error(`Redis del error for key ${key}:`, error);
    return false;
  }
};

export default redisClient;
