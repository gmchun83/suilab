# PumpSui Project Structure

## Frontend Structure
```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, styles, and other assets
│   │   ├── images/
│   │   └── styles/
│   ├── components/         # Reusable UI components
│   │   ├── common/         # Generic UI components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   ├── Modal/
│   │   │   └── index.ts
│   │   ├── layout/         # Layout components
│   │   │   ├── Header/
│   │   │   ├── Footer/
│   │   │   └── index.ts
│   │   ├── features/       # Feature-specific components
│   │   │   ├── coins/      # Coin-related components
│   │   │   ├── wallet/     # Wallet-related components
│   │   │   └── dashboard/  # Dashboard-related components
│   │   └── index.ts        # Export all components
│   ├── config/             # Configuration files
│   │   ├── routes.ts       # Route definitions
│   │   └── constants.ts    # App constants
│   ├── hooks/              # Custom React hooks
│   │   ├── useWallet.ts
│   │   ├── useCoins.ts
│   │   └── index.ts
│   ├── pages/              # Page components
│   │   ├── Home/
│   │   │   ├── Home.tsx
│   │   │   ├── Home.test.tsx
│   │   │   └── index.ts
│   │   ├── CreateCoin/
│   │   ├── CoinDetails/
│   │   └── index.ts
│   ├── services/           # API and service functions
│   │   ├── api/
│   │   │   ├── coins.ts
│   │   │   ├── transactions.ts
│   │   │   └── index.ts
│   │   ├── sui/
│   │   │   ├── client.ts
│   │   │   ├── wallet.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── store/              # Redux store
│   │   ├── slices/
│   │   │   ├── coinsSlice.ts
│   │   │   ├── walletSlice.ts
│   │   │   └── userSlice.ts
│   │   ├── hooks.ts        # Typed hooks
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── coin.ts
│   │   ├── wallet.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── formatting.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite type definitions
├── .env.example            # Example environment variables
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # Frontend documentation
```

## Backend Structure
```
backend/
├── src/
│   ├── api/                # API endpoints
│   │   ├── controllers/    # Request handlers
│   │   │   ├── coinsController.ts
│   │   │   ├── transactionsController.ts
│   │   │   └── index.ts
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.ts
│   │   │   ├── rateLimit.ts
│   │   │   └── index.ts
│   │   ├── routes/         # Route definitions
│   │   │   ├── coinsRoutes.ts
│   │   │   ├── transactionsRoutes.ts
│   │   │   └── index.ts
│   │   ├── validators/     # Request validation
│   │   │   ├── coinValidators.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── config/             # Configuration
│   │   ├── database.ts
│   │   ├── server.ts
│   │   └── index.ts
│   ├── constants/          # Constants and enums
│   │   ├── errorMessages.ts
│   │   └── index.ts
│   ├── db/                 # Database related code
│   │   ├── models/         # Prisma models
│   │   ├── repositories/   # Data access layer
│   │   │   ├── coinRepository.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── indexer/            # Blockchain indexer
│   │   ├── eventProcessor.ts
│   │   ├── suiListener.ts
│   │   └── index.ts
│   ├── services/           # Business logic
│   │   ├── coinService.ts
│   │   ├── dexService.ts
│   │   ├── notificationService.ts
│   │   └── index.ts
│   ├── types/              # TypeScript type definitions
│   │   ├── coin.ts
│   │   ├── transaction.ts
│   │   └── index.ts
│   ├── utils/              # Utility functions
│   │   ├── logger.ts
│   │   ├── redisClient.ts
│   │   └── index.ts
│   ├── app.ts              # Express app setup
│   └── index.ts            # Entry point
├── prisma/                 # Prisma ORM
│   └── schema.prisma       # Database schema
├── tests/                  # Tests
│   ├── integration/        # Integration tests
│   ├── unit/               # Unit tests
│   └── setup.ts            # Test setup
├── .env.example            # Example environment variables
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # Backend documentation
```

## Shared Structure
```
shared/                     # Shared code between frontend and backend
├── types/                  # Shared type definitions
│   ├── coin.ts
│   ├── transaction.ts
│   └── index.ts
├── constants/              # Shared constants
│   ├── errorCodes.ts
│   └── index.ts
├── utils/                  # Shared utility functions
│   ├── formatting.ts
│   └── index.ts
└── README.md               # Shared code documentation
```

## Root Structure
```
PumpSui/
├── frontend/               # Frontend application
├── backend/                # Backend application
├── shared/                 # Shared code
├── contracts/              # Smart contracts
│   ├── sources/            # Contract source code
│   ├── tests/              # Contract tests
│   └── scripts/            # Deployment scripts
├── docs/                   # Documentation
│   ├── architecture/       # Architecture diagrams
│   ├── api/                # API documentation
│   └── guides/             # User and developer guides
├── scripts/                # Project scripts
│   ├── setup.js            # Setup script
│   └── deploy.js           # Deployment script
├── .github/                # GitHub workflows
├── .gitignore              # Git ignore rules
├── package.json            # Root package.json for monorepo
├── README.md               # Project documentation
└── LICENSE                 # License file
```
