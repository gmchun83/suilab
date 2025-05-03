import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { createContext, useContext } from 'react'

// Initialize Sui client
const rpcUrl = import.meta.env.VITE_SUI_RPC_URL || getFullnodeUrl('mainnet')
export const suiClient = new SuiClient({ url: rpcUrl })

// Create a context for the Sui client
const SuiClientContext = createContext<SuiClient | null>(null)

export const SuiClientProvider = SuiClientContext.Provider

export const useSuiClient = () => {
  const client = useContext(SuiClientContext)
  if (!client) {
    throw new Error('useSuiClient must be used within a SuiClientProvider')
  }
  return client
}

// Helper functions for wallet interactions
export const connectWallet = async () => {
  // This is a placeholder for wallet connection logic
  // In a real app, you would use a wallet adapter like @mysten/wallet-adapter
  console.log('Connecting wallet...')
  return {
    address: '0x123...', // Placeholder
    balance: '100', // Placeholder
  }
}

export const createCoin = async ({ name, symbol }: { name: string; symbol: string }) => {
  // This is a placeholder for coin creation logic
  console.log(`Creating coin: ${name} (${symbol})`)
  // In a real app, you would call the smart contract
  return {
    id: '123',
    name,
    symbol,
  }
}

export default suiClient
