import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchAllCoins } from '../store/slices/coinsSlice'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import TrendingCoins from '../components/TrendingCoins'
import Leaderboard from '../components/Leaderboard'
import { RootState } from '../store'
import useWallet from '../hooks/useWallet'

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const { connected } = useWallet()
  const { loading: coinsLoading, error: coinsError } = useSelector((state: RootState) => state.coins)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    // Fetch data when component mounts
    const fetchData = async () => {
      try {
        await dispatch(fetchAllCoins() as any)
      } catch (error) {
        console.error('Error fetching home page data:', error)
      } finally {
        setPageLoading(false)
      }
    }

    fetchData()
  }, [dispatch])

  // Function to refresh data
  const handleRefresh = () => {
    dispatch(fetchAllCoins() as any)
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg text-white">
        <h1 className="text-4xl font-bold mb-4">Launch Your Meme Coin on Sui</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Create, trade, and grow your meme coin community with our easy-to-use platform.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to={connected ? "/create" : "/wallet"}>
            <Button size="lg" variant="secondary">
              {connected ? "Create Coin" : "Connect Wallet"}
            </Button>
          </Link>
          <Link to="/explore">
            <Button size="lg" variant="outline" className="bg-white">Explore Coins</Button>
          </Link>
        </div>
      </section>

      {/* Refresh button */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={handleRefresh}
          className="text-primary-600 hover:text-primary-800 flex items-center"
          aria-label="Refresh data"
          disabled={coinsLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${coinsLoading ? 'animate-spin' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          {coinsLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

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

      {/* CTA Section */}
      <section className="bg-gray-100 rounded-xl p-8 text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Ready to launch your meme coin?</h2>
        <p className="text-lg mb-6">
          Join the growing community of creators on PumpSui.
        </p>
        <Link to={connected ? "/create" : "/wallet"}>
          <Button size="lg">
            {connected ? "Create Your Coin" : "Connect Wallet"}
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default Home
