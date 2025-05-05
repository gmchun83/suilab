import { apiClient } from './client';
import { Transaction } from '../../types';

export const getTransactions = async (coinId: string): Promise<Transaction[]> => {
  const response = await apiClient.get(`/transactions/${coinId}`);
  return response.data;
};

export const createTransaction = async (transactionData: Partial<Transaction>): Promise<Transaction> => {
  const response = await apiClient.post('/transactions', transactionData);
  return response.data;
};

export default {
  getTransactions,
  createTransaction
};
