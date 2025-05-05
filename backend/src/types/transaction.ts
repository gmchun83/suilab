/**
 * Transaction types
 */
export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  BURN = 'BURN',
  CREATE = 'CREATE',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
}

/**
 * Transaction model
 */
export interface Transaction {
  id: string;
  txId: string;
  coinId: string;
  type: TransactionType;
  amount: string;
  price: number;
  value: string;
  walletAddress: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Input for creating a transaction
 */
export interface TransactionCreateInput {
  txId: string;
  coinId: string;
  type: TransactionType;
  amount: string;
  price: number;
  value: string;
  walletAddress: string;
  timestamp: Date;
}
