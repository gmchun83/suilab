import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { setTrending, Coin } from '../store/slices/coinsSlice'
import Card from './common/Card'
import { formatSUI } from '../utils/formatting'

// Mock data for trending coins
const mockTrendingCoins: Coin[] = [
  {
    id: '1',
    objectId: '0x123',
    name: 'Sui Doge',
    symbol: 'SDOGE',
    description: 'The first meme coin on Sui blockchain',
    creatorAddress: '0xabc',
    supply: '1000000000',
    price: 0.000123,
    marketCap: '123000',
    imageUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    volume24h: '5000',
    priceChange24h: '15.5'
  },
  {
    id: '2',
    objectId: '0x456',
    name: 'Sui Cat',
    symbol: 'SCAT',
    description: 'A cat-themed meme coin on Sui',
    creatorAddress: '0xdef',
    supply: '500000000',
    price: 0.000345,
    marketCap: '172500',
    imageUrl: 'https://cryptologos.cc/logos/shiba-inu-shib-logo.png',
    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    volume24h: '8000',
    priceChange24h: '-5.2'
  },
  {
    id: '3',
    objectId: '0x789',
    name: 'Sui Pepe',
    symbol: 'SPEPE',
    description: 'Pepe-themed meme coin on Sui',
    creatorAddress: '0xghi',
    supply: '2000000000',
    price: 0.0000567,
    marketCap: '113400',
    imageUrl: 'https://cryptologos.cc/logos/pepe-pepe-logo.png',
    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    volume24h: '12000',
    priceChange24h: '32.7'
  }
];

const TrendingCoins: React.FC = () => {
  const dispatch = useDispatch()
  const { trending } = useSelector((state: RootState) => state.coins)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call with mock data
    const fetchTrendingCoins = async () => {
      try {
        setLoading(true)
        setError(null)

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Use mock data instead of API call
        dispatch(setTrending(mockTrendingCoins))
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
      <div className="text-center py-8" data-testid="trending-coins-loading">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        <p className="mt-2 text-gray-600">Loading trending coins...</p>
      </div>
    )
  }

  if (error && trending.length === 0) {
    return (
      <div className="text-center py-8 text-red-500" data-testid="trending-coins-error">
        {error}
      </div>
    )
  }

  if (trending.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500" data-testid="trending-coins-empty">
        No trending coins available
      </div>
    )
  }

  return (
    <div className="space-y-4" data-testid="trending-coins-content">
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
  // Use actual price change data or default to 0
  const change24h = coin.priceChange24h ? parseFloat(coin.priceChange24h) : 0
  const isPositive = change24h > 0

  // Format market cap
  const marketCap = coin.marketCap
    ? Number(coin.marketCap).toLocaleString()
    : (Number(coin.supply) * coin.price).toLocaleString()

  // Format volume
  const volume = coin.volume24h
    ? coin.volume24h.toLocaleString()
    : (Number(coin.supply) * coin.price * 0.1).toLocaleString()

  return (
    <Link to={`/coins/${coin.id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
            {coin.imageUrl ? (
              <img src={coin.imageUrl} alt={coin.name} className="h-10 w-10 object-cover" />
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
          <div className="ml-auto text-right">
            <div className="font-bold">${coin.price.toFixed(6)}</div>
            <div className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'} flex items-center justify-end`}>
              {isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {Math.abs(change24h).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Market Cap:</span>
            <span>${marketCap}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Volume 24h:</span>
            <span>${volume}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default TrendingCoins
