# Backend Structure Document for Meme Coin Launch Platform on Sui Blockchain

## 1. Introduction

### 1.1 Purpose
This Backend Structure Document outlines the architecture, components, and implementation details of the backend for the Meme Coin Launch Platform, a decentralized application (dApp) on the Sui blockchain. The backend is an optional component that complements the blockchain-based logic by providing off-chain services, such as indexing blockchain events, serving analytics, and caching data for the frontend. This document serves as a guide for developers, architects, and stakeholders to ensure a scalable, secure, and maintainable backend aligned with the platform’s requirements.

### 1.2 Scope
The document focuses on the backend structure for the Minimum Viable Product (MVP) of the Meme Coin Launch Platform, which enables users to create, launch, and trade meme coins with features like bonding curve trading, automatic liquidity pool setup, and a creator dashboard. It covers the backend’s role in indexing blockchain events, serving APIs, and integrating with the Sui blockchain and decentralized exchanges (DEXes) like Cetus. The structure is designed to support the frontend’s needs while maintaining performance and security.

### 1.3 Definitions, Acronyms, and Abbreviations
- **dApp**: Decentralized Application
- **Sui**: A Layer 1 blockchain using the Move programming language
- **DEX**: Decentralized Exchange (e.g., Cetus, Turbos)
- **API**: Application Programming Interface
- **ORM**: Object-Relational Mapping
- **SUI**: Native token of the Sui blockchain
- **MVP**: Minimum Viable Product
- **CI/CD**: Continuous Integration/Continuous Deployment

