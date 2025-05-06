import React, { useState } from 'react';
import { useDex } from '../hooks';
import { Coin } from '../types';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { useWallet } from '../hooks';

interface DexPoolCreatorProps {
  coin: Coin;
  onSuccess?: () => void;
}

const DexPoolCreator: React.FC<DexPoolCreatorProps> = ({ coin, onSuccess }) => {
  const [suiAmount, setSuiAmount] = useState<string>('');
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const { createDexPool, loading, error } = useDex();
  const { wallet } = useWallet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!coin.id || !suiAmount || !tokenAmount) {
      return;
    }
    
    const result = await createDexPool(coin.id, suiAmount, tokenAmount);
    
    if (result && result.success) {
      // Reset form
      setSuiAmount('');
      setTokenAmount('');
      
      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    }
  };
  
  if (!wallet.connected) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Create DEX Pool</h3>
        <p className="text-gray-600 mb-4">Connect your wallet to create a DEX pool for this coin.</p>
        <Button variant="primary" disabled>Connect Wallet First</Button>
      </Card>
    );
  }
  
  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Create DEX Pool</h3>
      <p className="text-gray-600 mb-4">
        List your coin on Cetus DEX by providing liquidity. This will make your coin tradable on the DEX.
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="suiAmount" className="block text-sm font-medium text-gray-700 mb-1">
            SUI Amount
          </label>
          <Input
            id="suiAmount"
            type="text"
            value={suiAmount}
            onChange={(e) => setSuiAmount(e.target.value)}
            placeholder="Enter SUI amount (e.g., 1000)"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Amount of SUI to add to the liquidity pool
          </p>
        </div>
        
        <div className="mb-4">
          <label htmlFor="tokenAmount" className="block text-sm font-medium text-gray-700 mb-1">
            {coin.symbol} Amount
          </label>
          <Input
            id="tokenAmount"
            type="text"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            placeholder={`Enter ${coin.symbol} amount`}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Amount of {coin.symbol} tokens to add to the liquidity pool
          </p>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={loading || !suiAmount || !tokenAmount}
        >
          {loading ? 'Creating Pool...' : 'Create DEX Pool'}
        </Button>
      </form>
    </Card>
  );
};

export default DexPoolCreator;
