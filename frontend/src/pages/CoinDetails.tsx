import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { fetchCoinDetails } from '../store/slices/coinsSlice'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import PriceChart from '../components/PriceChart'
import TransactionHistory from '../components/TransactionHistory'
import DexPoolInfo from '../components/DexPoolInfo'
import DexPoolCreator from '../components/DexPoolCreator'
import MarketCapInfo from '../components/MarketCapInfo'
import { Transaction } from '../types'
import { buyCoin, sellCoin } from '../utils/suiClient'
import { fetchTransactions } from '../utils/api'
import { useToast } from '../components/common/ToastProvider'
import { getUserFriendlyErrorMessage } from '../utils/errorHandler'
import { useDex } from '../hooks'

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { selectedCoin, loading, error } = useSelector((state: RootState) => state.coins)
  const { connected, address } = useSelector((state: RootState) => state.wallet)
  const { showToast } = useToast()
  const { loadData } = useDex(id)

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [buyModalOpen, setBuyModalOpen] = useState(false)
  const [sellModalOpen, setSellModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transactionError, setTransactionError] = useState<string | null>(null)
  const [transactionSuccess, setTransactionSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      dispatch(fetchCoinDetails(id) as any)
      loadTransactions(id)
      loadData() // Load DEX data
    }
  }, [dispatch, id, loadData])

  // Show error toast if there's an error from Redux
  useEffect(() => {
    if (error) {
      showToast(getUserFriendlyErrorMessage(error), 'error')
    }
  }, [error, showToast])

  // Load transactions for this coin
  const loadTransactions = async (coinId: string) => {
    try {
      setTransactionsLoading(true)
      const data = await fetchTransactions(coinId)
      setTransactions(data.transactions || [])
    } catch (error) {
      console.error('Failed to load transactions:', error)
      showToast(getUserFriendlyErrorMessage(error), 'error')
    } finally {
      setTransactionsLoading(false)
    }
  }

  // Calculate estimated cost/receive amount based on current price
  const calculateTotal = () => {
    if (!selectedCoin || !amount || isNaN(Number(amount))) return 0;
    return Number(amount) * selectedCoin.price;
  }

  // Handle buying coins
  const handleBuy = async () => {
    if (!id || !amount || Number(amount) <= 0) return;

    setTransactionLoading(true);
    setTransactionError(null);
    setTransactionSuccess(null);

    try {
      // Convert amount to SUI amount (price * amount)
      const suiAmount = calculateTotal().toString();

      // Call the buyCoin function
      const result = await buyCoin(id, suiAmount);

      if (result.success) {
        const successMessage = `Successfully purchased ${amount} ${selectedCoin?.symbol}!`;
        setTransactionSuccess(successMessage);
        showToast(successMessage, 'success');

        // Refresh coin details and transactions
        dispatch(fetchCoinDetails(id) as any);
        loadTransactions(id);

        // Close modal after a delay
        setTimeout(() => {
          setBuyModalOpen(false);
          setAmount('');
          setTransactionSuccess(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Error buying coin:', err);
      const errorMessage = getUserFriendlyErrorMessage(err);
      setTransactionError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setTransactionLoading(false);
    }
  }

  // Handle selling coins
  const handleSell = async () => {
    if (!id || !amount || Number(amount) <= 0) return;

    setTransactionLoading(true);
    setTransactionError(null);
    setTransactionSuccess(null);

    try {
      // Call the sellCoin function
      const result = await sellCoin(id, amount);

      if (result.success) {
        const successMessage = `Successfully sold ${amount} ${selectedCoin?.symbol}!`;
        setTransactionSuccess(successMessage);
        showToast(successMessage, 'success');

        // Refresh coin details and transactions
        dispatch(fetchCoinDetails(id) as any);
        loadTransactions(id);

        // Close modal after a delay
        setTimeout(() => {
          setSellModalOpen(false);
          setAmount('');
          setTransactionSuccess(null);
        }, 2000);
      }
    } catch (err) {
      console.error('Error selling coin:', err);
      const errorMessage = getUserFriendlyErrorMessage(err);
      setTransactionError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setTransactionLoading(false);
    }
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
            <div className="text-gray-500 mb-1">Supply</div>
            <div className="text-2xl font-bold">
              {Number(selectedCoin.supply).toLocaleString()} {selectedCoin.symbol}
            </div>
            {selectedCoin.burnedSupply && (
              <div className="text-gray-500 text-sm">
                {Number(selectedCoin.burnedSupply).toLocaleString()} burned
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-gray-500 mb-1">Holders</div>
            <div className="text-2xl font-bold">
              {selectedCoin.holders?.toLocaleString() || 'N/A'}
            </div>
          </div>
        </Card>
      </div>

      {/* Market Cap Info */}
      <MarketCapInfo coin={selectedCoin} />

      {/* Price Chart */}
      <PriceChart coinId={selectedCoin.id} coinSymbol={selectedCoin.symbol} />

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

      {/* DEX Pool Info */}
      <DexPoolInfo coin={selectedCoin} />

      {/* DEX Pool Creator - Only show if user is connected and is the coin creator */}
      {connected && address === selectedCoin.creatorAddress && !selectedCoin.dexListed && (
        <DexPoolCreator
          coin={selectedCoin}
          onSuccess={() => {
            // Refresh coin details and DEX data
            dispatch(fetchCoinDetails(id) as any)
            loadData()
            showToast('DEX pool created successfully!', 'success')
          }}
        />
      )}

      {/* Transaction History */}
      <TransactionHistory coinId={selectedCoin.id} coinSymbol={selectedCoin.symbol} />

      {/* Buy Modal */}
      <Modal
        isOpen={buyModalOpen}
        onClose={() => !transactionLoading && setBuyModalOpen(false)}
        title={`Buy ${selectedCoin.symbol}`}
      >
        <div className="space-y-4">
          {transactionError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              {transactionError}
            </div>
          )}

          {transactionSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              {transactionSuccess}
            </div>
          )}

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
              disabled={transactionLoading}
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
                <span>${calculateTotal().toFixed(6)} SUI</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Note: Actual cost may vary slightly due to price fluctuations and gas fees
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setBuyModalOpen(false)}
              disabled={transactionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleBuy}
              disabled={!amount || Number(amount) <= 0 || transactionLoading}
            >
              {transactionLoading ? 'Processing...' : `Buy ${selectedCoin.symbol}`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sell Modal */}
      <Modal
        isOpen={sellModalOpen}
        onClose={() => !transactionLoading && setSellModalOpen(false)}
        title={`Sell ${selectedCoin.symbol}`}
      >
        <div className="space-y-4">
          {transactionError && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md">
              {transactionError}
            </div>
          )}

          {transactionSuccess && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md">
              {transactionSuccess}
            </div>
          )}

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
              disabled={transactionLoading}
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
                <span>${calculateTotal().toFixed(6)} SUI</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Note: Actual amount received may vary slightly due to price fluctuations and gas fees
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setSellModalOpen(false)}
              disabled={transactionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSell}
              disabled={!amount || Number(amount) <= 0 || transactionLoading}
            >
              {transactionLoading ? 'Processing...' : `Sell ${selectedCoin.symbol}`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CoinDetails
