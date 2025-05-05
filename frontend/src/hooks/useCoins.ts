import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchCoins, fetchCoinDetails } from '../store/slices/coinsSlice';

export const useCoins = () => {
  const dispatch = useDispatch();
  const { coins, trendingCoins, selectedCoin, loading, error } = useSelector(
    (state: RootState) => state.coins
  );

  const getCoins = useCallback(() => {
    dispatch(fetchCoins());
  }, [dispatch]);

  const getCoinDetails = useCallback(
    (coinId: string) => {
      dispatch(fetchCoinDetails(coinId));
    },
    [dispatch]
  );

  return {
    coins,
    trendingCoins,
    selectedCoin,
    loading,
    error,
    getCoins,
    getCoinDetails
  };
};

export default useCoins;
