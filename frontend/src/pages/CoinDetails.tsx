import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchCoinDetails } from '../store/slices/coinsSlice'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { fetchTransactions } from '../utils/api'
import { Transaction } from '../types'

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { selectedCoin, loading, error } = useSelector((state: RootState) => state.coins)
  const { connected } = useSelector((state: RootState) => state.wallet)
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  
  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id) as any)
      loadTransactions(id)
    }
  }, [dispatch, id])
  
  const loadTransactions = async (coinId: string) => {
    try {
      setTransactionsLoading(true)
      const data = await fetchTransactions(coinId)
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Failed to load transactions:', error)
    } finally {
      setTransactionsLoading(false)
    }
  }
  
  const handleBuy = () => {
    // This would be implemented with actual blockchain interaction
    console.log(`Buying ${amount} of ${selectedCoin?.symbol}`)
    setBuyModalOpen(false)
    setAmount('')
  }
  
  const handleSell = () => {
    // This would be implemented with actual blockchain interaction
    console.log(`Selling ${amount} of ${selectedCoin?.symbol}`)
    setSellModalOpen(false)
    setAmount('')
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading coin details...</div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <Link to="/explore">
          <Button variant="secondary">Back to Explore</Button>
        </Link>
      </div>
    )
  }
  
  if (!selectedCoin) {
    return (
      <div className="text-center py-8">
        <div className="text-lg mb-4">Coin not found</div>
        <Link to="/explore">
          <Button variant="secondary">Back to Explore</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
            {selectedCoin.imageUrl ? (
              <img src={selectedCoin.imageUrl} alt={selectedCoin.name} className="h-14 w-14 rounded-full" />
            ) : (
              <span className="text-primary-800 font-bold text-2xl">
                {selectedCoin.symbol.substring(0, 2)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{selectedCoin.name}</h1>
            <div className="text-gray-500">{selectedCoin.symbol}</div>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex space-x-4">
          <Button
            onClick={() => setBuyModalOpen(true)}
            disabled={!connected}
          >
            Buy
          </Button>
          <Button
            variant="secondary"
            onClick={() => setSellModalOpen(true)}
            disabled={!connected}
          >
            Sell
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Price</div>
            <div className="text-2xl font-bold">${selectedCoin.price.toFixed(6)}</div>
            <div className="text-green-500">+12.5%</div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Market Cap</div>
            <div className="text-2xl font-bold">
              ${(Number(selectedCoin.supply) * selectedCoin.price).toLocaleString()}
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Supply</div>
            <div className="text-2xl font-bold">
              {Number(selectedCoin.supply).toLocaleString()} {selectedCoin.symbol}
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h2 className="text-xl font-bold mb-4">About {selectedCoin.name}</h2>
        <p className="text-gray-700">
          {selectedCoin.description || `${selectedCoin.name} is a meme coin on the Sui blockchain.`}
        </p>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-gray-500">Creator</div>
              <div className="font-mono">{selectedCoin.creatorAddress.substring(0, 10)}...{selectedCoin.creatorAddress.substring(selectedCoin.creatorAddress.length - 4)}</div>
            </div>
            <div>
              <div className="text-gray-500">Created</div>
              <div>{new Date(selectedCoin.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        {transactionsLoading ? (
          <div className="text-center py-4">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No transactions yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        tx.type === 'BUY' ? 'bg-green-100 text-green-800' :
                        tx.type === 'SELL' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Number(tx.amount).toLocaleString()} {selectedCoin.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${tx.price.toFixed(6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {tx.walletAddress.substring(0, 6)}...{tx.walletAddress.substring(tx.walletAddress.length - 4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      
      {/* Buy Modal */}
      <Modal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        title={`Buy ${selectedCoin.symbol}`}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="buyAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Buy
            </label>
            <input
              type="number"
              id="buyAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder={`Enter ${selectedCoin.symbol} amount`}
              min="0"
            />
          </div>
          
          {amount && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Price per coin:</span>
                <span>${selectedCoin.price.toFixed(6)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total cost:</span>
                <span>${(Number(amount) * selectedCoin.price).toFixed(6)} SUI</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setBuyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={!amount || Number(amount) <= 0}
            >
              Buy {selectedCoin.symbol}
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Sell Modal */}
      <Modal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        title={`Sell ${selectedCoin.symbol}`}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="sellAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount to Sell
            </label>
            <input
              type="number"
              id="sellAmount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder={`Enter ${selectedCoin.symbol} amount`}
              min="0"
            />
          </div>
          
          {amount && (
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span>Price per coin:</span>
                <span>${selectedCoin.price.toFixed(6)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Total receive:</span>
                <span>${(Number(amount) * selectedCoin.price).toFixed(6)} SUI</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setSellModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSell}
              disabled={!amount || Number(amount) <= 0}
            >
              Sell {selectedCoin.symbol}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CoinDetails
