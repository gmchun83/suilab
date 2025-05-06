import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { transactionService } from '../../services';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

/**
 * Get transactions by coin ID
 */
export const getTransactionsByCoinId = async (req: Request, res: Response) => {
  try {
    const { coinId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    try {
      const transactions = await transactionService.getTransactionsByCoinId(coinId, page, limit);
      const total = await transactionService.getTotalTransactionsByCoinId(coinId);

      res.json({
        data: transactions,
        pagination: {
          page,
          limit,
          total,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error fetching transactions for coin ID ${req.params.coinId}:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

/**
 * Get a transaction by ID
 */
export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    try {
      const transaction = await transactionService.getTransactionById(id);
      res.json({ data: transaction });
    } catch (error) {
      if (error instanceof Error && error.message === ERROR_MESSAGES.TRANSACTION_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.TRANSACTION_NOT_FOUND
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error(`Error fetching transaction with ID ${req.params.id}:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};

/**
 * Create a new transaction
 */
export const createTransaction = async (req: Request, res: Response) => {
  try {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(HTTP_STATUS.CREATED).json({ data: transaction });
    } catch (error) {
      if (error instanceof Error && error.message === ERROR_MESSAGES.COIN_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          error: ERROR_MESSAGES.COIN_NOT_FOUND
        });
      }
      if (error instanceof Error && error.message === ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          error: ERROR_MESSAGES.TRANSACTION_VALIDATION_FAILED
        });
      }
      throw error;
    }
  } catch (error) {
    logger.error('Error creating transaction:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.TRANSACTION_CREATION_FAILED
    });
  }
};

/**
 * Get transactions by wallet address
 */
export const getTransactionsByWalletAddress = async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const transactions = await transactionService.getTransactionsByWalletAddress(walletAddress, page, limit);

    res.json({
      data: transactions,
      pagination: {
        page,
        limit,
      },
    });
  } catch (error) {
    logger.error(`Error fetching transactions for wallet address ${req.params.walletAddress}:`, error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    });
  }
};
