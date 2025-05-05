export interface Wallet {
  address: string;
  connected: boolean;
  balance: string;
  network?: string;
}

export interface WalletConnection {
  address: string;
  balance: string;
}
