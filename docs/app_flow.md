# App Flow Document for Meme Coin Launch Platform on Sui Blockchain

## 1. Introduction

### 1.1 Purpose
This App Flow Document outlines the user interactions and navigation flows for the Meme Coin Launch Platform, a decentralized application (dApp) on the Sui blockchain. It details how users interact with the platform to create, trade, and manage meme coins, ensuring a seamless and intuitive experience for crypto enthusiasts, meme creators, developers, investors, and newcomers. The document serves as a guide for developers, designers, and stakeholders to align the application's functionality with user needs.

### 1.2 Scope
The document covers the primary user flows for the Meme Coin Launch Platform, including wallet connection, token creation, trading, liquidity pool setup, creator dashboard navigation, and exploration of trending coins and leaderboards. It focuses on the Minimum Viable Product (MVP) features, emphasizing user interactions, screen transitions, and system responses within the web-based dApp.

### 1.3 Definitions, Acronyms, and Abbreviations
- **dApp**: Decentralized Application
- **Sui**: A Layer 1 blockchain using the Move programming language
- **DEX**: Decentralized Exchange (e.g., Cetus, Turbos)
- **Bonding Curve**: A pricing model where token price adjusts based on supply and demand
- **LP**: Liquidity Pool
- **SUI**: Native token of the Sui blockchain
- **UI**: User Interface
- **UX**: User Experience

