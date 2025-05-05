import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { connectWallet, disconnectWallet } from '../store/slices/walletSlice';

export const useWallet = () => {
  const dispatch = useDispatch();
  const { address, connected, balance } = useSelector((state: RootState) => state.wallet);

  const connect = useCallback(async () => {
    try {
      // Implementation will depend on the Sui wallet adapter
      dispatch(connectWallet({ address: '0x123...', balance: '100' }));
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }, [dispatch]);

  const disconnect = useCallback(() => {
    try {
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
    connect,
    disconnect
  };
};

export default useWallet;
