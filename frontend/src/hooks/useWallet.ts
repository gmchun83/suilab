import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateBalance
} from '../store/slices/walletSlice'
import { suiClient } from '../utils/suiClient'
import {
  getStoredWalletPreference,
  getWalletAdapter,
  WALLET_STORAGE_KEY,
  type WalletId
} from '../utils/walletAdapters'

export const useWallet = () => {
  const dispatch = useDispatch()
  const { address, connected, balance, loading, error } = useSelector((state: RootState) => state.wallet)

  const connect = useCallback(async (walletId?: WalletId) => {
    try {
      dispatch(connectWalletStart())

      const storedWallet = getStoredWalletPreference()
      const { id, adapter } = getWalletAdapter(walletId ?? storedWallet)

      if (!adapter || !id) {
        throw new Error('Sui wallet not found. Please install a compatible wallet extension.')
      }

      if (adapter.requestPermissions) {
        await adapter.requestPermissions()
      } else if (adapter.connect) {
        await adapter.connect()
      }

      const accounts = await adapter.getAccounts()

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet')
      }

      const balanceData = await suiClient.getBalance({
        owner: accounts[0]
      })

      localStorage.setItem('walletConnected', 'true')
      localStorage.setItem(WALLET_STORAGE_KEY, id)

      dispatch(connectWalletSuccess({
        address: accounts[0],
        balance: balanceData.totalBalance
      }))

      return true
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      dispatch(connectWalletFailure(error instanceof Error ? error.message : 'Unknown error'))
      return false
    }
  }, [dispatch])

  // Check for wallet on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window === 'undefined') {
        return
      }

      const storedWallet = getStoredWalletPreference()
      const { id, adapter } = getWalletAdapter(storedWallet)
      if (adapter && localStorage.getItem('walletConnected') === 'true') {
        try {
          await connect(id)
        } catch (error) {
          console.error('Failed to reconnect wallet:', error)
        }
      }
    }

    void checkWalletConnection()
  }, [connect])

  // Refresh balance periodically
  useEffect(() => {
    if (!connected || !address) return

    const refreshBalance = async () => {
      try {
        const balanceData = await suiClient.getBalance({
          owner: address
        })
        dispatch(updateBalance(balanceData.totalBalance))
      } catch (error) {
        console.error('Failed to refresh balance:', error)
      }
    }

    void refreshBalance()
    const intervalId = setInterval(refreshBalance, 30000) // Every 30 seconds

    return () => clearInterval(intervalId)
  }, [connected, address, dispatch])

  const disconnect = useCallback(() => {
    try {
      localStorage.removeItem('walletConnected')
      localStorage.removeItem(WALLET_STORAGE_KEY)

      dispatch(disconnectWallet())
      return true
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
      return false
    }
  }, [dispatch])

  return {
    address,
    connected,
    balance,
    loading,
    error,
    connect,
    disconnect
  }
}

export default useWallet
