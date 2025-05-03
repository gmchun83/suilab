# Directory Structure Document for Meme Coin Launch Platform on Sui Blockchain

## 1. Introduction

### 1.1 Purpose
This Directory Structure Document provides a detailed and comprehensive outline of the file and folder organization for the Meme Coin Launch Platform, a decentralized application (dApp) on the Sui blockchain. The structure is designed to ensure modularity, maintainability, and scalability, supporting the development, testing, and deployment of the Minimum Viable Product (MVP). This document serves as a reference for developers, project managers, and stakeholders to understand the project’s organization and locate key components.

### 1.2 Scope
The directory structure encompasses all components of the Meme Coin Launch Platform, including the frontend (React.js with TypeScript), smart contracts (Move), optional backend/indexer (Node.js with TypeScript), configuration files, documentation, and testing artifacts. The structure supports the platform’s core features: token creation, bonding curve trading, automatic liquidity pool setup on Cetus DEX, creator dashboard, trending/leaderboard sections, burn mechanics, and wallet integration. The document assumes a monorepo approach to manage frontend, backend, and smart contracts in a single repository.

### 1.3 Definitions, Acronyms, and Abbreviations
- **dApp**: Decentralized Application
- **Sui**: A Layer 1 blockchain using the Move programming language
- **DEX**: Decentralized Exchange (e.g., Cetus)
- **Move**: A secure programming language for smart contracts
- **SUI**: Native token of the Sui blockchain
- **MVP**: Minimum Viable Product
- **CI/CD**: Continuous Integration/Continuous Deployment
- **A11y**: Accessibility
- **WCAG**: Web Content Accessibility Guidelines

