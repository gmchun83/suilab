import { Request, Response } from 'express'
import dexService from '../../services/dexService'
import logger from '../../utils/logger'

class DexController {
  /**
   * Get pool information for a coin
   */
  async getPoolInfo(req: Request, res: Response) {
    try {
      const { coinId } = req.params
      
      const poolInfo = await dexService.getPoolInfo(coinId)
      
      res.status(200).json({
        success: true,
        data: poolInfo
      })
    } catch (error) {
      logger.error('Error getting pool info:', error)
      res.status(500).json({
        success: false,
        error: (error as Error).message
      })
    }
  }
  
  /**
   * Calculate price impact for a trade
   */
  async calculatePriceImpact(req: Request, res: Response) {
    try {
      const { coinId } = req.params
      const { amount, isBuy } = req.body
      
      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Amount is required'
        })
      }
      
      const priceImpact = await dexService.calculatePriceImpact(
        coinId,
        Number(amount),
        isBuy === true || isBuy === 'true'
      )
      
      res.status(200).json({
        success: true,
        data: priceImpact
      })
    } catch (error) {
      logger.error('Error calculating price impact:', error)
      res.status(500).json({
        success: false,
        error: (error as Error).message
      })
    }
  }
  
  /**
   * Get price history for a coin
   */
  async getPriceHistory(req: Request, res: Response) {
    try {
      const { coinId } = req.params
      const { timeframe } = req.query
      
      const validTimeframes = ['1h', '1d', '1w', '1m']
      const tf = validTimeframes.includes(timeframe as string) 
        ? timeframe as '1h' | '1d' | '1w' | '1m'
        : '1d'
      
      const priceHistory = await dexService.getPriceHistory(coinId, tf)
      
      res.status(200).json({
        success: true,
        data: priceHistory
      })
    } catch (error) {
      logger.error('Error getting price history:', error)
      res.status(500).json({
        success: false,
        error: (error as Error).message
      })
    }
  }
  
  /**
   * Create a Cetus DEX liquidity pool for a coin
   */
  async createDexPool(req: Request, res: Response) {
    try {
      const { coinId } = req.params
      const { suiAmount, tokenAmount, walletAddress } = req.body
      
      if (!suiAmount || !tokenAmount || !walletAddress) {
        return res.status(400).json({
          success: false,
          error: 'suiAmount, tokenAmount, and walletAddress are required'
        })
      }
      
      const result = await dexService.createCetusDexPool(
        coinId,
        suiAmount,
        tokenAmount,
        walletAddress
      )
      
      res.status(201).json({
        success: true,
        data: result
      })
    } catch (error) {
      logger.error('Error creating DEX pool:', error)
      res.status(500).json({
        success: false,
        error: (error as Error).message
      })
    }
  }
  
  /**
   * Get all DEX pools for a coin
   */
  async getDexPools(req: Request, res: Response) {
    try {
      const { coinId } = req.params
      
      const pools = await dexService.getDexPools(coinId)
      
      res.status(200).json({
        success: true,
        data: pools
      })
    } catch (error) {
      logger.error('Error getting DEX pools:', error)
      res.status(500).json({
        success: false,
        error: (error as Error).message
      })
    }
  }
  
  /**
   * Get market cap for a coin
   */
  async getMarketCap(req: Request, res: Response) {
    try {
      const { coinId } = req.params
      
      const marketCap = await dexService.getMarketCap(coinId)
      
      res.status(200).json({
        success: true,
        data: marketCap
      })
    } catch (error) {
      logger.error('Error getting market cap:', error)
      res.status(500).json({
        success: false,
        error: (error as Error).message
      })
    }
  }
}

export default new DexController()
