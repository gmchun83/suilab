import React, { useState, useEffect } from 'react'
import Card from './common/Card'
import Button from './common/Button'
import Modal from './common/Modal'
import { Transaction } from '../types'
import { fetchTransactions } from '../utils/api'

interface TransactionHistoryProps {
  coinId: string
  coinSymbol: string
}

type TransactionType = 'ALL' | 'BUY' | 'SELL'
type SortField = 'timestamp' | 'amount' | 'price'
type SortDirection = 'asc' | 'desc'

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ coinId, coinSymbol }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filtering and sorting state
  const [typeFilter, setTypeFilter] = useState<TransactionType>('ALL')
  const [sortField, setSortField] = useState<SortField>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  
  useEffect(() => {
    loadTransactions()
  }, [coinId])
  
  useEffect(() => {
    // Apply filters and sorting whenever the transactions or filter settings change
    applyFiltersAndSort()
  }, [transactions, typeFilter, sortField, sortDirection, searchQuery])
  
  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTransactions(coinId)
      setTransactions(data.transactions)
    } catch (error) {
      console.error('Failed to load transactions:', error)
      setError('Failed to load transaction history')
    } finally {
      setLoading(false)
    }
  }
  
  const applyFiltersAndSort = () => {
    let result = [...transactions]
    
    // Apply type filter
    if (typeFilter !== 'ALL') {
      result = result.filter(tx => tx.type === typeFilter)
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(tx => 
        tx.walletAddress.toLowerCase().includes(query) ||
        tx.id.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      switch (sortField) {
        case 'timestamp':
          comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          break
        case 'amount':
          comparison = Number(a.amount) - Number(b.amount)
          break
        case 'price':
          comparison = a.price - b.price
          break
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    setFilteredTransactions(result)
  }
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Default to descending for new sort field
      setSortField(field)
      setSortDirection('desc')
    }
  }
  
  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setIsModalOpen(true)
  }
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    )
  }
  
  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-bold mb-2 sm:mb-0">Transaction History</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex space-x-1">
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded-md ${
                typeFilter === 'ALL'
                  ? 'bg-primary-100 text-primary-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setTypeFilter('ALL')}
            >
              All
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded-md ${
                typeFilter === 'BUY'
                  ? 'bg-green-100 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setTypeFilter('BUY')}
            >
              Buy
            </button>
            <button
              type="button"
              className={`px-3 py-1 text-sm rounded-md ${
                typeFilter === 'SELL'
                  ? 'bg-red-100 text-red-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setTypeFilter('SELL')}
            >
              Sell
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchQuery('')}
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading transactions...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-500">{error}</div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-2"
            onClick={loadTransactions}
          >
            Retry
          </Button>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {transactions.length === 0
            ? 'No transactions yet'
            : 'No transactions match your filters'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('timestamp')}
                >
                  <div className="flex items-center">
                    Time {getSortIcon('timestamp')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center">
                    Amount {getSortIcon('amount')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price {getSortIcon('price')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wallet
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.timestamp).toLocaleString()}
                  </td>
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
                    {Number(tx.amount).toLocaleString()} {coinSymbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${tx.price.toFixed(6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                    {tx.walletAddress.substring(0, 6)}...{tx.walletAddress.substring(tx.walletAddress.length - 4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-900"
                      onClick={() => handleViewDetails(tx)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Transaction Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Transaction ID</div>
                <div className="font-mono break-all">{selectedTransaction.id}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Type</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedTransaction.type === 'BUY' ? 'bg-green-100 text-green-800' :
                  selectedTransaction.type === 'SELL' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedTransaction.type}
                </span>
              </div>
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div>{Number(selectedTransaction.amount).toLocaleString()} {coinSymbol}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Price</div>
                <div>${selectedTransaction.price.toFixed(6)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Value</div>
                <div>${(Number(selectedTransaction.amount) * selectedTransaction.price).toFixed(6)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Time</div>
                <div>{new Date(selectedTransaction.timestamp).toLocaleString()}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-500">Wallet Address</div>
                <div className="font-mono break-all">{selectedTransaction.walletAddress}</div>
              </div>
              <div className="col-span-2">
                <div className="text-sm text-gray-500">Transaction Hash</div>
                <div className="font-mono break-all">{selectedTransaction.hash || 'N/A'}</div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default TransactionHistory