### 1.4 References
- [Sui Blockchain Official Website](https://sui.io/)
- [Cetus Protocol Official Website](https://www.cetus.zone/)
- [Turbos Finance Official Website](https://turbos.finance/)
- [Sui JavaScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk)
- [Express.js Documentation](https://expressjs.com/)

## 2. Backend Overview

### 2.1 Role of the Backend
The Meme Coin Launch Platform is primarily a blockchain-based dApp, with most logic (e.g., token creation, trading) executed via Move smart contracts on the Sui blockchain. The backend is an optional component that enhances performance and user experience by:
- **Indexing Blockchain Events**: Tracking on-chain activities (e.g., token creation, trades) for efficient data retrieval.
- **Serving APIs**: Providing the frontend with cached or processed data (e.g., coin lists, analytics).
- **Handling Off-Chain Logic**: Managing tasks like notifications or analytics aggregation.
- **Integrating with External Services**: Interfacing with DEX APIs (e.g., Cetus) for liquidity pool data.

The backend is designed to be lightweight, scalable, and loosely coupled with the frontend, allowing the platform to function without it if needed (e.g., direct blockchain queries).

### 2.2 Key Responsibilities
- **Event Indexing**: Listen to Sui blockchain events and store them in a database.
- **API Services**: Expose RESTful endpoints for coin data, transactions, and analytics.
- **Data Aggregation**: Process blockchain data for real-time analytics (e.g., trading volume, holder count).
- **Notification System**: Send alerts for key events (e.g., DEX listing).
- **External Integration**: Communicate with Cetus DEX for liquidity pool setup and data.

### 2.3 Target Audience Considerations
- **Frontend Developers**: Need reliable APIs with clear documentation.
- **Users**: Require fast, real-time data for coin details and analytics.
- **System Admins**: Need monitoring and logging for maintenance.
- **Security Auditors**: Require secure APIs and data handling.

## 3. Tech Stack

### 3.1 Core Technologies
- **Node.js** (v18.x)
  - **Purpose**: Run the backend server and indexer.
  - **Reason**: High performance, asynchronous processing, and extensive ecosystem.
- **Express.js** (v4.x)
  - **Purpose**: Build RESTful APIs.
  - **Reason**: Lightweight, flexible, and widely adopted for Node.js backends.
- **TypeScript** (v5.x)
  - **Purpose**: Add static typing for improved code reliability.
  - **Reason**: Enhances maintainability and aligns with frontend’s TypeScript usage.

### 3.2 Database
- **PostgreSQL** (v15.x)
  - **Purpose**: Store indexed blockchain data (e.g., coins, transactions).
  - **Reason**: Relational structure suits structured data, with strong performance and scalability.
- **Prisma** (v5.x)
  - **Purpose**: ORM for type-safe database interactions.
  - **Reason**: Simplifies queries and ensures compatibility with TypeScript.

### 3.3 Integrations
- **Sui JavaScript SDK** (v0.x)
  - **Purpose**: Interact with Sui blockchain for event listening and querying.
  - **Source**: [Sui SDK](https://github.com/MystenLabs/sui/tree/main/sdk)
- **Sui WebSocket API**
  - **Purpose**: Subscribe to real-time blockchain events.
  - **Reason**: Efficient for indexing without polling.
- **Cetus Protocol SDK** (v0.x)
  - **Purpose**: Integrate with Cetus DEX for liquidity pool data.
  - **Reference**: [Cetus Documentation](https://docs.cetus.zone/)
- **Axios** (v1.x)
  - **Purpose**: Make HTTP requests to external APIs.
  - **Reason**: Simple, promise-based client with robust error handling.

### 3.4 Additional Tools
- **Winston** (v3.x): Logging for debugging and monitoring.
- **Prometheus** (v2.x) with **Grafana** (v9.x): Performance monitoring and visualization.
- **ESLint** (v8.x) and **Prettier** (v2.x): Code linting and formatting.
- **Jest** (v29.x): Unit and integration testing.
- **k6** (v0.x): Performance testing.

## 4. Backend Architecture

### 4.1 Components
The backend is modular, with distinct components for indexing, API services, and external integrations:

1. **Indexer Service**
   - Listens to Sui blockchain events (e.g., token creation, trades) via WebSocket API.
   - Processes and stores events in PostgreSQL.
   - Runs continuously as a background service.

2. **API Server**
   - Exposes RESTful endpoints for the frontend (e.g., `/api/coins`, `/api/transactions`).
   - Queries PostgreSQL for indexed data.
   - Handles authentication and rate limiting.

3. **Notification Service**
   - Sends alerts for key events (e.g., DEX listing) via WebSockets or external providers.
   - Integrates with frontend for real-time updates.

4. **DEX Integration Module**
   - Communicates with Cetus DEX for liquidity pool creation and data retrieval.
   - Caches DEX data to reduce API calls.

### 4.2 Data Flow
1. **Event Indexing**:
   - Indexer subscribes to Sui WebSocket API.
   - Events (e.g., `create_coin`, `trade`) are processed and stored in PostgreSQL via Prisma.
2. **API Requests**:
   - Frontend sends HTTP requests to Express.js server.
   - Server queries PostgreSQL or caches and returns data.
3. **Notifications**:
   - Indexer detects significant events and triggers notifications.
   - Notification service pushes updates to frontend via WebSockets.
4. **DEX Integration**:
   - Backend queries Cetus API for pool data or triggers LP creation via smart contracts.
   - Data is cached and served to the frontend.

### 4.3 Deployment
- **Hosting**: AWS EC2 or Google Cloud Compute Engine for indexer and API server.
- **Database**: AWS RDS (PostgreSQL) or Google Cloud SQL.
- **Scaling**: Auto-scaling groups with load balancers for high traffic.
- **CI/CD**: GitHub Actions for automated testing and deployment.

## 5. File Structure

The backend follows a modular structure for maintainability:
```
backend/
├── src/
│   ├── api/                     # API routes and controllers
│   │   ├── routes/              # Express route definitions
│   │   │   ├── coins.ts
│   │   │   └── transactions.ts
│   │   └── controllers/         # Business logic for routes
│   │       ├── coinController.ts
│   │       └── transactionController.ts
│   ├── indexer/                 # Blockchain event indexing
│   │   ├── listeners/           # Event listeners
│   │   │   └── suiListener.ts
│   │   └── processors/          # Event processing logic
│   │       └── eventProcessor.ts
│   ├── services/                # Reusable services
│   │   ├── notificationService.ts
│   │   └── dexService.ts
│   ├── models/                  # Prisma schema and types
│   │   └── schema.prisma
│   ├── utils/                   # Helper functions and constants
│   │   └── logger.ts
│   ├── middleware/              # Express middleware
│   │   └── authMiddleware.ts
│   └── config/                  # Configuration files
│       └── index.ts
├── tests/                       # Unit and integration tests
│   ├── api/
│   └── indexer/
├── .env                         # Environment variables
├── package.json
└── tsconfig.json
```

## 6. Coding Standards

### 6.1 Naming Conventions
- **Files**: Use camelCase (e.g., `coinController.ts`).
- **Functions/Variables**: Use camelCase (e.g., `fetchCoinData`).
- **Classes/Interfaces**: Use PascalCase (e.g., `CoinService`).
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_REQUESTS_PER_MINUTE`).

### 6.2 Error Handling
- Use try-catch for async operations and return standardized error responses:
```typescript
import { Request, Response } from 'express';

const getCoins = async (req: Request, res: Response) => {
  try {
    const coins = await prisma.memeCoin.findMany();
    res.json(coins);
  } catch (error) {
    console.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
};
```

### 6.3 Logging
- Use Winston for structured logging:
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.File({ filename: 'logs/app.log' })],
});

logger.info('Server started');
```

### 6.4 TypeScript Usage
- Define interfaces for API responses and database models:
```typescript
interface Coin {
  id: string;
  name: string;
  symbol: string;
  marketCap: number;
}
```

## 7. API Specifications

### 7.1 Endpoints
The backend exposes RESTful APIs for the frontend. All endpoints use JSON and are prefixed with `/api`.

#### GET /api/coins
- **Purpose**: Retrieve a list of all meme coins.
- **Request**: None
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "symbol": "string",
      "marketCap": "number"
    }
  ]
  ```
- **Status Codes**:
  - 200: Success
  - 500: Server error

#### GET /api/coins/:id
- **Purpose**: Retrieve details of a specific meme coin.
- **Request**: Path parameter `id`
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "symbol": "string",
    "price": "number",
    "volume": "number",
    "holders": "number"
  }
  ```
- **Status Codes**:
  - 200: Success
  - 404: Coin not found
  - 500: Server error

#### GET /api/transactions/:coinId
- **Purpose**: Retrieve transaction history for a meme coin.
- **Request**: Path parameter `coinId`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "type": "buy | sell",
      "amount": "number",
      "price": "number",
      "timestamp": "string"
    }
  ]
  ```
- **Status Codes**:
  - 200: Success
  - 404: Coin not found
  - 500: Server error

### 7.2 Middleware
- **Authentication**: Verify requests using API keys or JWT (if implemented).
- **Rate Limiting**: Limit requests to prevent abuse (e.g., 100 requests/minute per IP).
- **CORS**: Allow frontend origin (e.g., `https://platform.vercel.app`).

### 7.3 Example Route
```typescript
import { Router } from 'express';
import { getCoins } from '../controllers/coinController';

const router = Router();

router.get('/coins', getCoins);

export default router;
```

## 8. Indexer Implementation

### 8.1 Event Listener
- Subscribe to Sui WebSocket API for events like `create_coin`, `trade`, `burn`.
- Example:
```typescript
import { SuiClient } from '@mysten/sui.js/client';

const client = new SuiClient({ url: process.env.SUI_RPC_URL });

client.subscribeEvent({
  filter: { Package: 'meme-coin-package' },
  onMessage: (event) => {
    processEvent(event);
  },
});
```

### 8.2 Event Processor
- Parse events and store in PostgreSQL:
```typescript
const processEvent = async (event: any) => {
  if (event.type === 'create_coin') {
    await prisma.memeCoin.create({
      data: {
        id: event.id,
        name: event.data.name,
        symbol: event.data.symbol,
        marketCap: 0,
      },
    });
  }
};
```

### 8.3 Database Schema (Prisma)
```prisma
model MemeCoin {
  id          String   @id
  name        String
  symbol      String   @unique
  marketCap   Float
  totalSupply BigInt
  creator     String
  transactions Transaction[]
}

model Transaction {
  id        String   @id
  coinId    String
  type      String
  amount    Float
  price     Float
  timestamp DateTime
  coin      MemeCoin @relation(fields: [coinId], references: [id])
}
```

## 9. Security Considerations

- **API Security**:
  - Use HTTPS for all endpoints.
  - Implement rate limiting with `express-rate-limit`.
  - Validate and sanitize inputs to prevent injection attacks.
- **Authentication**:
  - Use API keys or JWT for endpoint access (if needed).
  - Restrict sensitive endpoints (e.g., admin routes).
- **Data Privacy**:
  - Store minimal user data; rely on blockchain for transaction records.
  - Encrypt sensitive environment variables.
- **Error Handling**:
  - Return generic error messages to clients (e.g., “Server error”).
  - Log detailed errors internally with Winston.

## 10. Performance Optimization

- **Caching**:
  - Use Redis for frequently accessed data (e.g., coin lists).
  - Example:
  ```typescript
  import redis from 'redis';

  const client = redis.createClient();
  await client.setEx('coins', 300, JSON.stringify(coins));
  ```
- **Database Optimization**:
  - Index frequently queried fields (e.g., `MemeCoin.symbol`).
  - Use connection pooling with Prisma.
- **Event Processing**:
  - Batch database writes to reduce overhead.
  - Use async queues (e.g., Bull) for high event volumes.

## 11. Testing Guidelines

### 11.1 Unit Testing
- Test controllers and services with Jest:
```typescript
import { getCoins } from '../controllers/coinController';

test('getCoins returns coin list', async () => {
  const req = {} as Request;
  const res = { json: jest.fn() } as unknown as Response;
  await getCoins(req, res);
  expect(res.json).toHaveBeenCalledWith(expect.any(Array));
});
```

### 11.2 Integration Testing
- Test API endpoints and indexer with Supertest:
```typescript
import request from 'supertest';
import app from '../app';

test('GET /api/coins returns 200', async () => {
  const response = await request(app).get('/api/coins');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});
```

### 11.3 Performance Testing
- Use k6 to simulate high API loads:
```javascript
import http from 'k6/http';

export default function () {
  http.get('https://backend.example.com/api/coins');
}
```

## 12. Deployment and Maintenance

### 12.1 Deployment
- **Hosting**: AWS EC2 or Google Cloud Compute Engine.
- **Database**: AWS RDS (PostgreSQL).
- **CI/CD**: GitHub Actions for automated testing and deployment:
```yaml
name: Backend CI/CD
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run test
      - uses: aws-actions/configure-aws-credentials@v1
      - run: npm run deploy
```

### 12.2 Monitoring
- Use Prometheus/Grafana for metrics (e.g., API response times, indexer lag).
- Set up alerts for high error rates or downtime.

### 12.3 Maintenance
- Regularly update dependencies via `npm update`.
- Monitor Sui and Cetus SDK releases for compatibility.
- Back up PostgreSQL database weekly.

## 13. Assumptions and Constraints

### 13.1 Assumptions
- Sui WebSocket API is reliable for event listening.
- Cetus DEX API is stable and well-documented.
- Frontend handles most user interactions, reducing backend load.

### 13.2 Constraints
- Backend must integrate with Sui blockchain via JavaScript SDK.
- No local file I/O for potential Pyodide-based components.
- APIs must support high concurrency (1,000 simultaneous users).

## 14. Appendix

### 14.1 Sample Environment Variables
```env
SUI_RPC_URL=https://fullnode.mainnet.sui.io
CETUS_API_KEY=your_cetus_api_key
DATABASE_URL=postgres://user:password@host:port/dbname
PORT=3000
REDIS_URL=redis://localhost:6379
```

### 14.2 Sample API Controller
```typescript
import { Request, Response } from 'express';
import prisma from '../models/prisma';

export const getCoins = async (req: Request, res: Response) => {
  try {
    const coins = await prisma.memeCoin.findMany();
    res.json(coins);
  } catch (error) {
    logger.error('Error fetching coins:', error);
    res.status(500).json({ error: 'Failed to fetch coins' });
  }
};
```

### 14.3 Sample Indexer Listener
```typescript
import { SuiClient } from '@mysten/sui.js/client';
import { processEvent } from './processors/eventProcessor';

const client = new SuiClient({ url: process.env.SUI_RPC_URL });

export const startIndexer = () => {
  client.subscribeEvent({
    filter: { Package: 'meme-coin-package' },
    onMessage: (event) => processEvent(event),
  });
};
```