import { API_BASE_URL } from './api'

// API endpoints
export { API_BASE_URL }
export const SUI_RPC_URL = import.meta.env.VITE_SUI_RPC_URL || 'https://fullnode.testnet.sui.io';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;

// Timeouts
export const API_TIMEOUT = 10000; // 10 seconds

// Coin creation
export const MIN_COIN_SUPPLY = '1000';
export const MAX_COIN_SUPPLY = '1000000000000';
export const MAX_NAME_LENGTH = 50;
export const MAX_SYMBOL_LENGTH = 10;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Chart defaults
export const DEFAULT_CHART_DAYS = 7;
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  background: '#F3F4F6',
  text: '#1F2937',
};

// Wallet
export const SUPPORTED_WALLETS = [
  'Suiet Wallet',
  'Slush Wallet'
];

// Error messages
export const ERROR_MESSAGES = {
  WALLET_CONNECTION: 'Failed to connect wallet. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  UNAUTHORIZED: 'Please connect your wallet to access this feature.',
};

export default {
  API_BASE_URL,
  SUI_RPC_URL,
  DEFAULT_PAGE_SIZE,
  API_TIMEOUT,
  MIN_COIN_SUPPLY,
  MAX_COIN_SUPPLY,
  MAX_NAME_LENGTH,
  MAX_SYMBOL_LENGTH,
  MAX_DESCRIPTION_LENGTH,
  MAX_IMAGE_SIZE,
  DEFAULT_CHART_DAYS,
  CHART_COLORS,
  SUPPORTED_WALLETS,
  ERROR_MESSAGES,
};
