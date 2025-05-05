export interface Coin {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
  totalSupply: string;
  marketCap: string;
  price: string;
  creatorAddress: string;
  createdAt: string;
}

export interface CoinDetails extends Coin {
  description?: string;
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

export interface CreateCoinParams {
  name: string;
  symbol: string;
  imageUrl: string;
  totalSupply: string;
  description?: string;
}
