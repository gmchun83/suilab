export const ERROR_MESSAGES = {
  // General errors
  INTERNAL_SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  BAD_REQUEST: 'Bad request',
  VALIDATION_ERROR: 'Validation error',
  
  // Coin errors
  COIN_NOT_FOUND: 'Coin not found',
  COIN_CREATION_FAILED: 'Failed to create coin',
  COIN_UPDATE_FAILED: 'Failed to update coin',
  COIN_ALREADY_EXISTS: 'Coin already exists',
  
  // Transaction errors
  TRANSACTION_NOT_FOUND: 'Transaction not found',
  TRANSACTION_CREATION_FAILED: 'Failed to create transaction',
  TRANSACTION_VALIDATION_FAILED: 'Transaction validation failed',
  
  // Wallet errors
  WALLET_NOT_FOUND: 'Wallet not found',
  WALLET_CONNECTION_FAILED: 'Failed to connect wallet',
  INSUFFICIENT_BALANCE: 'Insufficient balance',
  
  // Blockchain errors
  BLOCKCHAIN_CONNECTION_ERROR: 'Failed to connect to blockchain',
  BLOCKCHAIN_TRANSACTION_ERROR: 'Blockchain transaction failed',
  CONTRACT_EXECUTION_ERROR: 'Contract execution failed',
  
  // Database errors
  DATABASE_CONNECTION_ERROR: 'Database connection error',
  DATABASE_QUERY_ERROR: 'Database query error',
  
  // Redis errors
  REDIS_CONNECTION_ERROR: 'Redis connection error',
  REDIS_OPERATION_ERROR: 'Redis operation error',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded, please try again later',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export default {
  ERROR_MESSAGES,
  HTTP_STATUS,
};
