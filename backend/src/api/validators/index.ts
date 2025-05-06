import {
  validateCreateCoin,
  validateUpdateCoin,
  validateSearch
} from './coinValidators';

import {
  validateCreateTransaction
} from './transactionValidators';

// Import and rename the common validator to avoid naming conflicts
import { validatePagination as validateCoinPagination } from './coinValidators';
import { validatePagination as validateTransactionPagination } from './transactionValidators';

export {
  validateCreateCoin,
  validateUpdateCoin,
  validateSearch,
  validateCreateTransaction,
  validateCoinPagination,
  validateTransactionPagination
};
