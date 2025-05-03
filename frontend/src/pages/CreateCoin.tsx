import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { createCoin } from '../utils/suiClient'

const CreateCoin: React.FC = () => {
  const navigate = useNavigate()
  const { connected } = useSelector((state: RootState) => state.wallet)
  
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [initialSupply, setInitialSupply] = useState('1000000')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!connected) {
      setError('Please connect your wallet first')
      return
    }
    
    if (!name || !symbol) {
      setError('Name and symbol are required')
      return
    }
    
    try {
      setLoading(true)
      setError(null)
      
      const result = await createCoin({ name, symbol })
      
      // Navigate to the new coin's page
      navigate(`/coins/${result.id}`)
    } catch (err) {
      setError((err as Error).message || 'Failed to create coin')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Meme Coin</h1>
      
      <Card>
        {!connected ? (
          <div className="text-center py-6">
            <p className="mb-4 text-gray-600">Connect your wallet to create a meme coin</p>
            <Button>Connect Wallet</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Coin Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Doge Coin"
                required
              />
            </div>
            
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. DOGE"
                maxLength={10}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Max 10 characters, uppercase letters
              </p>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your meme coin"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="initialSupply" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Supply
              </label>
              <input
                type="number"
                id="initialSupply"
                value={initialSupply}
                onChange={(e) => setInitialSupply(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                min="1"
                required
              />
            </div>
            
            <div className="pt-4">
              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Meme Coin'}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default CreateCoin
