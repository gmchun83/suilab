export interface Coin {
  id: string
  objectId: string
  name: string
  symbol: string
  description?: string
  creatorAddress: string
  supply: string
  price: number
  imageUrl?: string
  createdAt: string
}

export interface Transaction {
  id: string
  txId: string
  coinId: string
  type: 'BUY' | 'SELL' | 'BURN'
  amount: string
  price: number
  walletAddress: string
  timestamp: string
}

export interface User {
  address: string
  balance: string
}

export interface CoinCreationParams {
  name: string
  symbol: string
  description?: string
  initialSupply: string
  imageUrl?: string
}
