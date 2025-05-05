import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';
import { TransactionType } from '../../types';

/**
 * Validator for creating a transaction
 */
export const validateCreateTransaction = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    txId: Joi.string().required(),
    coinId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(TransactionType)).required(),
    amount: Joi.string().required(),
    price: Joi.number().min(0).required(),
    value: Joi.string().required(),
    walletAddress: Joi.string().required(),
    timestamp: Joi.date().iso().required(),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.VALIDATION_ERROR,
      details: error.details.map(detail => detail.message),
    });
  }
  
  next();
};

/**
 * Validator for pagination parameters
 */
export const validatePagination = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  });

  const { error, value } = schema.validate(req.query);
  
  if (error) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.VALIDATION_ERROR,
      details: error.details.map(detail => detail.message),
    });
  }
  
  // Update the query with validated and defaulted values
  req.query = value;
  
  next();
};
