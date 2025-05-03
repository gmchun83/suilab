import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../store'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Coin } from '../store/slices/coinsSlice'

interface CreatorCoin extends Coin {
  holders: number
  volume24h: number
}

const CreatorDashboard: React.FC = () => {
  const { connected, address } = useSelector((state: RootState) => state.wallet)
  const { coins } = useSelector((state: RootState) => state.coins)
  
  const [createdCoins, setCreatedCoins] = useState<CreatorCoin[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalCoins: 0,
    totalHolders: 0,
    totalVolume: 0,
    totalValue: 0,
  })
  
  useEffect(() => {
    if (connected && address) {
      loadCreatorCoins()
    }
  }, [connected, address, coins])
  
  const loadCreatorCoins = async () => {
    // This would be implemented with actual blockchain interaction
    // For now, we'll simulate some creator data
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Create mock creator coins data using some of the available coins
    const mockCreatorCoins: CreatorCoin[] = coins
      .slice(0, Math.min(3, coins.length))
      .map(coin => ({
        ...coin,
        holders: Math.floor(Math.random() * 1000) + 10,
        volume24h: Math.random() * 10000,
      }))
    
    setCreatedCoins(mockCreatorCoins)
    
    // Calculate stats
    const totalCoins = mockCreatorCoins.length
    const totalHolders = mockCreatorCoins.reduce((sum, coin) => sum + coin.holders, 0)
    const totalVolume = mockCreatorCoins.reduce((sum, coin) => sum + coin.volume24h, 0)
    const totalValue = mockCreatorCoins.reduce(
      (sum, coin) => sum + (Number(coin.supply) * coin.price),
      0
    )
    
    setStats({
      totalCoins,
      totalHolders,
      totalVolume,
      totalValue,
    })
    
    setLoading(false)
  }
  
  if (!connected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Creator Dashboard</h1>
        <Card className="max-w-md mx-auto">
          <div className="py-8">
            <p className="text-gray-600 mb-6">
              Connect your wallet to view your creator dashboard
            </p>
            <Button>Connect Wallet</Button>
          </div>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        
        <div className="mt-4 md:mt-0">
          <Link to="/create">
            <Button>Create New Coin</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Total Coins Created</div>
            <div className="text-2xl font-bold">{stats.totalCoins}</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Total Holders</div>
            <div className="text-2xl font-bold">{stats.totalHolders.toLocaleString()}</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">24h Volume</div>
            <div className="text-2xl font-bold">${stats.totalVolume.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Total Market Cap</div>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
          </div>
        </Card>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading your created coins...</div>
      ) : createdCoins.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You haven't created any meme coins yet</p>
          <Link to="/create">
            <Button>Create Your First Coin</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Your Created Coins</h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holders</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Volume</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {createdCoins.map((coin) => (
                  <tr key={coin.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          {coin.imageUrl ? (
                            <img src={coin.imageUrl} alt={coin.name} className="h-8 w-8 rounded-full" />
                          ) : (
                            <span className="text-primary-800 font-bold">
                              {coin.symbol.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{coin.name}</div>
                          <div className="text-gray-500">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">${coin.price.toFixed(6)}</div>
                      <div className="text-sm text-green-500">+12.5%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">
                        ${(Number(coin.supply) * coin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">{coin.holders.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">${coin.volume24h.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/coins/${coin.id}`} className="text-primary-600 hover:text-primary-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">
              Note: This is a simulated dashboard for demonstration purposes.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreatorDashboard
