import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { coinService } from '../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

/**
 * Get all coins with pagination
 */
export const getCoins = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const coins = await coinService.getAllCoins(page, limit);

    res.json({
      data: coins,
      pagination: {
        page,
        limit,
        total: await coinService.getTotalCoins(),
      },
    });
  } catch (error) {
    logger.error('Error fetching coins:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

/**
 * Get coin by ID
 */
export const getCoinById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const coin = await coinService.getCoinById(id);
      res.json({ data: coin });
    } catch (error) {
      if (error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error fetching coin with ID ${req.params.id}:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

/**
 * Get trending coins
 */
export const getTrendingCoins = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    const trendingCoins = await coinService.getTrendingCoins(limit);

    res.json({ data: trendingCoins });
  } catch (error) {
    logger.error('Error fetching trending coins:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

/**
 * Create a new coin
 */
export const createCoin = async (req: Request, res: Response) => {
  try {
    try {
      const coin = await coinService.createCoin(req.body);
      res.status(HTTP_STATUS.CREATED).json({ data: coin });
    } catch (error) {
      if (error.message === ERROR_MESSAGES.COIN_ALREADY_EXISTS) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          error: ERROR_MESSAGES.COIN_ALREADY_EXISTS
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Error creating coin:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.COIN_CREATION_FAILED
    });
  }
};

/**
 * Update a coin
 */
export const updateCoin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const coin = await coinService.updateCoin(id, req.body);
      res.json({ data: coin });
    } catch (error) {
      if (error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error updating coin with ID ${req.params.id}:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.COIN_UPDATE_FAILED
    });
  }
};

/**
 * Search coins by name or symbol
 */
export const searchCoins = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        error: 'Search query is required'
      });
    }

    const coins = await coinService.searchCoins(query, page, limit);

    res.json({
      data: coins,
      pagination: {
        page,
        limit,
        query,
      },
    });
  } catch (error) {
    logger.error(`Error searching coins:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};
