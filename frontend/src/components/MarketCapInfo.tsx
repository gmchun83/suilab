import React, { useEffect } from 'react';
import { useDex } from '../hooks';
import { Coin } from '../types';
import { Card } from './common/Card';
import { formatCurrency, formatNumber } from '../utils/formatting';

interface MarketCapInfoProps {
  coin: Coin;
}

const MarketCapInfo: React.FC<MarketCapInfoProps> = ({ coin }) => {
  const { marketCap, loading, error, getMarketCap } = useDex();
  
  useEffect(() => {
    if (coin.id) {
      getMarketCap(coin.id);
    }
  }, [coin.id, getMarketCap]);
  
  if (loading) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Market Cap</h3>
        <p className="text-gray-600">Loading market cap information...</p>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Market Cap</h3>
        <p className="text-red-600">Error loading market cap: {error}</p>
      </Card>
    );
  }
  
  if (!marketCap) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Market Cap</h3>
        <p className="text-gray-600">Market cap information not available.</p>
      </Card>
    );
  }
  
  // Calculate market cap in USD (assuming 1 SUI = $1 for simplicity)
  // In a real app, you would fetch the current SUI price
  const suiPrice = 1; // Placeholder for SUI price in USD
  const marketCapUsd = parseFloat(marketCap.marketCap) * suiPrice;
  
  // Calculate fully diluted market cap
  const fullyDilutedMarketCap = parseFloat(coin.supply) * marketCap.price * suiPrice;
  
  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Market Cap</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600 text-sm">Market Cap (SUI)</p>
          <p className="text-xl font-bold">{formatNumber(marketCap.marketCap)} SUI</p>
          <p className="text-gray-500 text-sm">{formatCurrency(marketCapUsd)}</p>
        </div>
        
        <div>
          <p className="text-gray-600 text-sm">Fully Diluted Market Cap</p>
          <p className="text-xl font-bold">{formatNumber(fullyDilutedMarketCap.toString())} SUI</p>
          <p className="text-gray-500 text-sm">{formatCurrency(fullyDilutedMarketCap)}</p>
        </div>
        
        <div>
          <p className="text-gray-600 text-sm">Current Price</p>
          <p className="text-xl font-bold">{formatNumber(marketCap.price.toString())} SUI</p>
          <p className="text-gray-500 text-sm">{formatCurrency(marketCap.price * suiPrice)}</p>
        </div>
        
        <div>
          <p className="text-gray-600 text-sm">Circulating Supply</p>
          <p className="text-xl font-bold">{formatNumber(coin.supply)}</p>
          <p className="text-gray-500 text-sm">
            {coin.burnedSupply ? `${formatNumber(coin.burnedSupply)} burned` : ''}
          </p>
        </div>
      </div>
      
      {coin.dexListed && (
        <div className="mt-4 p-2 bg-green-50 border border-green-200 rounded text-green-800 text-sm">
          This coin is listed on Cetus DEX! You can trade it directly on the DEX.
        </div>
      )}
    </Card>
  );
};

export default MarketCapInfo;
