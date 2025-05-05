import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Coin } from '../store/slices/coinsSlice'

interface PortfolioCoin extends Coin {
  balance: string
  value: number
}

const Portfolio: React.FC = () => {
  const navigate = useNavigate()
  const { connected, address } = useSelector((state: RootState) => state.wallet)
  const { coins } = useSelector((state: RootState) => state.coins)

  const [portfolioCoins, setPortfolioCoins] = useState<PortfolioCoin[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (connected && address) {
      loadPortfolio()
    }
  }, [connected, address, coins])

  const loadPortfolio = async () => {
    // This would be implemented with actual blockchain interaction
    // For now, we'll simulate some portfolio data
    setLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create mock portfolio data using some of the available coins
    const mockPortfolio: PortfolioCoin[] = coins
      .slice(0, Math.min(5, coins.length))
      .map(coin => ({
        ...coin,
        balance: (Math.random() * 10000).toFixed(2),
        value: 0
      }))
      .map(coin => ({
        ...coin,
        value: Number(coin.balance) * coin.price
      }))

    setPortfolioCoins(mockPortfolio)
    setLoading(false)
  }

  const totalValue = portfolioCoins.reduce((sum, coin) => sum + coin.value, 0)

  if (!connected) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-6">Your Portfolio</h1>
        <Card className="max-w-md mx-auto">
          <div className="py-8">
            <p className="text-gray-600 mb-6">
              Connect your wallet to view your portfolio
            </p>
            <Button onClick={() => navigate('/wallet')}>Connect Wallet</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Portfolio</h1>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-gray-500">Total Portfolio Value</div>
            <div className="text-3xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          <div className="mt-4 md:mt-0">
            <Link to="/explore">
              <Button>Explore Coins</Button>
            </Link>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="text-center py-8">Loading your portfolio...</div>
      ) : portfolioCoins.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">You don't own any meme coins yet</p>
          <Link to="/explore">
            <Button>Explore Coins to Buy</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolioCoins.map((coin) => (
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
                      <div className="text-gray-900">{Number(coin.balance).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">${coin.price.toFixed(6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-900">${coin.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/coins/${coin.id}`} className="text-primary-600 hover:text-primary-900 mr-4">
                        Details
                      </Link>
                      <button type="button" className="text-primary-600 hover:text-primary-900">
                        Sell
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">
              Note: This is a simulated portfolio for demonstration purposes.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Portfolio
