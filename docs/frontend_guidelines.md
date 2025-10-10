# Frontend Guidelines Document for Meme Coin Launch Platform on Sui Blockchain

## 1. Introduction

### 1.1 Purpose
This Frontend Guidelines Document provides a comprehensive set of standards, best practices, and technical specifications for developing the frontend of the Meme Coin Launch Platform, a decentralized application (dApp) on the Sui blockchain. It ensures consistency, maintainability, and a high-quality user experience (UX) across the application, which enables users to create, launch, and trade meme coins. The document is intended for frontend developers, designers, and stakeholders to align on the implementation of the Minimum Viable Product (MVP).

### 1.2 Scope
The document covers the frontend architecture, design principles, coding standards, component structure, state management, styling, accessibility, performance optimization, and integration with Sui blockchain and wallets. It addresses the needs of the platform’s target audience: crypto enthusiasts, meme creators, developers, investors, and newcomers. The guidelines focus on delivering a responsive, secure, and intuitive interface inspired by Pump.fun, adapted for Sui’s ecosystem.

### 1.3 Definitions, Acronyms, and Abbreviations
- **dApp**: Decentralized Application
- **Sui**: A Layer 1 blockchain using the Move programming language
- **DEX**: Decentralized Exchange (e.g., Cetus, Turbos)
- **UI**: User Interface
- **UX**: User Experience
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Superset of JavaScript with static typing
- **Tailwind CSS**: Utility-first CSS framework
- **WCAG**: Web Content Accessibility Guidelines
- **A11y**: Accessibility

