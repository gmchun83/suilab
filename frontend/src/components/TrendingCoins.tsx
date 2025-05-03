import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setTrending, Coin } from '../store/slices/coinsSlice'
import Card from './common/Card'
import api from '../utils/api'

const TrendingCoins: React.FC = () => {
  const dispatch = useDispatch()
  const { trending } = useSelector((state: RootState) => state.coins)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await api.get('/coins/trending')
        dispatch(setTrending(response.data))
      } catch (err) {
        setError('Failed to load trending coins')
        console.error('Error fetching trending coins:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrendingCoins()
    
    // Refresh trending coins every 5 minutes
    const intervalId = setInterval(fetchTrendingCoins, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
  }, [dispatch])
  
  if (loading && trending.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        <p className="mt-2 text-gray-600">Loading trending coins...</p>
      </div>
    )
  }
  
  if (error && trending.length === 0) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Trending Coins</h2>
        <Link to="/explore" className="text-primary-600 hover:text-primary-700">
          View All
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trending.map((coin) => (
          <CoinCard key={coin.id} coin={coin} />
        ))}
      </div>
    </div>
  )
}

interface CoinCardProps {
  coin: Coin
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  // Calculate 24h change (mock data for now)
  const change24h = Math.random() * 30 - 10 // Random value between -10% and +20%
  const isPositive = change24h > 0
  
  return (
    <Link to={`/coins/${coin.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            {coin.imageUrl ? (
              <img src={coin.imageUrl} alt={coin.name} className="h-10 w-10 rounded-full" />
            ) : (
              <span className="text-primary-800 font-bold text-lg">
                {coin.symbol.substring(0, 2)}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold">{coin.name}</h3>
            <div className="text-sm text-gray-500">{coin.symbol}</div>
          </div>
          <div className="ml-auto">
            <div className="font-bold">${coin.price.toFixed(6)}</div>
            <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Market Cap:</span>
            <span>${(Number(coin.supply) * coin.price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Volume 24h:</span>
            <span>${(Number(coin.supply) * coin.price * 0.1).toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default TrendingCoins
