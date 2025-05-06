// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
export const ERROR_MESSAGES = {
  INTERNAL_SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  COIN_NOT_FOUND: 'Coin not found',
  COIN_CREATION_FAILED: 'Failed to create coin',
  COIN_ALREADY_EXISTS: 'Coin already exists',
  COIN_UPDATE_FAILED: 'Failed to update coin',
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden'
};
