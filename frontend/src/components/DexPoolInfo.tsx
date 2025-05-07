import React, { useEffect } from 'react';
import { useDex } from '../hooks';
import { Coin, PoolType } from '../types';
import Card from './common/Card';
import { formatNumber, formatCurrency } from '../utils/formatting';

interface DexPoolInfoProps {
  coin: Coin;
}

const DexPoolInfo: React.FC<DexPoolInfoProps> = ({ coin }) => {
  const { pools, loading, error, getDexPools } = useDex();

  useEffect(() => {
    if (coin.id) {
      getDexPools(coin.id);
    }
  }, [coin.id, getDexPools]);

  if (loading) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">DEX Pools</h3>
        <p className="text-gray-600">Loading pool information...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">DEX Pools</h3>
        <p className="text-red-600">Error loading pool information: {error}</p>
      </Card>
    );
  }

  if (!pools || pools.length === 0) {
    return (
      <Card className="p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">DEX Pools</h3>
        <p className="text-gray-600">No DEX pools found for this coin.</p>
      </Card>
    );
  }

  // Group pools by type
  const bondingPools = pools.filter(pool => pool.type === PoolType.BONDING_CURVE);
  const dexPools = pools.filter(pool => pool.type === PoolType.DEX);

  return (
    <Card className="p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">DEX Pools</h3>

      {bondingPools.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-medium mb-2">Bonding Curve Pool</h4>
          <div className="bg-gray-50 p-3 rounded">
            {bondingPools.map(pool => (
              <div key={pool.id} className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">SUI Balance:</div>
                <div className="font-medium">{formatNumber(pool.suiBalance)} SUI</div>

                <div className="text-gray-600">Token Balance:</div>
                <div className="font-medium">{formatNumber(pool.tokenBalance)} {coin.symbol}</div>

                <div className="text-gray-600">Creator:</div>
                <div className="font-medium truncate">{pool.creatorAddress}</div>

                <div className="text-gray-600">Created:</div>
                <div className="font-medium">{new Date(pool.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dexPools.length > 0 && (
        <div>
          <h4 className="text-md font-medium mb-2">Cetus DEX Pools</h4>
          <div className="bg-gray-50 p-3 rounded">
            {dexPools.map(pool => (
              <div key={pool.id} className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-600">SUI Balance:</div>
                <div className="font-medium">{formatNumber(pool.suiBalance)} SUI</div>

                <div className="text-gray-600">Token Balance:</div>
                <div className="font-medium">{formatNumber(pool.tokenBalance)} {coin.symbol}</div>

                <div className="text-gray-600">Creator:</div>
                <div className="font-medium truncate">{pool.creatorAddress}</div>

                <div className="text-gray-600">Created:</div>
                <div className="font-medium">{new Date(pool.createdAt).toLocaleDateString()}</div>

                <div className="text-gray-600">Pool ID:</div>
                <div className="font-medium truncate">{pool.objectId}</div>

                <div className="col-span-2 mt-2">
                  <a
                    href={`https://cetus.zone/pool/${pool.objectId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View on Cetus DEX →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default DexPoolInfo;
