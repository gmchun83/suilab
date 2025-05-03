import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAllCoins } from '../store/slices/coinsSlice'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import TrendingCoins from '../components/TrendingCoins'
import Leaderboard from '../components/Leaderboard'

const Home: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllCoins() as any)
  }, [dispatch])

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">Launch Your Meme Coin on Sui</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create, trade, and grow your meme coin community with our easy-to-use platform.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/create">
            <Button size="lg" variant="secondary">Create Coin</Button>
          </Link>
          <Link to="/explore">
            <Button size="lg" variant="outline" className="bg-white">Explore Coins</Button>
          </Link>
        </div>
      </section>

      <section>
        <TrendingCoins />
      </section>

      <section className="mt-12">
        <Leaderboard title="Top Coins by Market Cap" limit={5} sortBy="marketCap" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <Card>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Create</h3>
            <p className="text-gray-600">
              Launch your own meme coin in minutes with just a few clicks.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Trade</h3>
            <p className="text-gray-600">
              Buy and sell meme coins with automatic bonding curve pricing.
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="h-12 w-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">Track</h3>
            <p className="text-gray-600">
              Monitor your portfolio and analyze coin performance.
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default Home
