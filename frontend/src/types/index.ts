// Coin related types
export interface Coin {
  id: string;
  objectId: string;
  name: string;
  symbol: string;
  description?: string;
  creatorAddress: string;
  supply: string;
  price: number;
  imageUrl?: string;
  createdAt: string;
  marketCap?: string;
}

export interface CoinDetails extends Coin {
  holders: number;
  volume24h: string;
  priceChange24h: string;
  priceHistory: PricePoint[];
  liquidity?: string;
  dexUrl?: string;
}

export interface PricePoint {
  timestamp: number;
  price: string;
}

export interface CoinCreationParams {
  name: string;
  symbol: string;
  description?: string;
  initialSupply: string;
  imageUrl?: string;
}

// Transaction related types
export interface Transaction {
  id: string;
  txId: string;
  coinId: string;
  type: TransactionType;
  amount: string;
  price: number;
  walletAddress: string;
  timestamp: string;
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  BURN = 'BURN',
  CREATE = 'CREATE',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY'
}

// User and wallet related types
export interface User {
  address: string;
  balance: string;
  username?: string;
  profileImageUrl?: string;
}

export interface Wallet {
  address: string;
  connected: boolean;
  balance: string;
  network?: string;
}

export interface WalletConnection {
  address: string;
  balance: string;
}
