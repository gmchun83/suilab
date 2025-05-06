import { useState, useCallback } from 'react';
import { dexApi } from '../services/api';
import { PoolInfo, PriceImpact, PriceHistory, MarketCap, DexListingResult } from '../types';
import { useWallet } from './useWallet';

export const useDex = (coinId?: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pools, setPools] = useState<PoolInfo[]>([]);
  const [poolInfo, setPoolInfo] = useState<PoolInfo | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [marketCap, setMarketCap] = useState<MarketCap | null>(null);
  const { wallet } = useWallet();

  /**
   * Get pool information for a coin
   */
  const getPoolInfo = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dexApi.getPoolInfo(id);
      setPoolInfo(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get pool info');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get all DEX pools for a coin
   */
  const getDexPools = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dexApi.getDexPools(id);
      setPools(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get DEX pools');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Calculate price impact for a trade
   */
  const calculatePriceImpact = useCallback(async (
    id: string,
    amount: number,
    isBuy: boolean
  ): Promise<PriceImpact | null> => {
    if (!id) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dexApi.calculatePriceImpact(id, amount, isBuy);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate price impact');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get price history for a coin
   */
  const getPriceHistory = useCallback(async (
    id: string,
    timeframe: '1h' | '1d' | '1w' | '1m' = '1d'
  ) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dexApi.getPriceHistory(id, timeframe);
      setPriceHistory(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get price history');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get market cap for a coin
   */
  const getMarketCap = useCallback(async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dexApi.getMarketCap(id);
      setMarketCap(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get market cap');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create a Cetus DEX liquidity pool for a coin
   */
  const createDexPool = useCallback(async (
    id: string,
    suiAmount: string,
    tokenAmount: string
  ): Promise<DexListingResult | null> => {
    if (!id || !wallet.address) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await dexApi.createDexPool(
        id,
        suiAmount,
        tokenAmount,
        wallet.address
      );
      
      // Refresh pools after creating a new one
      await getDexPools(id);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create DEX pool');
      return null;
    } finally {
      setLoading(false);
    }
  }, [wallet.address, getDexPools]);

  // Load data if coinId is provided
  const loadData = useCallback(async () => {
    if (!coinId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        getDexPools(coinId),
        getMarketCap(coinId),
        getPriceHistory(coinId)
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load DEX data');
    } finally {
      setLoading(false);
    }
  }, [coinId, getDexPools, getMarketCap, getPriceHistory]);

  return {
    loading,
    error,
    pools,
    poolInfo,
    priceHistory,
    marketCap,
    getPoolInfo,
    getDexPools,
    calculatePriceImpact,
    getPriceHistory,
    getMarketCap,
    createDexPool,
    loadData
  };
};

export default useDex;
