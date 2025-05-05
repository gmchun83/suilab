export interface Transaction {
  id: string;
  coinId: string;
  type: TransactionType;
  amount: string;
  price: string;
  value: string;
  walletAddress: string;
  timestamp: string;
  txHash: string;
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL',
  BURN = 'BURN',
  CREATE = 'CREATE',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY'
}
