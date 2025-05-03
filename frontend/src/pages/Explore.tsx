import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RootState } from '../store'
import { fetchAllCoins, Coin } from '../store/slices/coinsSlice'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const Explore: React.FC = () => {
  const dispatch = useDispatch()
  const { coins, loading, error } = useSelector((state: RootState) => state.coins)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'createdAt'>('price')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  
  useEffect(() => {
    dispatch(fetchAllCoins() as any)
  }, [dispatch])
  
  // Filter and sort coins
  const filteredCoins = coins.filter((coin) => {
    const term = searchTerm.toLowerCase()
    return (
      coin.name.toLowerCase().includes(term) ||
      coin.symbol.toLowerCase().includes(term) ||
      coin.description?.toLowerCase().includes(term)
    )
  })
  
  const sortedCoins = [...filteredCoins].sort((a, b) => {
    if (sortBy === 'price') {
      return sortDirection === 'asc' ? a.price - b.price : b.price - a.price
    } else if (sortBy === 'name') {
      return sortDirection === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    } else {
      // createdAt
      return sortDirection === 'asc'
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })
  
  const toggleSort = (field: 'price' | 'name' | 'createdAt') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('desc')
    }
  }
  
  const renderSortIcon = (field: 'price' | 'name' | 'createdAt') => {
    if (sortBy !== field) return null
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Explore Meme Coins</h1>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="w-full md:w-1/2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, symbol, or description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={sortBy === 'price' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleSort('price')}
          >
            Price{renderSortIcon('price')}
          </Button>
          <Button
            variant={sortBy === 'name' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleSort('name')}
          >
            Name{renderSortIcon('name')}
          </Button>
          <Button
            variant={sortBy === 'createdAt' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleSort('createdAt')}
          >
            Newest{renderSortIcon('createdAt')}
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading coins...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : sortedCoins.length === 0 ? (
        <div className="text-center py-8">
          {searchTerm ? (
            <div>
              <p className="text-gray-500 mb-4">No coins found matching "{searchTerm}"</p>
              <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">No coins available yet</p>
              <Link to="/create">
                <Button>Create the First Coin</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCoins.map((coin) => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </div>
  )
}

interface CoinCardProps {
  coin: Coin
}

const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
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
            <div className="text-sm text-green-500">+12.5%</div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Market Cap:</span>
            <span>${(Number(coin.supply) * coin.price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Created:</span>
            <span>{new Date(coin.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default Explore
