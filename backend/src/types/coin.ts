/**
 * Coin model
 */
export interface Coin {
  id: string;
  objectId: string;
  name: string;
  symbol: string;
  description?: string;
  creatorAddress: string;
  supply: string;
  price: number;
  marketCap: string;
  volume24h: string;
  priceChange24h: string;
  holders: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a coin
 */
export interface CoinCreateInput {
  objectId: string;
  name: string;
  symbol: string;
  description?: string;
  creatorAddress: string;
  supply: string;
  price: number;
  marketCap: string;
  volume24h: string;
  priceChange24h: string;
  holders: number;
  imageUrl?: string;
}

/**
 * Input for updating a coin
 */
export interface CoinUpdateInput {
  price?: number;
  marketCap?: string;
  volume24h?: string;
  priceChange24h?: string;
  holders?: number;
  imageUrl?: string;
}

/**
 * Coin with price history
 */
export interface CoinWithPriceHistory extends Coin {
  priceHistory: PricePoint[];
}

/**
 * Price point for historical data
 */
export interface PricePoint {
  timestamp: number; // Timestamp in milliseconds
  price: string;
}
