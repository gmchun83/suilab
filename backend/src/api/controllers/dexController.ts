import { Request, Response } from 'express'
import dexService from '../../services/dexService'
import { logger } from '../../utils/logger'
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants'

class DexController {
  /**
   * Get pool information for a coin
   */
  async getPoolInfo(req: Request, res: Response) {
    try {
      const { coinId } = req.params

      const poolInfo = await dexService.getPoolInfo(coinId)

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: poolInfo
      })
    } catch (error) {
      logger.error('Error getting pool info:', error)
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          details: ['Amount is required']
        })
      }

      const priceImpact = await dexService.calculatePriceImpact(
        coinId,
        Number(amount),
        isBuy === true || isBuy === 'true'
      )

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: priceImpact
      })
    } catch (error) {
      logger.error('Error calculating price impact:', error)
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: priceHistory
      })
    } catch (error) {
      logger.error('Error getting price history:', error)
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          error: ERROR_MESSAGES.VALIDATION_ERROR,
          details: ['suiAmount, tokenAmount, and walletAddress are required']
        })
      }

      const result = await dexService.createCetusDexPool(
        coinId,
        suiAmount,
        tokenAmount,
        walletAddress
      )

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: result
      })
    } catch (error) {
      logger.error('Error creating DEX pool:', error)

      // Check for specific error types
      if (error instanceof Error && error.message.includes('Coin not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        })
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: pools
      })
    } catch (error) {
      logger.error('Error getting DEX pools:', error)

      // Check for specific error types
      if (error instanceof Error && error.message.includes('Coin not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        })
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
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

      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: marketCap
      })
    } catch (error) {
      logger.error('Error getting market cap:', error)

      // Check for specific error types
      if (error instanceof Error && error.message.includes('Coin not found')) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        })
      }

      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
      })
    }
  }
}

export default new DexController()