### 1.4 References
- [Sui Blockchain Official Website](https://sui.io/)
- [Cetus Protocol Official Website](https://www.cetus.zone/)
- [Turbos Finance Official Website](https://turbos.finance/)
- [Pump.fun Overview](https://www.bitbond.com/resources/how-does-pump-fun-work/)
- [Sui Ecosystem Guide](https://coinmarketcap.com/academy/article/what-is-sui-the-ultimate-guide-to-the-sui-ecosystem)

## 2. Application Overview

The Meme Coin Launch Platform is a web-based dApp that enables users to create, launch, and trade meme coins on the Sui blockchain. Inspired by Pump.fun, it leverages Sui’s high-performance architecture and Move programming language to offer instant token creation, bonding curve trading, automatic liquidity pool setup on Sui DEXes (e.g., Cetus, Turbos), and a user-friendly interface. The platform includes features like a creator dashboard, trending coins, leaderboards, and burn mechanics, catering to a diverse audience.

## 3. User Flows

Below are the detailed user flows for the primary functionalities of the platform, describing step-by-step interactions, screen transitions, and system responses. Each flow is designed to ensure clarity and efficiency for users.

### 3.1 Wallet Connection Flow
**Objective**: Connect a Sui-compatible wallet to interact with the platform.

1. **Entry Point**: User lands on the Home Page.
2. **Action**: User clicks the "Connect Wallet" button in the top-right corner.
3. **Screen Transition**: Navigates to the Wallet Connection Page.
4. **Interaction**:
   - System displays a list of supported Sui wallets (e.g., Sui Wallet, Martian).
   - User selects a wallet.
   - System prompts the wallet extension/app to authenticate.
5. **System Response**:
   - Upon successful authentication, system connects the wallet.
   - System displays the user’s wallet address and SUI balance in the header.
6. **Exit Point**:
   - User is redirected to the Home Page with connected status.
   - If connection fails, an error message is shown, and user remains on the Wallet Connection Page.
7. **Alternative Action**: User clicks "Disconnect Wallet" to unlink their wallet, resetting the header to show the "Connect Wallet" button.

**Key UI Elements**:
- "Connect Wallet" button
- Wallet selection modal
- Wallet address and balance display
- Error message popup

### 3.2 Token Creation Flow
**Objective**: Create and launch a new meme coin on the platform.

1. **Entry Point**: User is on the Home Page with a connected wallet.
2. **Action**: User clicks the "Create Coin" button.
3. **Screen Transition**: Navigates to the Create Coin Page.
4. **Interaction**:
   - System presents a form with fields:
     - Name (e.g., “DogeMoon”)
     - Symbol (e.g., “DOGM”)
     - Image upload (JPEG/PNG, max 5MB)
     - Initial supply (e.g., 1,000,000 tokens)
     - Bonding curve parameters (e.g., initial price, slope)
     - Royalty fee percentage (e.g., 1%)
   - User fills in the details and uploads an image.
   - System validates inputs (e.g., unique symbol, valid image format).
   - User clicks “Preview” to review the coin details.
5. **System Response**:
   - System displays a preview of the coin’s appearance and parameters.
   - User clicks “Confirm” to proceed.
   - System prompts the wallet to sign the transaction and pay a creation fee in SUI.
6. **Interaction**:
   - User approves the transaction in their wallet.
7. **System Response**:
   - System deploys a Move smart contract on the Sui blockchain.
   - System lists the coin on the platform’s market.
   - System notifies the user of successful creation.
8. **Exit Point**:
   - User is redirected to the Coin Details Page for the new coin.
   - If the transaction fails, an error message is shown, and user remains on the Create Coin Page.

**Key UI Elements**:
- Form fields for coin details
- Image upload button
- “Preview” and “Confirm” buttons
- Transaction confirmation modal
- Success/error notification

### 3.3 Trading Flow (Buy/Sell Meme Coin)
**Objective**: Buy or sell a meme coin using the bonding curve model.

1. **Entry Point**: User is on the Home Page or Search Page with a connected wallet.
2. **Action**: User navigates to the Explore Page or uses the search bar to find a coin.
3. **Screen Transition**: Navigates to the Coin Details Page upon selecting a coin.
4. **Interaction**:
   - System displays:
     - Coin name, symbol, and image
     - Real-time price chart
     - Current price, market cap, and holder count
     - Buy and sell interfaces
   - For buying:
     - User enters the amount of SUI to spend.
     - System calculates the number of tokens to receive based on the bonding curve.
   - For selling (if user holds the coin):
     - User enters the number of tokens to sell.
     - System calculates the SUI to receive.
   - User clicks “Buy” or “Sell.”
5. **System Response**:
   - System prompts the wallet to sign the transaction.
6. **Interaction**:
   - User approves the transaction.
7. **System Response**:
   - System executes the trade via the smart contract.
   - System updates the user’s portfolio and the coin’s market data.
   - System notifies the user of the successful trade.
8. **Exit Point**:
   - User remains on the Coin Details Page with updated data.
   - If the transaction fails, an error message is shown.

**Key UI Elements**:
- Price chart
- Buy/sell input fields
- “Buy” and “Sell” buttons
- Transaction confirmation modal
- Success/error notification

### 3.4 Automatic Liquidity Pool Setup Flow
**Objective**: Automatically transition a meme coin to a Sui DEX liquidity pool when it reaches a market cap threshold.

1. **Entry Point**: System monitors all meme coins in the background.
2. **Action**: A meme coin’s market cap reaches the predefined threshold (e.g., $69,000).
3. **System Response**:
   - System triggers the liquidity pool creation process.
   - System interacts with a Sui DEX (e.g., Cetus or Turbos) smart contract to create a new pool.
   - System allocates a portion of the coin’s tokens and SUI to the pool.
   - System lists the coin on the DEX.
4. **Interaction**:
   - System notifies the coin’s creator and holders via the platform (e.g., dashboard, notifications).
5. **Exit Point**:
   - Coin Details Page updates to indicate DEX listing with a link to the DEX trading pair.
   - No direct user interaction is required for this flow.

**Key UI Elements**:
- Notification popup for creator and holders
- DEX listing status on Coin Details Page

### 3.5 Creator Dashboard Flow
**Objective**: Allow coin creators to monitor and manage their meme coins.

1. **Entry Point**: User is on the Home Page with a connected wallet and has created at least one coin.
2. **Action**: User clicks “My Dashboard” in the navigation menu.
3. **Screen Transition**: Navigates to the Creator Dashboard.
4. **Interaction**:
   - System displays:
     - List of user’s created coins
     - Analytics for each coin (e.g., trading volume, holder count, price chart)
     - Option to edit coin metadata (e.g., description, image)
   - User selects a coin to view detailed analytics.
   - User clicks “Edit Metadata” to update details.
5. **System Response**:
   - For analytics: System fetches data from the blockchain or indexer and renders charts.
   - For metadata updates: System prompts the wallet to sign the transaction.
6. **Interaction**:
   - User approves the metadata update transaction.
7. **System Response**:
   - System updates the coin’s metadata on the blockchain.
   - System notifies the user of the successful update.
8. **Exit Point**:
   - User remains on the Creator Dashboard with updated data.
   - If the transaction fails, an error message is shown.

**Key UI Elements**:
- Coin list with analytics
- Charts for volume and holders
- “Edit Metadata” button
- Transaction confirmation modal
- Success/error notification

### 3.6 Explore and Search Flow
**Objective**: Browse and search for meme coins on the platform.

1. **Entry Point**: User is on the Home Page.
2. **Action**: User clicks “Explore Coins” or uses the search bar.
3. **Screen Transition**: Navigates to the Search Page.
4. **Interaction**:
   - System displays a grid/list of all meme coins with name, symbol, market cap, and price.
   - User applies filters (e.g., sort by volume, market cap) or enters a search query (e.g., coin name or symbol).
   - System updates the list based on filters or search criteria.
   - User clicks a coin to view details.
5. **Screen Transition**: Navigates to the Coin Details Page.
6. **Exit Point**:
   - User can return to the Search Page or Home Page via navigation.
   - If no results are found, a “No Results” message is displayed.

**Key UI Elements**:
- Search bar
- Filter dropdowns
- Coin grid/list
- “No Results” message

### 3.7 Portfolio Flow
**Objective**: View and manage the user’s meme coin holdings.

1. **Entry Point**: User is on the Home Page with a connected wallet.
2. **Action**: User clicks “My Portfolio” in the navigation menu.
3. **Screen Transition**: Navigates to the Portfolio Page.
4. **Interaction**:
   - System displays a table of the user’s holdings, including:
     - Coin name and symbol
     - Amount held
     - Current value in SUI
     - Performance metrics (e.g., % change)
   - User clicks a coin to view its details.
5. **Screen Transition**: Navigates to the Coin Details Page.
6. **Exit Point**: User can return to the Portfolio Page or Home Page via navigation.

**Key UI Elements**:
- Holdings table
- Performance metrics
- Coin links

### 3.8 Trending and Leaderboard Flow
**Objective**: View trending meme coins and top-ranked coins or creators.

1. **Entry Point**: User is on the Home Page.
2. **Interaction**:
   - System displays:
     - Trending section with top 5 coins based on recent trading volume.
     - Leaderboard section with top 5 coins or creators based on metrics (e.g., market cap, followers).
   - User clicks a coin or creator to view details.
3. **Screen Transition**:
   - For coins: Navigates to the Coin Details Page.
   - For creators: Navigates to a Creator Profile Page (if implemented) or Coin Details Page.
4. **Exit Point**: User can navigate back to the Home Page.

**Key UI Elements**:
- Trending coin cards
- Leaderboard table
- Clickable coin/creator links

## 4. Screen Inventory

Below is a list of the main screens with their key elements and navigation options.

1. **Home Page**
   - **Purpose**: Main landing page with an overview of the platform.
   - **Elements**:
     - Trending coins section (carousel or grid)
     - Leaderboard section (table or cards)
     - “Create Coin” and “Explore Coins” buttons
     - Navigation bar (Home, Explore, Portfolio, Dashboard, Connect Wallet)
   - **Navigation**:
     - To Create Coin Page, Explore Page, Portfolio Page, Dashboard, Wallet Connection Page

2. **Wallet Connection Page**
   - **Purpose**: Facilitate wallet connection/disconnection.
   - **Elements**:
     - Wallet selection modal
     - “Connect” and “Disconnect” buttons
     - Wallet address and balance display
     - Error message popup
   - **Navigation**:
     - Back to Home Page

3. **Create Coin Page**
   - **Purpose**: Allow users to create a new meme coin.
   - **Elements**:
     - Form fields (name, symbol, image, supply, bonding curve, royalty fee)
     - Image upload button
     - “Preview” and “Confirm” buttons
     - Transaction confirmation modal
     - Success/error notification
   - **Navigation**:
     - To Coin Details Page (on success)
     - Back to Home Page

4. **Explore Page**
   - **Purpose**: Browse and search for meme coins.
   - **Elements**:
     - Search bar
     - Filter dropdowns (e.g., sort by volume, market cap)
     - Coin grid/list (name, symbol, market cap, price)
     - “No Results” message
   - **Navigation**:
     - To Coin Details Page
     - Back to Home Page

5. **Coin Details Page**
   - **Purpose**: View and trade a specific meme coin.
   - **Elements**:
     - Coin name, symbol, image
     - Price chart (real-time)
     - Market cap, holder count
     - Buy/sell input fields and buttons
     - Tabs for holder info and transaction history
     - DEX listing status (if applicable)
     - Transaction confirmation modal
     - Success/error notification
   - **Navigation**:
     - Back to Explore Page or Home Page

6. **Portfolio Page**
   - **Purpose**: Display the user’s meme coin holdings.
   - **Elements**:
     - Holdings table (coin, amount, value, performance)
     - Clickable coin links
   - **Navigation**:
     - To Coin Details Page
     - Back to Home Page

7. **Creator Dashboard**
   - **Purpose**: Manage and monitor created coins.
   - **Elements**:
     - List of created coins
     - Analytics charts (volume, holders, price)
     - “Edit Metadata” button
     - Transaction confirmation modal
     - Success/error notification
   - **Navigation**:
     - To Coin Details Page
     - Back to Home Page

## 5. Navigation Map

The following outlines the navigation structure of the platform:

- **Home Page**
  - Connect Wallet → Wallet Connection Page
  - Create Coin → Create Coin Page
  - Explore Coins → Explore Page
  - My Portfolio → Portfolio Page
  - My Dashboard → Creator Dashboard

- **Wallet Connection Page**
  - Back to Home Page

- **Create Coin Page**
  - Confirm → Coin Details Page
  - Cancel → Home Page

- **Explore Page**
  - Select Coin → Coin Details Page
  - Back → Home Page

- **Coin Details Page**
  - Back → Explore Page or Home Page

- **Portfolio Page**
  - Select Coin → Coin Details Page
  - Back → Home Page

- **Creator Dashboard**
  - Select Coin → Coin Details Page
  - Back → Home Page

## 6. Error Handling

- **Wallet Connection Failure**: Display an error message (e.g., “Failed to connect wallet. Please try again.”) and allow retry.
- **Invalid Coin Details**: Highlight invalid form fields (e.g., duplicate symbol) with error messages.
- **Transaction Failure**: Show an error notification (e.g., “Transaction failed. Insufficient SUI balance.”) and allow retry.
- **No Search Results**: Display a “No results found” message with a suggestion to adjust filters.
- **Network Issues**: Show a generic error (e.g., “Network error. Please check your connection.”) with a retry option.

## 7. Assumptions and Constraints

### 7.1 Assumptions
- Users have Sui-compatible wallets installed.
- Sui blockchain provides sub-second transaction confirmations.
- DEX APIs (Cetus/Turbos) are reliable and documented.

### 7.2 Constraints
- UI must be responsive for desktop and mobile browsers.
- Smart contract interactions must use Move and Sui SDK.
- No local file I/O due to potential Pyodide limitations.

## 8. Design Guidelines

### 8.1 UI/UX Principles
- **Simplicity**: Clean, intuitive interface inspired by Pump.fun’s minimalistic design.
- **Consistency**: Uniform fonts, colors, and button styles (e.g., dark theme with neon accents).
- **Feedback**: Provide immediate feedback for actions (e.g., loading spinners, success notifications).
- **Accessibility**: Ensure high contrast and screen reader compatibility.

### 8.2 Visual Style
- **Theme**: Dark background with vibrant accents (e.g., neon green, blue).
- **Typography**: Sans-serif fonts (e.g., Inter, Roboto) for readability.
- **Icons**: Use modern icon libraries (e.g., FontAwesome) for wallet, charts, etc.
- **Animations**: Subtle transitions for page loads and button clicks.

## 9. Supporting Features

- **Notifications**: Real-time alerts for key events (e.g., DEX listing) via WebSockets or push notifications.
- **Tutorials**: In-app tooltips or a help section for newcomers.
- **Responsive Design**: Optimized for mobile and desktop with adaptive layouts.
- **Analytics**: Real-time data visualization for price charts and dashboard metrics.

## 10. Appendix

### 10.1 Sample Bonding Curve Logic
- **Formula**: Price = InitialPrice + (Slope * TokensPurchased)
- **Example**:
  - InitialPrice = 0.001 SUI
  - Slope = 0.0001
  - TokensPurchased = 1000
  - Price = 0.001 + (0.0001 * 1000) = 0.101 SUI per token

### 10.2 Sample Notification
- **Event**: Coin listed on DEX
- **Message**: “Congratulations! Your coin [CoinName] is now listed on Cetus DEX. Visit the trading pair to continue trading.”

### 10.3 Sample Error Message
- **Scenario**: Invalid symbol
- **Message**: “The symbol [Symbol] is already in use. Please choose a unique symbol.”