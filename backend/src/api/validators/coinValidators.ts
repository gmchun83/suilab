import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ERROR_MESSAGES, HTTP_STATUS } from '../../constants';

/**
 * Validator for creating a coin
 */
export const validateCreateCoin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    objectId: Joi.string().required(),
    name: Joi.string().min(1).max(50).required(),
    symbol: Joi.string().min(1).max(10).required(),
    description: Joi.string().max(500).allow('', null),
    creatorAddress: Joi.string().required(),
    supply: Joi.string().required(),
    price: Joi.number().min(0).required(),
    marketCap: Joi.string().required(),
    volume24h: Joi.string().required(),
    priceChange24h: Joi.string().required(),
    holders: Joi.number().integer().min(0).required(),
    imageUrl: Joi.string().uri().allow('', null),
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
 * Validator for updating a coin
 */
export const validateUpdateCoin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    price: Joi.number().min(0),
    marketCap: Joi.string(),
    volume24h: Joi.string(),
    priceChange24h: Joi.string(),
    holders: Joi.number().integer().min(0),
    imageUrl: Joi.string().uri().allow('', null),
  }).min(1); // At least one field must be provided

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

/**
 * Validator for search parameters
 */
export const validateSearch = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    q: Joi.string().required(),
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
