import { apiClient } from './client';
import { Coin, CoinDetails } from '../../types';

export const getCoins = async (): Promise<Coin[]> => {
  const response = await apiClient.get('/coins');
  return response.data;
};

export const getCoinById = async (id: string): Promise<CoinDetails> => {
  const response = await apiClient.get(`/coins/${id}`);
  return response.data;
};

export const getTrendingCoins = async (): Promise<Coin[]> => {
  const response = await apiClient.get('/coins/trending');
  return response.data;
};

export const createCoin = async (coinData: Partial<Coin>): Promise<CoinDetails> => {
  const response = await apiClient.post('/coins', coinData);
  return response.data;
};

export default {
  getCoins,
  getCoinById,
  getTrendingCoins,
  createCoin
};
