import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateBalance
} from '../store/slices/walletSlice';
import { suiClient } from '../utils/suiClient';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { address, connected, balance, loading, error } = useSelector((state: RootState) => state.wallet);

  // Check for wallet on mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.suiWallet && localStorage.getItem('walletConnected') === 'true') {
        try {
          await connect();
        } catch (error) {
          console.error('Failed to reconnect wallet:', error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  // Refresh balance periodically
  useEffect(() => {
    if (!connected || !address) return;

    const refreshBalance = async () => {
      try {
        const balanceData = await suiClient.getBalance({
          owner: address
        });
        dispatch(updateBalance(balanceData.totalBalance));
      } catch (error) {
        console.error('Failed to refresh balance:', error);
      }
    };

    refreshBalance();
    const intervalId = setInterval(refreshBalance, 30000); // Every 30 seconds

    return () => clearInterval(intervalId);
  }, [connected, address, dispatch]);

  const connect = useCallback(async () => {
    try {
      dispatch(connectWalletStart());

      if (!window.suiWallet) {
        throw new Error('Sui wallet not found. Please install the Sui wallet extension.');
      }

      // Request wallet permissions
      await window.suiWallet.requestPermissions();

      // Get accounts
      const accounts = await window.suiWallet.getAccounts();

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }

      // Get the balance
      const balanceData = await suiClient.getBalance({
        owner: accounts[0]
      });

      // Store connection in local storage
      localStorage.setItem('walletConnected', 'true');

      // Update Redux state
      dispatch(connectWalletSuccess({
        address: accounts[0],
        balance: balanceData.totalBalance
      }));

      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      dispatch(connectWalletFailure(error instanceof Error ? error.message : 'Unknown error'));
      return false;
    }
  }, [dispatch]);

  const disconnect = useCallback(() => {
    try {
      // Remove from local storage
      localStorage.removeItem('walletConnected');

      // Update Redux state
      dispatch(disconnectWallet());
      return true;
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      return false;
    }
  }, [dispatch]);

  return {
    address,
    connected,
    balance,
    loading,
    error,
    connect,
    disconnect
  };
};

export default useWallet;