### 1.4 References
- [Sui Blockchain Official Website](https://sui.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Sui Wallet Adapter](https://github.com/MystenLabs/sui/tree/main/sdk/wallet-adapter)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)

## 2. Frontend Overview

The frontend of the Meme Coin Launch Platform is a single-page application (SPA) built with React.js and TypeScript, hosted on Vercel. It provides a modern, responsive interface for users to interact with Sui blockchain smart contracts, create meme coins, trade via a bonding curve model, view analytics, and explore trending coins. The interface is designed to be intuitive, visually appealing, and accessible, with a dark theme inspired by Pump.fun.

### 2.1 Key Screens
- **Home Page**: Displays trending coins, leaderboard, and navigation.
- **Create Coin Page**: Form for creating meme coins.
- **Explore Page**: Lists and filters available coins.
- **Coin Details Page**: Shows coin data, price charts, and buy/sell options.
- **Portfolio Page**: Displays user’s coin holdings.
- **Creator Dashboard**: Analytics and management for coin creators.
- **Wallet Connection Page**: Facilitates wallet connection/disconnection.

### 2.2 Target Audience Considerations
- **Crypto Enthusiasts**: Expect fast, real-time data and robust wallet integration.
- **Meme Creators**: Need a simple, creative interface for coin creation.
- **Developers**: Require clear error messages and technical feedback.
- **Investors**: Value detailed analytics and price charts.
- **Newcomers**: Need intuitive navigation and educational tooltips.

## 3. Tech Stack

### 3.1 Core Technologies
- **React.js** (v18.x): Component-based UI framework.
  - Source: [CDN](https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js)
- **TypeScript** (v5.x): Static typing for improved code quality.
- **Tailwind CSS** (v3.x): Utility-first styling for rapid development.
  - Source: [CDN](https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css)
- **Vite** (v4.x): Build tool for fast development and production builds.

### 3.2 Libraries and Tools
- **Redux Toolkit** (v1.x): State management for wallet and coin data.
- **Chart.js** (v4.x) with **react-chartjs-2** (v5.x): Real-time price charts.
- **Shadcn/UI** (v0.x): Customizable UI components.
- **Axios** (v1.x): HTTP requests for optional backend APIs.
- **Sui Wallet Adapter** (v0.x): Wallet connection for Sui-compatible wallets.
- **Sui JavaScript SDK** (v0.x): Blockchain interactions.
- **ESLint** (v8.x) and **Prettier** (v2.x): Code linting and formatting.
- **Jest** (v29.x) with **React Testing Library** (v14.x): Unit testing.
- **Cypress** (v12.x): End-to-end testing.

## 4. Design Principles

### 4.1 Visual Design
- **Theme**: Dark background with neon accents (e.g., green, blue) for a modern, crypto-inspired aesthetic.
- **Typography**: Sans-serif fonts (e.g., Inter, Roboto) for readability; sizes range from 14px (body) to 24px (headings).
- **Colors**:
  - Primary: #1A202C (dark background), #38A169 (neon green)
  - Secondary: #2D3748 (card background), #3182CE (blue)
  - Text: #E2E8F0 (light gray), #FFFFFF (white)
- **Icons**: Use FontAwesome or Heroicons for consistent, scalable icons.
- **Animations**: Subtle transitions (e.g., 0.3s ease-in-out) for button clicks and page loads.

### 4.2 UX Principles
- **Simplicity**: Minimize cognitive load with clear navigation and concise forms.
- **Feedback**: Provide immediate feedback (e.g., loading spinners, success/error notifications).
- **Consistency**: Use uniform styles for buttons, inputs, and typography.
- **Responsiveness**: Ensure usability on desktop and mobile (min-width: 320px, max-width: 1920px).
- **Education**: Include tooltips and help icons for newcomers to explain crypto concepts (e.g., bonding curve).

### 4.3 Accessibility (A11y)
- Comply with WCAG 2.1 Level AA standards.
- Ensure high contrast ratios (e.g., 4.5:1 for text).
- Support keyboard navigation and screen readers.
- Use semantic HTML (e.g., `<nav>`, `<main>`, `<button>`).
- Provide ARIA attributes for dynamic content (e.g., `aria-live` for notifications).

## 5. Coding Standards

### 5.1 File Structure
Organize the project for scalability and maintainability:
```
src/
├── assets/               # Images, fonts, etc.
├── components/           # Reusable UI components
│   ├── common/           # Buttons, inputs, modals
│   ├── layout/           # Header, footer, sidebar
│   └── pages/            # Page-specific components
├── pages/                # Route-based page components
├── hooks/                # Custom React hooks
├── store/                # Redux Toolkit slices and store
├── styles/               # Global styles and Tailwind config
├── utils/                # Helper functions and constants
├── types/                # TypeScript type definitions
└── App.tsx               # Main application component
```

### 5.2 Naming Conventions
- **Files**: Use PascalCase for components (e.g., `CreateCoinForm.tsx`), kebab-case for others (e.g., `utils/helpers.ts`).
- **Components**: Use PascalCase (e.g., `CoinDetails`).
- **Functions/Variables**: Use camelCase (e.g., `fetchCoinData`).
- **Constants**: Use UPPER_SNAKE_CASE (e.g., `MAX_IMAGE_SIZE`).

### 5.3 Component Structure
- Create reusable, functional components with TypeScript interfaces.
- Use hooks for logic (e.g., `useCoinData`, `useWallet`).
- Example:
```tsx
interface CoinCardProps {
  name: string;
  symbol: string;
  marketCap: number;
}

const CoinCard: React.FC<CoinCardProps> = ({ name, symbol, marketCap }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold">{name} ({symbol})</h3>
      <p>Market Cap: ${marketCap.toLocaleString()}</p>
    </div>
  );
};

export default CoinCard;
```

### 5.4 Error Handling
- Display user-friendly error messages (e.g., “Failed to connect wallet. Please try again.”).
- Log detailed errors to the console for debugging.
- Use try-catch for async operations:
```tsx
const fetchCoinData = async () => {
  try {
    const response = await axios.get('/api/coins');
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    throw new Error('Unable to load coins. Please try again later.');
  }
};
```

## 6. State Management

### 6.1 Redux Toolkit
- Use Redux Toolkit for global state (e.g., wallet connection, coin data).
- Create slices for each feature:
```tsx
// store/coinSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface CoinState {
  coins: Coin[];
  loading: boolean;
}

const coinSlice = createSlice({
  name: 'coin',
  initialState: { coins: [], loading: false },
  reducers: {
    setCoins(state, action) {
      state.coins = action.payload;
    },
  },
});

export const { setCoins } = coinSlice.actions;
export default coinSlice.reducer;
```

### 6.2 Local State
- Use React’s `useState` and `useReducer` for component-specific state (e.g., form inputs).
- Example:
```tsx
const CreateCoinForm = () => {
  const [formData, setFormData] = useState({ name: '', symbol: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return <input name="name" value={formData.name} onChange={handleChange} />;
};
```

## 7. Styling Guidelines

### 7.1 Tailwind CSS
- Use utility classes for styling to maintain consistency.
- Example:
```tsx
<div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
  <h1 className="text-2xl font-bold mb-4">Create a Meme Coin</h1>
  <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
    Submit
  </button>
</div>
```

### 7.2 Custom Styles
- Define global styles in `src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-900 text-white font-sans;
}
```

### 7.3 Responsive Design
- Use Tailwind’s responsive prefixes (e.g., `sm:`, `md:`):
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Coin cards */}
</div>
```

### 7.4 Theme Configuration
- Customize Tailwind in `tailwind.config.js`:
```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#38A169',
        secondary: '#3182CE',
      },
    },
  },
};
```

## 8. Integration with Sui Blockchain

### 8.1 Wallet Integration
- Use Sui Wallet Adapter for connecting wallets:
```tsx
import { WalletProvider, useWallet } from '@suiet/wallet-kit';

const App = () => (
  <WalletProvider>
    <WalletButton />
  </WalletProvider>
);

