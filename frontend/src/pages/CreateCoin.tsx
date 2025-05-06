import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { createCoin } from '../utils/suiClient'
import { CoinCreationParams } from '../types'
import useWallet from '../hooks/useWallet'
import { formatSUI } from '../utils/formatting'

const CreateCoin: React.FC = () => {
  const navigate = useNavigate()
  const { connected, address, balance } = useWallet()

  // Redirect to wallet page if not connected
  useEffect(() => {
    if (!connected) {
      const timer = setTimeout(() => {
        navigate('/wallet')
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [connected, navigate])

  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [description, setDescription] = useState('')
  const [initialSupply, setInitialSupply] = useState('1000000')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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

    if (name.length > 50) {
      setError('Name must be less than 50 characters')
      return
    }

    if (symbol.length > 10) {
      setError('Symbol must be less than 10 characters')
      return
    }

    if (initialSupply === '0' || !initialSupply) {
      setError('Initial supply must be greater than 0')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccessMessage(null)

      // Create the coin creation parameters
      const coinParams: CoinCreationParams = {
        name,
        symbol,
        description,
        initialSupply,
        imageUrl: imageUrl || undefined
      }

      // Call the createCoin function
      const result = await createCoin(coinParams)

      setSuccessMessage(`Successfully created ${name} (${symbol})! Redirecting to coin page...`)

      // Wait a moment before navigating to show the success message
      setTimeout(() => {
        // Navigate to the new coin's page
        navigate(`/coins/${result.id}`)
      }, 2000)
    } catch (err) {
      console.error('Error creating coin:', err)
      setError((err as Error).message || 'Failed to create coin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Meme Coin</h1>

      {connected && address && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">Wallet Connected</h2>
              <p className="text-sm text-gray-500">{address}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span className="text-sm text-gray-500">Balance: </span>
              <span className="font-medium">{formatSUI(balance || '0')} SUI</span>
            </div>
          </div>
        </div>
      )}

      <Card>
        {!connected ? (
          <div className="text-center py-6">
            <p className="mb-4 text-gray-600">Connect your wallet to create a meme coin</p>
            <Button onClick={() => navigate('/wallet')}>Connect Wallet</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md">
                {successMessage}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Coin Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g. Doge Coin"
                maxLength={50}
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                Max 50 characters
              </p>
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-1">
                Symbol <span className="text-red-500">*</span>
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
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">
                Max 500 characters
              </p>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/image.png"
              />
              <p className="mt-1 text-sm text-gray-500">
                URL to your coin's logo image (recommended size: 256x256px)
              </p>
            </div>

            <div>
              <label htmlFor="initialSupply" className="block text-sm font-medium text-gray-700 mb-1">
                Initial Supply <span className="text-red-500">*</span>
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
              <p className="mt-1 text-sm text-gray-500">
                The total number of tokens that will be created initially
              </p>
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

            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Transaction Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estimated Gas Fee:</span>
                <span className="font-medium">~0.001 SUI</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Your Balance:</span>
                <span className="font-medium">{formatSUI(balance || '0')} SUI</span>
              </div>
              {Number(balance || 0) < 1000000 && (
                <div className="mt-2 text-xs text-amber-600">
                  <p>Your balance may be too low to cover the transaction fee. Consider adding more SUI to your wallet.</p>
                </div>
              )}
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

export default CreateCoin
