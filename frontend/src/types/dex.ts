/**
 * Pool information
 */
export interface PoolInfo {
  id: string;
  objectId: string;
  coinId: string;
  type: PoolType;
  suiBalance: string;
  tokenBalance: string;
  creatorAddress: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pool types
 */
export enum PoolType {
  BONDING_CURVE = 'BONDING_CURVE',
  DEX = 'DEX'
}

/**
 * Price impact calculation result
 */
export interface PriceImpact {
  priceImpact: number; // Percentage impact (0-100)
  expectedPrice: number; // Expected execution price
}

/**
 * Price history data point
 */
export interface PriceHistory {
  timestamp: number;
  price: number;
}

/**
 * Market cap information
 */
export interface MarketCap {
  marketCap: string;
  price: number;
}

/**
 * DEX listing parameters
 */
export interface DexListingParams {
  coinId: string;
  suiAmount: string;
  tokenAmount: string;
  walletAddress: string;
}

/**
 * DEX listing result
 */
export interface DexListingResult {
  success: boolean;
  dexPoolId: string;
  poolDbId: string;
}
