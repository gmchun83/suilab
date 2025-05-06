import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Card from './common/Card'
import { Coin } from '../types'
import { formatSUI } from '../utils/formatting'

// Mock data for leaderboard
const mockLeaderboardCoins: Coin[] = [
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
  },
  {
    id: '4',
    objectId: '0xabc',
    name: 'Sui Moon',
    symbol: 'SMOON',
    description: 'To the moon on Sui blockchain',
    creatorAddress: '0xjkl',
    supply: '10000000000',
    price: 0.0000089,
    marketCap: '89000',
    imageUrl: 'https://cryptologos.cc/logos/safemoon-safemoon-logo.png',
    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    volume24h: '3000',
    priceChange24h: '-12.3'
  },
  {
    id: '5',
    objectId: '0xdef',
    name: 'Sui Floki',
    symbol: 'SFLOKI',
    description: 'Floki-themed meme coin on Sui',
    creatorAddress: '0xmno',
    supply: '5000000000',
    price: 0.0000234,
    marketCap: '117000',
    imageUrl: 'https://cryptologos.cc/logos/floki-inu-floki-logo.png',
    createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    volume24h: '6500',
    priceChange24h: '8.7'
  }
];

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

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Use mock data instead of API call
        let sortedCoins = [...mockLeaderboardCoins]

        // Sort based on the sortBy parameter
        if (sortBy === 'marketCap') {
          sortedCoins.sort((a, b) => {
            const marketCapA = a.marketCap ? Number(a.marketCap) : Number(a.supply) * a.price
            const marketCapB = b.marketCap ? Number(b.marketCap) : Number(b.supply) * b.price
            return marketCapB - marketCapA
          })
        } else if (sortBy === 'price') {
          sortedCoins.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'volume24h') {
          sortedCoins.sort((a, b) => {
            const volumeA = a.volume24h ? parseFloat(a.volume24h) : 0
            const volumeB = b.volume24h ? parseFloat(b.volume24h) : 0
            return volumeB - volumeA
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
  }, [limit, sortBy])

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
                const marketCap = coin.marketCap
                  ? Number(coin.marketCap)
                  : Number(coin.supply) * coin.price

                // Use actual price change data or default to 0
                const change24h = coin.priceChange24h ? parseFloat(coin.priceChange24h) : 0
                const isPositive = change24h > 0

                return (
                  <tr key={coin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/coins/${coin.id}`} className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden">
                          {coin.imageUrl ? (
                            <img src={coin.imageUrl} alt={coin.name} className="h-6 w-6 object-cover" />
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
                      <div className="flex items-center justify-end">
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
