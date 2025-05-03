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

// Get leaderboard coins
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    // Get query parameters
    const sortBy = req.query.sortBy as string || 'marketCap'
    const limit = parseInt(req.query.limit as string) || 10

    // Try to get from cache first
    const cacheKey = `leaderboard:${sortBy}:${limit}`
    const cachedLeaderboard = await redisClient.get(cacheKey)

    if (cachedLeaderboard) {
      return res.json(JSON.parse(cachedLeaderboard))
    }

    // If not in cache, fetch from database
    let orderBy: any = {}

    // Determine sort field
    switch (sortBy) {
      case 'price':
        orderBy = { price: 'desc' }
        break
      case 'volume24h':
        // For volume, we'll use transaction count as a proxy
        orderBy = {
          transactions: {
            _count: 'desc'
          }
        }
        break
      case 'marketCap':
      default:
        // For market cap, we'll sort by price (since we can't sort by calculated fields)
        // and then calculate and re-sort in memory
        orderBy = { price: 'desc' }
        break
    }

    // Fetch coins
    const coins = await prisma.coin.findMany({
      orderBy,
      take: limit * 2, // Fetch more than needed for market cap sorting
      include: {
        _count: {
          select: {
            transactions: true
          }
        }
      }
    })

    // If sorting by market cap, calculate and re-sort
    let leaderboardCoins = coins
    if (sortBy === 'marketCap') {
      leaderboardCoins = coins
        .map(coin => ({
          ...coin,
          marketCap: BigInt(coin.supply) * BigInt(Math.floor(coin.price * 1000000)) // Approximate calculation
        }))
        .sort((a: any, b: any) => Number(b.marketCap - a.marketCap))
        .slice(0, limit)
    } else {
      leaderboardCoins = coins.slice(0, limit)
    }

    // Store in cache
    await redisClient.set(cacheKey, JSON.stringify(leaderboardCoins), {
      EX: CACHE_TTL
    })

    res.json(leaderboardCoins)
  } catch (error) {
    logger.error('Error fetching leaderboard coins:', error)
    res.status(500).json({ error: 'Failed to fetch leaderboard coins' })
  }
}
