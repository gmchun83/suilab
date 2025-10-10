import axios, { AxiosError } from 'axios'
import { Coin, CoinDetails } from '../types'
import { Transaction } from '../types'
import { API_BASE_URL } from '../config/api'
import { handleApiError, ApiError, NetworkError, TimeoutError } from './errorHandler'

const API_URL = API_BASE_URL

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Use our custom error handler
    const processedError = handleApiError(error);

    // Log the error for debugging
    if (processedError instanceof ApiError) {
      console.error(`API Error (${processedError.status}):`, processedError.message);
    } else if (processedError instanceof NetworkError) {
      console.error('Network Error:', processedError.message);
    } else if (processedError instanceof TimeoutError) {
      console.error('Timeout Error:', processedError.message);
    } else {
      console.error('Unexpected Error:', processedError.message);
    }

    return Promise.reject(processedError);
  }
);

/**
 * Fetch all coins
 */
export const fetchCoins = async (): Promise<Coin[]> => {
  try {
    const response = await api.get('/coins');
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

/**
 * Fetch trending coins
 */
export const fetchTrendingCoins = async (): Promise<Coin[]> => {
  try {
    const response = await api.get('/coins/trending');
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

/**
 * Fetch coin details by ID
 */
export const fetchCoinById = async (id: string): Promise<CoinDetails> => {
  try {
    const response = await api.get(`/coins/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

/**
 * Fetch price history for a specific coin
 */
export const fetchCoinPriceHistory = async (id: string, period: string = '24h'): Promise<any> => {
  try {
    const response = await api.get(`/coins/${id}/price-history`, {
      params: { period }
    });
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

/**
 * Fetch transactions for a specific coin
 */
export const fetchTransactions = async (coinId: string): Promise<{ transactions: Transaction[] }> => {
  try {
    const response = await api.get(`/transactions/${coinId}`);
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

/**
 * Fetch user portfolio
 */
export const fetchUserPortfolio = async (address: string): Promise<{ coins: Coin[], totalValue: string }> => {
  try {
    const response = await api.get(`/users/${address}/portfolio`);
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

/**
 * Fetch leaderboard
 */
export const fetchLeaderboard = async (limit: number = 10, sortBy: string = 'marketCap'): Promise<Coin[]> => {
  try {
    const response = await api.get('/coins/leaderboard', {
      params: { limit, sortBy }
    });
    return response.data.data || response.data;
  } catch (error) {
    // Error is already processed by the interceptor
    throw error;
  }
}

export default api
