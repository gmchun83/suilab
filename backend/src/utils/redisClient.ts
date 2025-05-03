import { createClient } from 'redis'
import logger from './logger'

// Create Redis client
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
const redisClient = createClient({
  url: redisUrl
})

// Connect to Redis
const connectRedis = async () => {
  try {
    await redisClient.connect()
    logger.info('Connected to Redis')
  } catch (error) {
    logger.error('Failed to connect to Redis:', error)
    // Don't throw error, allow app to continue without Redis
  }
}

// Handle Redis errors
redisClient.on('error', (err) => {
  logger.error('Redis error:', err)
})

// Initialize connection
connectRedis()

export default redisClient
