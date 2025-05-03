import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import logger from '../../utils/logger'

const prisma = new PrismaClient()

// Get transactions by coin ID
export const getTransactionsByCoinId = async (req: Request, res: Response) => {
  try {
    const { coinId } = req.params
    const { limit = '20', offset = '0' } = req.query
    
    // Validate coin exists
    const coin = await prisma.coin.findUnique({
      where: { id: coinId }
    })
    
    if (!coin) {
      return res.status(404).json({ error: 'Coin not found' })
    }
    
    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where: { coinId },
      orderBy: {
        timestamp: 'desc'
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string)
    })
    
    // Get total count
    const total = await prisma.transaction.count({
      where: { coinId }
    })
    
    res.json({
      transactions,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    })
  } catch (error) {
    logger.error(`Error fetching transactions for coin ID ${req.params.coinId}:`, error)
    res.status(500).json({ error: 'Failed to fetch transactions' })
  }
}
