import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Card from './common/Card'
import api from '../utils/api'
import { Coin } from '../types'

interface LeaderboardProps {
  title?: string
  limit?: number
  sortBy?: 'marketCap' | 'price' | 'volume24h'
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  title = 'Top Coins by Market Cap', 
  limit = 5,
  sortBy = 'marketCap'
}) => {
  const dispatch = useDispatch()
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchLeaderboardCoins = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Construct query parameters
        const params = new URLSearchParams({
          limit: limit.toString(),
          sort: sortBy === 'marketCap' ? 'price' : sortBy, // We'll calculate market cap client-side
          order: 'desc'
        })
        
        const response = await api.get(`/coins?${params.toString()}`)
        
        // Sort by market cap if needed (price * supply)
        let sortedCoins = response.data
        if (sortBy === 'marketCap') {
          sortedCoins = response.data.sort((a: Coin, b: Coin) => {
            const marketCapA = Number(a.supply) * a.price
            const marketCapB = Number(b.supply) * b.price
            return marketCapB - marketCapA
          })
        }
        
        setCoins(sortedCoins.slice(0, limit))
      } catch (err) {
        setError('Failed to load leaderboard data')
        console.error('Error fetching leaderboard coins:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLeaderboardCoins()
    
    // Refresh leaderboard data every 5 minutes
    const intervalId = setInterval(fetchLeaderboardCoins, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [dispatch, limit, sortBy])
  
  if (loading && coins.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        <p className="mt-2 text-gray-600">Loading leaderboard data...</p>
      </div>
    )
  }
  
  if (error && coins.length === 0) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link to="/explore" className="text-primary-600 hover:text-primary-700">
          View All
        </Link>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {coins.map((coin, index) => {
                // Calculate market cap
                const marketCap = Number(coin.supply) * coin.price
                
                // Generate random 24h change for demo purposes
                // In a real app, this would come from the API
                const change24h = Math.random() * 30 - 10 // Random value between -10% and +20%
                const isPositive = change24h > 0
                
                return (
                  <tr key={coin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/coins/${coin.id}`} className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          {coin.imageUrl ? (
                            <img src={coin.imageUrl} alt={coin.name} className="h-6 w-6 rounded-full" />
                          ) : (
                            <span className="text-primary-800 font-bold text-xs">
                              {coin.symbol.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium text-gray-900">{coin.name}</div>
                          <div className="text-gray-500 text-xs">{coin.symbol}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${coin.price.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                      isPositive ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {isPositive ? '+' : ''}{change24h.toFixed(2)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default Leaderboard