const WalletButton = () => {
  const { connect, disconnect, connected, account } = useWallet();

  return (
    <button
      className="bg-green-500 px-4 py-2 rounded"
      onClick={connected ? disconnect : connect}
    >
      {connected ? `Connected: ${account?.address}` : 'Connect Wallet'}
    </button>
  );
};
```

### 8.2 Blockchain Interactions
- Use Sui JavaScript SDK for transactions:
```tsx
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';

const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const createCoin = async (coinData: CoinData) => {
  try {
    const tx = await client.callContract({
      package: 'meme-coin-package',
      module: 'MemeCoin',
      function: 'create_coin',
      arguments: [coinData.name, coinData.symbol, coinData.supply],
    });
    return tx;
  } catch (error) {
    console.error('Error creating coin:', error);
    throw new Error('Failed to create coin.');
  }
};
```

## 9. Performance Optimization

### 9.1 Code Splitting
- Use dynamic imports for heavy components:
```tsx
const CoinChart = React.lazy(() => import('./components/CoinChart'));

const CoinDetails = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CoinChart />
  </Suspense>
);
```

### 9.2 Memoization
- Use `React.memo` and `useMemo` to prevent unnecessary renders:
```tsx
const CoinCard = React.memo(({ name, symbol }: CoinCardProps) => (
  <div>{name} ({symbol})</div>
));
```

### 9.3 Image Optimization
- Use optimized formats (e.g., WebP) and lazy loading:
```tsx
<img src="coin-image.webp" alt="Coin" className="lazy" loading="lazy" />
```

### 9.4 Bundle Size
- Monitor bundle size with Vite’s analyzer plugin.
- Minimize dependencies and tree-shake unused code.

## 10. Accessibility Guidelines

- **Semantic HTML**: Use `<nav>`, `<main>`, `<section>` appropriately.
- **Keyboard Navigation**: Ensure all interactive elements are focusable (e.g., `tabindex="0"`).
- **ARIA Attributes**: Add `aria-label` for icons and `aria-live` for notifications.
- **Contrast**: Maintain 4.5:1 contrast ratio for text.
- **Testing**: Use tools like Lighthouse and axe to validate A11y compliance.

## 11. Testing Guidelines

### 11.1 Unit Testing
- Test components with Jest and React Testing Library:
```tsx
import { render, screen } from '@testing-library/react';
import CoinCard from './CoinCard';

test('renders coin card', () => {
  render(<CoinCard name="DogeMoon" symbol="DOGM" marketCap={1000000} />);
  expect(screen.getByText(/DogeMoon/)).toBeInTheDocument();
});
```

### 11.2 End-to-End Testing
- Use Cypress for user flows:
```javascript
describe('Token Creation', () => {
  it('creates a new coin', () => {
    cy.visit('/create');
    cy.get('input[name="name"]').type('DogeMoon');
    cy.get('button[type="submit"]').click();
    cy.contains('Coin created successfully').should('be.visible');
  });
});
```

### 11.3 Manual Testing
- Validate responsiveness across devices (desktop, tablet, mobile).
- Test wallet connections with multiple providers.

## 12. Development Workflow

### 12.1 Setup
1. Clone repository: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
```env
VITE_SUI_RPC_URL=https://fullnode.mainnet.sui.io
VITE_CETUS_API_KEY=your_cetus_api_key
```
4. Run development server: `npm run dev`

### 12.2 CI/CD
- Use GitHub Actions for:
  - Linting and testing on pull requests.
  - Deploying to Vercel on main branch merges.
- Example workflow:
```yaml
name: CI/CD
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run lint
      - run: npm run test
      - uses: vercel/action@v1
        with:
          token: ${{ secrets.VERCEL_TOKEN }}
```

## 13. Maintenance and Support

### 13.1 Updates
- Regularly update dependencies via `npm update`.
- Monitor React and Sui SDK releases for breaking changes.
- Release patches via GitHub Actions.

### 13.2 Documentation
- Maintain component documentation in `README.md` or Storybook.
- Provide inline JSDoc for complex functions:
```tsx
/** Fetches coin data from indexer */
const fetchCoinData = async (): Promise<Coin[]> => {
  // Implementation
};
```

### 13.3 Support
- Offer developer support via GitHub issues.
- Provide user FAQs and tutorials on the platform.

## 14. Appendix

### 14.1 Sample Component
```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomePage = () => {
  const coins = useSelector((state: RootState) => state.coin.coins);

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meme Coin Launch Platform</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coins.map((coin) => (
          <CoinCard key={coin.id} {...coin} />
        ))}
      </section>
    </main>
  );
};

export default HomePage;
```

### 14.2 Sample Tailwind Config
```js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#38A169',
        secondary: '#3182CE',
      },
    },
  },
  plugins: [],
};
```

### 14.3 Sample ESLint Config
```json
{
  "env": { "browser": true, "es2021": true },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["react", "@typescript-eslint"],
  "rules": { "react/prop-types": "off" }
}
```