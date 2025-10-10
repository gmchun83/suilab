import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client'
import { TransactionBlock } from '@mysten/sui.js/transactions'
import { createContext, useContext } from 'react'
import { CoinCreationParams } from '../types'
import { getStoredWalletPreference, getWalletAdapter, type WalletId } from './walletAdapters'

// Initialize Sui client
const rpcUrl = import.meta.env.VITE_SUI_RPC_URL || getFullnodeUrl('testnet')
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

// Contract addresses
const MEME_COIN_PACKAGE = import.meta.env.VITE_MEME_COIN_PACKAGE || '0x123'; // Replace with actual package ID
const DEX_INTEGRATION_PACKAGE = import.meta.env.VITE_DEX_INTEGRATION_PACKAGE || '0x456'; // Replace with actual package ID

// Helper functions for wallet interactions
const getActiveWallet = (preferredId?: WalletId) => {
  const storedWallet = getStoredWalletPreference()
  const { adapter } = getWalletAdapter(preferredId ?? storedWallet)

  if (!adapter) {
    throw new Error('Sui wallet not found. Please install a compatible wallet extension.')
  }

  return adapter
}

export const connectWallet = async (walletId?: WalletId) => {
  try {
    const wallet = getActiveWallet(walletId)

    if (wallet.requestPermissions) {
      await wallet.requestPermissions()
    }

    const accounts = await wallet.getAccounts()

    if (accounts && accounts.length > 0) {
      const balance = await suiClient.getBalance({
        owner: accounts[0]
      })

      return {
        address: accounts[0],
        balance: balance.totalBalance
      }
    }

    throw new Error('No accounts found in wallet')
  } catch (error) {
    console.error('Error connecting wallet:', error)
    throw error
  }
}

export const createCoin = async (params: CoinCreationParams) => {
  try {
    const wallet = getActiveWallet()

    const accounts = await wallet.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet first.');
    }

    const tx = new TransactionBlock();

    // Convert parameters to the format expected by the contract
    const nameBytes = Array.from(new TextEncoder().encode(params.name));
    const symbolBytes = Array.from(new TextEncoder().encode(params.symbol));
    const descriptionBytes = params.description
      ? Array.from(new TextEncoder().encode(params.description))
      : Array.from(new TextEncoder().encode(''));
    const iconUrlBytes = params.imageUrl
      ? Array.from(new TextEncoder().encode(params.imageUrl))
      : Array.from(new TextEncoder().encode(''));

    // Call the create_coin function from the meme_coin module
    tx.moveCall({
      target: `${MEME_COIN_PACKAGE}::meme_coin::create_coin`,
      arguments: [
        tx.pure(nameBytes),
        tx.pure(symbolBytes),
        tx.pure(descriptionBytes),
        tx.pure(iconUrlBytes),
        tx.pure(params.initialSupply),
        tx.pure(9), // Decimals (standard for SUI tokens)
      ],
    });

    // Sign and execute the transaction
    const result = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
    });

    // In a real implementation, you would parse the transaction result
    // to extract the created coin's ID and other details
    console.log('Transaction result:', result);

    // For now, return a placeholder with the provided data
    // In production, you would extract this from the transaction result
    return {
      id: result.digest.substring(0, 10),
      name: params.name,
      symbol: params.symbol,
      description: params.description,
      initialSupply: params.initialSupply,
    };
  } catch (error) {
    console.error('Error creating coin:', error);
    throw error;
  }
};

export const buyCoin = async (coinId: string, amount: string) => {
  try {
    const wallet = getActiveWallet()

    const accounts = await wallet.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet first.');
    }

    const tx = new TransactionBlock();

    // Call the buy function from the dex_integration module
    // This is a simplified example - in a real app, you would need to:
    // 1. Get the pool object ID for the specific coin
    // 2. Calculate the minimum tokens out based on slippage
    // 3. Handle SUI coin selection for payment

    // For now, we'll use placeholder values
    const poolId = '0x789'; // This would be fetched from your backend or chain
    const minTokensOut = '0'; // In production, calculate this based on slippage

    // Create a SUI coin for the transaction
    const [coin] = tx.splitCoins(tx.gas, [tx.pure(amount)]);

    tx.moveCall({
      target: `${DEX_INTEGRATION_PACKAGE}::dex_integration::buy`,
      arguments: [
        tx.object(poolId), // Pool object ID
        coin, // SUI coin to spend
        tx.pure(minTokensOut), // Minimum tokens to receive
      ],
    });

    // Sign and execute the transaction
    const result = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
    });

    console.log('Buy transaction result:', result);

    return {
      success: true,
      transactionId: result.digest,
    };
  } catch (error) {
    console.error('Error buying coin:', error);
    throw error;
  }
};

export const sellCoin = async (coinId: string, amount: string) => {
  try {
    const wallet = getActiveWallet()

    const accounts = await wallet.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet first.');
    }

    const tx = new TransactionBlock();

    // Call the sell function from the dex_integration module
    // This is a simplified example - in a real app, you would need to:
    // 1. Get the pool object ID for the specific coin
    // 2. Get the coin object ID for the tokens to sell
    // 3. Calculate the minimum SUI out based on slippage

    // For now, we'll use placeholder values
    const poolId = '0x789'; // This would be fetched from your backend or chain
    const coinObjectId = '0xabc'; // This would be the user's coin object ID
    const minSuiOut = '0'; // In production, calculate this based on slippage

    // Create a token coin for the transaction
    // In a real app, you would need to fetch the user's coins and select the right one
    const tokenCoin = tx.object(coinObjectId);

    tx.moveCall({
      target: `${DEX_INTEGRATION_PACKAGE}::dex_integration::sell`,
      arguments: [
        tx.object(poolId), // Pool object ID
        tokenCoin, // Token coin to sell
        tx.pure(minSuiOut), // Minimum SUI to receive
      ],
    });

    // Sign and execute the transaction
    const result = await wallet.signAndExecuteTransactionBlock({
      transactionBlock: tx,
    });

    console.log('Sell transaction result:', result);

    return {
      success: true,
      transactionId: result.digest,
    };
  } catch (error) {
    console.error('Error selling coin:', error);
    throw error;
  }
};

export default suiClient
