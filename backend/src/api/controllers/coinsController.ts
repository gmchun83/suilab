import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import logger from '../../utils/logger'
import redisClient from '../../utils/redisClient'

const prisma = new PrismaClient()

// Cache TTL in seconds
const CACHE_TTL = 300 // 5 minutes

// Get all coins
export const getCoins = async (req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cachedCoins = await redisClient.get('all_coins')

    if (cachedCoins) {
      return res.json(JSON.parse(cachedCoins))
    }

    // If not in cache, fetch from database
    const coins = await prisma.coin.findMany({
      orderBy: {
        price: 'desc'
      }
    })

    // Store in cache
    await redisClient.set('all_coins', JSON.stringify(coins), {
      EX: CACHE_TTL
    })

    res.json(coins)
  } catch (error) {
    logger.error('Error fetching coins:', error)
    res.status(500).json({ error: 'Failed to fetch coins' })
  }
}

// Get coin by ID
export const getCoinById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Try to get from cache first
    const cachedCoin = await redisClient.get(`coin:${id}`)

    if (cachedCoin) {
      return res.json(JSON.parse(cachedCoin))
    }

    // If not in cache, fetch from database
    const coin = await prisma.coin.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 10
        }
      }
    })

    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' })
    }

    // Store in cache
    await redisClient.set(`coin:${id}`, JSON.stringify(coin), {
      EX: CACHE_TTL
    })

    res.json(coin)
  } catch (error) {
    logger.error(`Error fetching coin with ID ${req.params.id}:`, error)
    res.status(500).json({ error: 'Failed to fetch coin details' })
  }
}

// Get trending coins
export const getTrendingCoins = async (req: Request, res: Response) => {
  try {
    // Try to get from cache first
    const cachedTrending = await redisClient.get('trending_coins')

    if (cachedTrending) {
      return res.json(JSON.parse(cachedTrending))
    }

    // If not in cache, fetch from database
    // For trending coins, we'll get the most traded coins in the last 24 hours
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

    // Get coins with most transactions in last 24 hours
    const trendingCoins = await prisma.coin.findMany({
      where: {
        transactions: {
          some: {
            timestamp: {
              gte: twentyFourHoursAgo
            }
          }
        }
      },
      include: {
        _count: {
          select: {
            transactions: {
              where: {
                timestamp: {
                  gte: twentyFourHoursAgo
                }
              }
            }
          }
        }
      },
      orderBy: {
        transactions: {
          _count: 'desc'
        }
      },
      take: 6
    })

    // If no trending coins with transactions, fall back to newest coins
    if (trendingCoins.length === 0) {
      const newestCoins = await prisma.coin.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: 6
      })

      // Store in cache
      await redisClient.set('trending_coins', JSON.stringify(newestCoins), {
        EX: CACHE_TTL
      })

      return res.json(newestCoins)
    }

    // Store in cache
    await redisClient.set('trending_coins', JSON.stringify(trendingCoins), {
      EX: CACHE_TTL
    })

    res.json(trendingCoins)
  } catch (error) {
    logger.error('Error fetching trending coins:', error)
    res.status(500).json({ error: 'Failed to fetch trending coins' })
  }
}