### 1.4 References
- [Sui Blockchain Official Website](https://sui.io/)
- [Cetus Protocol Official Website](https://www.cetus.zone/)
- [Sui JavaScript SDK](https://github.com/MystenLabs/sui/tree/main/sdk)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 2. Project Overview

The Meme Coin Launch Platform is a web-based dApp that enables users to create, launch, and trade meme coins on the Sui blockchain, inspired by Pump.fun. It leverages Sui’s high-performance architecture and Move programming language to deliver a secure, scalable, and user-friendly experience. The MVP includes features such as token creation, bonding curve trading, automatic liquidity pool setup on Cetus DEX, a creator dashboard, trending/leaderboard sections, burn mechanics, and wallet integration, targeting crypto enthusiasts, meme creators, developers, investors, and newcomers.

### 2.1 Key Objectives
- Deliver MVP within 12 weeks (May 5, 2025 - July 27, 2025).
- Ensure sub-second transaction confirmations and <2-second page loads.
- Pass security audits for smart contracts and frontend.
- Support 1,000 concurrent users with 99.9% uptime.
- Achieve WCAG 2.1 Level AA accessibility compliance.

## 3. Directory Structure

The directory structure is organized into a monorepo with distinct top-level directories for frontend, backend, smart contracts, documentation, and shared configurations. The structure follows best practices for React.js, Node.js, and Move development, with clear separation of concerns and modular organization. Below is the detailed directory tree, followed by descriptions of key directories and files.

```
meme-coin-platform/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/
│   │   │   │   ├── coinsController.ts
│   │   │   │   └── transactionsController.ts
│   │   │   ├── middleware/
│   │   │   │   ├── authMiddleware.ts
│   │   │   │   └── rateLimitMiddleware.ts
│   │   │   └── routes/
│   │   │       ├── coinsRoutes.ts
│   │   │       └── transactionsRoutes.ts
│   │   ├── indexer/
│   │   │   ├── eventProcessor.ts
│   │   │   └── suiListener.ts
│   │   ├── models/
│   │   │   ├── coin.ts
│   │   │   └── transaction.ts
│   │   ├── services/
│   │   │   ├── dexService.ts
│   │   │   └── notificationService.ts
│   │   └── utils/
│   │       ├── logger.ts
│   │       └── redisClient.ts
│   ├── tests/
│   │   ├── integration/
│   │   │   ├── coins.test.ts
│   │   │   └── transactions.test.ts
│   │   └── unit/
│   │       ├── indexer.test.ts
│   │       └── services.test.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   └── schema.prisma
│   └── logs/
│       └── app.log
├── contracts/
│   ├── sources/
│   │   ├── meme_coin.move
│   │   └── dex_integration.move
│   ├── tests/
│   │   ├── meme_coin_test.move
│   │   └── dex_integration_test.move
│   ├── Move.toml
│   └── scripts/
│       ├── deploy.sh
│       └── test.sh
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   │   └── logo.png
│   │   │   └── styles/
│   │   │       └── global.css
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── Header.tsx
│   │   │   └── WalletButton.tsx
│   │   ├── pages/
│   │   │   ├── CoinDetails.tsx
│   │   │   ├── CreateCoin.tsx
│   │   │   ├── CreatorDashboard.tsx
│   │   │   ├── Explore.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   └── WalletConnection.tsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── walletSlice.ts
│   │   │   │   └── coinsSlice.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── api.ts
│   │   │   └── suiClient.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── types/
│   │       └── index.ts
│   ├── tests/
│   │   ├── components/
│   │   │   ├── Button.test.tsx
│   │   │   └── Card.test.tsx
│   │   └── e2e/
│   │       ├── coinCreation.spec.ts
│   │       └── trading.spec.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .eslintrc.json
│   └── prettier.config.js
├── docs/
│   ├── api.md
│   ├── architecture/
│   │   ├── system_diagram.png
│   │   └── data_flow_diagram.png
│   ├── faq.md
│   ├── user-guide.md
│   ├── srs.md
│   ├── wbs.md
│   ├── implementation-plan.md
│   ├── risk-log.md
│   └── test-reports/
│       ├── accessibility-report.md
│       ├── security-report.md
│       ├── performance-report.md
│       └── usability-report.md
├── scripts/
│   ├── setup.sh
│   └── deploy-all.sh
├── .gitignore
├── README.md
├── LICENSE
├── .env.example
└── package.json
```

## 4. Directory and File Descriptions

### 4.1 Root Directory
- **.github/workflows/**: Contains GitHub Actions workflows for CI/CD.
  - `ci.yml`: Runs linting, testing, and building on push/pull requests.
  - `deploy.yml`: Automates deployment to Vercel and AWS.
- **backend/**: Backend Node.js application with indexer and APIs.
- **contracts/**: Move smart contracts for token creation and DEX integration.
- **frontend/**: React.js frontend with TypeScript and Tailwind CSS.
- **docs/**: Documentation for developers, users, and stakeholders.
- **scripts/**: Utility scripts for setup and deployment.
  - `setup.sh`: Initializes development environment (installs dependencies, sets up databases).
  - `deploy-all.sh`: Deploys frontend, backend, and smart contracts.
- **.gitignore**: Specifies files/folders to exclude from Git (e.g., `node_modules`, `.env`).
- **README.md**: Project overview, setup instructions, and contribution guidelines.
- **LICENSE**: MIT license for the project.
- **.env.example**: Template for environment variables (e.g., RPC URLs, API keys).
- **package.json**: Root-level package file for monorepo management (e.g., `turbo`, `pnpm`).

### 4.2 Backend Directory (`backend/`)
- **src/**: Source code for backend.
  - **api/**: API-related code.
    - **controllers/**: Business logic for API endpoints.
      - `coinsController.ts`: Handles coin list and details requests.
      - `transactionsController.ts`: Manages transaction history requests.
    - **middleware/**: Request processing middleware.
      - `authMiddleware.ts`: Authenticates API requests.
      - `rateLimitMiddleware.ts`: Limits request rates (100/min).
    - **routes/**: Express routes for API endpoints.
      - `coinsRoutes.ts`: Routes for `/api/coins` and `/api/coins/:id`.
      - `transactionsRoutes.ts`: Routes for `/api/transactions/:coinId`.
  - **indexer/**: Event indexing logic.
    - `eventProcessor.ts`: Processes blockchain events (create, trade, burn).
    - `suiListener.ts`: Connects to Sui WebSocket API for real-time events.
  - **models/**: Prisma models for database.
    - `coin.ts`: Schema for coin data (name, symbol, supply).
    - `transaction.ts`: Schema for transaction data (coin ID, amount, timestamp).
  - **services/**: External integrations and utilities.
    - `dexService.ts`: Interacts with Cetus DEX via SDK.
    - `notificationService.ts`: Sends WebSocket notifications for events.
  - **utils/**: Helper functions.
    - `logger.ts`: Configures Winston for logging.
    - `redisClient.ts`: Initializes Redis client for caching.
- **tests/**: Test suites for backend.
  - **integration/**: Supertest integration tests.
    - `coins.test.ts`: Tests coin API endpoints.
    - `transactions.test.ts`: Tests transaction API endpoints.
  - **unit/**: Jest unit tests.
    - `indexer.test.ts`: Tests event processing logic.
    - `services.test.ts`: Tests DEX and notification services.
- **.env.example**: Environment variables (e.g., `DATABASE_URL`, `SUI_RPC_URL`).
- **package.json**: Backend dependencies (e.g., `express`, `prisma`, `@mysten/sui.js`).
- **tsconfig.json**: TypeScript configuration for Node.js.
- **prisma/**: Prisma ORM configuration.
  - `schema.prisma`: Database schema for coins and transactions.
- **logs/**: Log files.
  - `app.log`: Backend runtime logs.

### 4.3 Contracts Directory (`contracts/`)
- **sources/**: Move smart contract source code.
  - `meme_coin.move`: Implements token creation, trading, and burn mechanics.
  - `dex_integration.move`: Handles liquidity pool setup on Cetus DEX.
- **tests/**: Move test files.
  - `meme_coin_test.move`: Tests token creation, trading, and burn functions.
  - `dex_integration_test.move`: Tests liquidity pool creation.
- **Move.toml**: Configuration for Move contracts (dependencies, addresses).
- **scripts/**: Deployment and testing scripts.
  - `deploy.sh`: Deploys contracts to Sui testnet/mainnet.
  - `test.sh`: Runs Move tests.

### 4.4 Frontend Directory (`frontend/`)
- **public/**: Static assets.
  - `favicon.ico`: Application favicon.
  - `index.html`: Entry HTML file for React.js.
- **src/**: Frontend source code.
  - **assets/**: Static resources.
    - **images/**: Image assets.
      - `logo.png`: Platform logo.
    - **styles/**: Global CSS.
      - `global.css`: Tailwind CSS and custom styles.
  - **components/**: Reusable React components.
    - **common/**: Generic UI components.
      - `Button.tsx`: Reusable button component.
      - `Card.tsx`: Reusable card component.
      - `Modal.tsx`: Reusable modal component.
    - `Header.tsx`: Navigation bar with wallet info.
    - `WalletButton.tsx`: Wallet connection button.
  - **pages/**: Page components.
    - `CoinDetails.tsx`: Displays coin details and price charts.
    - `CreateCoin.tsx`: Form for creating meme coins.
    - `CreatorDashboard.tsx`: Analytics and management for coin creators.
    - `Explore.tsx`: Search and filter coins.
    - `Home.tsx`: Trending and leaderboard sections.
    - `Portfolio.tsx`: User’s coin holdings and transactions.
    - `WalletConnection.tsx`: Wallet connection UI.
  - **store/**: Redux Toolkit state management.
    - **slices/**: Redux slices.
      - `walletSlice.ts`: Manages wallet state (address, balance).
      - `coinsSlice.ts`: Manages coin data.
    - `index.ts`: Configures Redux store.
  - **utils/**: Helper functions.
    - `api.ts`: API client for backend endpoints.
    - `suiClient.ts`: Sui JavaScript SDK for blockchain interactions.
  - **App.tsx**: Root React component with routing.
  - **main.tsx**: Entry point for React application.
  - **types/**: TypeScript type definitions.
    - `index.ts`: Shared types (e.g., `Coin`, `Transaction`).
- **tests/**: Frontend test suites.
  - **components/**: Unit tests for components.
    - `Button.test.tsx`: Tests Button component.
    - `Card.test.tsx`: Tests Card component.
  - **e2e/**: Cypress end-to-end tests.
    - `coinCreation.spec.ts`: Tests coin creation flow.
    - `trading.spec.ts`: Tests buy/sell flow.
- **.env.example**: Environment variables (e.g., `VITE_SUI_RPC_URL`).
- **package.json**: Frontend dependencies (e.g., `react`, `@mysten/sui.js`, `tailwindcss`).
- **tsconfig.json**: TypeScript configuration for React.
- **vite.config.ts**: Vite configuration for development and build.
- **tailwind.config.js**: Tailwind CSS configuration.
- **postcss.config.js**: PostCSS configuration for Tailwind.
- **.eslintrc.json**: ESLint rules for code quality.
- **prettier.config.js**: Prettier configuration for code formatting.

### 4.5 Documentation Directory (`docs/`)
- **api.md**: OpenAPI specifications for backend APIs.
- **architecture/**: System diagrams.
  - `system_diagram.png`: High-level architecture overview.
  - `data_flow_diagram.png`: Data flow between components.
- **faq.md**: Frequently Asked Questions for users.
- **user-guide.md**: Tutorials for key features (e.g., coin creation, trading).
- **srs.md**: Software Requirements Specification.
- **wbs.md**: Work Breakdown Structure.
- **implementation-plan.md**: Project implementation plan.
- **risk-log.md**: Project risks and mitigations.
- **test-reports/**: Testing artifacts.
  - `accessibility-report.md`: Accessibility test results.
  - `security-report.md`: Security audit findings.
  - `performance-report.md`: Load test results.
  - `usability-report.md`: Usability test findings.

## 5. Design Principles

- **Modularity**: Separate directories for frontend, backend, and contracts to isolate concerns.
- **Scalability**: Organized subdirectories (e.g., `components/common`, `api/controllers`) to support future growth.
- **Maintainability**: Consistent naming (e.g., `.test.tsx` for tests) and documentation (`docs/`) for clarity.
- **Testing**: Dedicated test directories (`tests/`) for unit, integration, and end-to-end tests.
- **Configuration**: Centralized configuration files (e.g., `.env.example`, `tsconfig.json`) for ease of setup.
- **Monorepo**: Single repository with `package.json` at root to manage dependencies and scripts.

## 6. Assumptions

- Developers are familiar with TypeScript, React.js, Node.js, and Move.
- The project uses `pnpm` or `yarn` for monorepo management.
- Vercel is used for frontend deployment, AWS for backend, and Sui CLI for smart contracts.
- GitHub Actions handles CI/CD pipelines.
- Prisma is used for PostgreSQL interactions in the backend.

## 7. Sample File Contents

### 7.1 `frontend/src/pages/CreateCoin.tsx`
```tsx
import React, { useState } from 'react';
import { useSuiClient } from '../utils/suiClient';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const CreateCoin: React.FC = () => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const suiClient = useSuiClient();

  const handleSubmit = async () => {
    try {
      await suiClient.createCoin({ name, symbol });
      alert('Coin created successfully!');
    } catch (error) {
      alert('Error creating coin');
    }
  };

  return (
    <Card>
      <h1>Create Meme Coin</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Coin Name"
      />
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Symbol"
      />
      <Button onClick={handleSubmit}>Create Coin</Button>
    </Card>
  );
};

export default CreateCoin;
```

### 7.2 `contracts/sources/meme_coin.move`
```move
module meme_coin::meme_coin {
    use sui::coin::{Self, Coin};
    use sui::tx_context::TxContext;

    struct MEME_COIN has key, store {
        id: UID,
        name: vector<u8>,
        symbol: vector<u8>,
        supply: u64,
    }

    public fun create_coin(
        name: vector<u8>,
        symbol: vector<u8>,
        supply: u64,
        ctx: &mut TxContext
    ) {
        let coin = MEME_COIN {
            id: object::new(ctx),
            name,
            symbol,
            supply,
        };
        transfer::transfer(coin, tx_context::sender(ctx));
    }
}
```

### 7.3 `backend/src/api/routes/coinsRoutes.ts`
```typescript
import express from 'express';
import { getCoins, getCoinById } from '../controllers/coinsController';
import rateLimitMiddleware from '../middleware/rateLimitMiddleware';

const router = express.Router();

router.get('/coins', rateLimitMiddleware, getCoins);
router.get('/coins/:id', rateLimitMiddleware, getCoinById);

export default router;
```

### 7.4 `.env.example`
```env
# Frontend
VITE_SUI_RPC_URL=https://fullnode.mainnet.sui.io
VITE_API_URL=http://localhost:3000/api

# Backend
SUI_RPC_URL=https://fullnode.mainnet.sui.io
CETUS_API_KEY=your_cetus_api_key
DATABASE_URL=postgres://user:password@host:port/dbname
REDIS_URL=redis://localhost:6379
```

## 8. Integration Points

- **Frontend ↔ Backend**: Frontend uses `api.ts` to call backend APIs (`/api/coins`, `/api/transactions`).
- **Frontend ↔ Blockchain**: `suiClient.ts` interacts with Sui blockchain via `@mysten/sui.js` for wallet connections and transactions.
- **Backend ↔ Blockchain**: `suiListener.ts` uses Sui WebSocket API to index events; `dexService.ts` integrates with Cetus DEX.
- **Contracts ↔ Blockchain**: `meme_coin.move` and `dex_integration.move` deployed to Sui testnet/mainnet via `deploy.sh`.

## 9. Future Considerations

- **Additional Features**: Add directories like `frontend/src/pages/admin/` for admin dashboards.
- **Microservices**: Split `backend/` into multiple services (e.g., `indexer/`, `api/`) for scalability.
- **Internationalization**: Add `frontend/src/locales/` for multi-language support.
- **Analytics**: Introduce `backend/src/analytics/` for advanced metrics and reporting.