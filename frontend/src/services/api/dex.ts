import { apiClient } from './client';
import { PoolInfo, PriceImpact, PriceHistory, MarketCap } from '../../types';

/**
 * Get pool information for a coin
 */
export const getPoolInfo = async (coinId: string): Promise<PoolInfo> => {
  const response = await apiClient.get(`/dex/pool/${coinId}`);
  return response.data.data;
};

/**
 * Get all DEX pools for a coin
 */
export const getDexPools = async (coinId: string): Promise<PoolInfo[]> => {
  const response = await apiClient.get(`/dex/pools/${coinId}`);
  return response.data.data;
};

/**
 * Calculate price impact for a trade
 */
export const calculatePriceImpact = async (
  coinId: string, 
  amount: number, 
  isBuy: boolean
): Promise<PriceImpact> => {
  const response = await apiClient.post(`/dex/price-impact/${coinId}`, {
    amount,
    isBuy
  });
  return response.data.data;
};

/**
 * Get price history for a coin
 */
export const getPriceHistory = async (
  coinId: string, 
  timeframe: '1h' | '1d' | '1w' | '1m' = '1d'
): Promise<PriceHistory[]> => {
  const response = await apiClient.get(`/dex/price-history/${coinId}`, {
    params: { timeframe }
  });
  return response.data.data;
};

/**
 * Get market cap for a coin
 */
export const getMarketCap = async (coinId: string): Promise<MarketCap> => {
  const response = await apiClient.get(`/dex/market-cap/${coinId}`);
  return response.data.data;
};

/**
 * Create a Cetus DEX liquidity pool for a coin
 */
export const createDexPool = async (
  coinId: string,
  suiAmount: string,
  tokenAmount: string,
  walletAddress: string
): Promise<{ success: boolean; dexPoolId: string; poolDbId: string }> => {
  const response = await apiClient.post(`/dex/create-pool/${coinId}`, {
    suiAmount,
    tokenAmount,
    walletAddress
  });
  return response.data.data;
};

export default {
  getPoolInfo,
  getDexPools,
  calculatePriceImpact,
  getPriceHistory,
  getMarketCap,
  createDexPool
};
