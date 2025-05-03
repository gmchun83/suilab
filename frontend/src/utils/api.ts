import axios from 'axios'
import { Coin } from '../store/slices/coinsSlice'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fetchCoins = async (): Promise<Coin[]> => {
  const response = await api.get('/coins')
  return response.data
}

export const fetchCoinById = async (id: string): Promise<Coin> => {
  const response = await api.get(`/coins/${id}`)
  return response.data
}

export const fetchTransactions = async (coinId: string) => {
  const response = await api.get(`/transactions/${coinId}`)
  return response.data
}

export default api
