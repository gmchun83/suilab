# PumpSui Codebase Index

## Frontend Structure

### Components
- `frontend/src/components/index.ts` - Exports all components
- `frontend/src/components/layout/Header/Header.tsx` - Main navigation header
- `frontend/src/components/layout/Footer/Footer.tsx` - Site footer
- `frontend/src/components/layout/index.ts` - Exports layout components

### Hooks
- `frontend/src/hooks/useWallet.ts` - Hook for wallet connection and state
- `frontend/src/hooks/useCoins.ts` - Hook for coin data fetching and state
- `frontend/src/hooks/index.ts` - Exports all hooks

### Services
- `frontend/src/services/api/client.ts` - Axios client configuration
- `frontend/src/services/api/coins.ts` - API calls for coins
- `frontend/src/services/api/transactions.ts` - API calls for transactions
- `frontend/src/services/api/index.ts` - Exports all API services

### Types
- `frontend/src/types/coin.ts` - Coin-related type definitions
- `frontend/src/types/transaction.ts` - Transaction-related type definitions
- `frontend/src/types/wallet.ts` - Wallet-related type definitions
- `frontend/src/types/index.ts` - Exports all types

### Config
- `frontend/src/config/routes.ts` - Route definitions
- `frontend/src/config/constants.ts` - Application constants

### Utils
- `frontend/src/utils/formatting.ts` - Formatting utility functions
- `frontend/src/utils/validation.ts` - Validation utility functions
- `frontend/src/utils/index.ts` - Exports all utilities

### App
- `frontend/src/App.tsx` - Main application component
- `frontend/src/main.tsx` - Application entry point

## Backend Structure

### API
- `backend/src/api/controllers/coinsController.ts` - Coin-related request handlers
- `backend/src/api/controllers/transactionsController.ts` - Transaction-related request handlers
- `backend/src/api/controllers/index.ts` - Exports all controllers
- `backend/src/api/middleware/authMiddleware.ts` - Authentication middleware
- `backend/src/api/middleware/rateLimitMiddleware.ts` - Rate limiting middleware
- `backend/src/api/middleware/index.ts` - Exports all middleware
- `backend/src/api/routes/coinsRoutes.ts` - Coin-related routes
- `backend/src/api/routes/transactionsRoutes.ts` - Transaction-related routes
- `backend/src/api/routes/index.ts` - Exports all routes
- `backend/src/api/validators/coinValidators.ts` - Coin-related request validation
- `backend/src/api/validators/transactionValidators.ts` - Transaction-related request validation
- `backend/src/api/validators/index.ts` - Exports all validators
- `backend/src/api/index.ts` - Exports all API modules

### Config
- `backend/src/config/database.ts` - Database configuration
- `backend/src/config/server.ts` - Server configuration
- `backend/src/config/index.ts` - Exports all configuration

### Constants
- `backend/src/constants/errorMessages.ts` - Error message constants
- `backend/src/constants/index.ts` - Exports all constants

### Database
- `backend/src/db/repositories/coinRepository.ts` - Coin-related database operations
- `backend/src/db/repositories/transactionRepository.ts` - Transaction-related database operations
- `backend/src/db/repositories/index.ts` - Exports all repositories

### Services
- `backend/src/services/coinService.ts` - Coin-related business logic
- `backend/src/services/transactionService.ts` - Transaction-related business logic
- `backend/src/services/index.ts` - Exports all services

### Types
- `backend/src/types/coin.ts` - Coin-related type definitions
- `backend/src/types/transaction.ts` - Transaction-related type definitions
- `backend/src/types/index.ts` - Exports all types

### Utils
- `backend/src/utils/logger.ts` - Logging utility
- `backend/src/utils/redisClient.ts` - Redis client utility
- `backend/src/utils/index.ts` - Exports all utilities

### App
- `backend/src/app.ts` - Express application setup
- `backend/src/index.ts` - Application entry point

## Smart Contracts
- `contracts/sources/` - Move smart contract source files
- `contracts/tests/` - Contract test files
- `contracts/scripts/` - Deployment scripts

## Documentation
- `docs/architecture/` - Architecture diagrams
- `docs/api/` - API documentation
- `docs/guides/` - User and developer guides
- `docs/tickets.md` - Project tickets
- `docs/task_list.md` - Task list
- `docs/implementation_plan.md` - Implementation plan
- `docs/gantt_chart.md` - Project timeline

## Project Structure
- `project-structure.md` - Detailed project structure documentation
- `codebase-index.md` - This file, indexing the codebase
