import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { 
  connectWalletStart, 
  connectWalletSuccess, 
  connectWalletFailure, 
  disconnectWallet 
} from '../store/slices/walletSlice'
import { connectWallet } from '../utils/suiClient'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

interface WalletOption {
  id: string
  name: string
  icon: string
  description: string
  available: boolean
}

const WalletConnection: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { connected, address, loading, error } = useSelector((state: RootState) => state.wallet)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  
  // Mock wallet options - in a real app, these would be detected from the browser
  const walletOptions: WalletOption[] = [
    {
      id: 'sui-wallet',
      name: 'Sui Wallet',
      icon: 'https://assets.website-files.com/61a9a8412ca7053e3ff6f2ef/6434d419cfb6b4a058d4cb2c_sui-favicon.svg',
      description: 'The official wallet for the Sui blockchain',
      available: true
    },
    {
      id: 'ethos-wallet',
      name: 'Ethos Wallet',
      icon: 'https://ethoswallet.xyz/assets/images/ethos-logo.svg',
      description: 'A user-friendly wallet for Sui',
      available: true
    },
    {
      id: 'suiet-wallet',
      name: 'Suiet Wallet',
      icon: 'https://suiet.app/favicon.ico',
      description: 'A comprehensive wallet for Sui ecosystem',
      available: true
    },
    {
      id: 'martian-wallet',
      name: 'Martian Wallet',
      icon: 'https://martianwallet.xyz/assets/images/martian.png',
      description: 'Multi-chain wallet with Sui support',
      available: false
    }
  ]
  
  const handleSelectWallet = (walletId: string) => {
    setSelectedWallet(walletId)
  }
  
  const handleConnect = async () => {
    if (!selectedWallet) {
      return
    }
    
    try {
      dispatch(connectWalletStart())
      const walletData = await connectWallet()
      dispatch(connectWalletSuccess(walletData))
      
      // Redirect to home page after successful connection
      navigate('/')
    } catch (err) {
      dispatch(connectWalletFailure((err as Error).message))
    }
  }
  
  const handleDisconnect = () => {
    dispatch(disconnectWallet())
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Connect Your Wallet</h1>
      
      <Card>
        {connected ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Wallet Connected</h2>
            <p className="text-gray-700 mb-2">
              Your wallet is connected to PumpSui.
            </p>
            <div className="bg-gray-100 rounded-md p-3 mb-6 inline-block">
              <code className="text-gray-800 font-mono">
                {address}
              </code>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Disconnect Wallet
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-6">
              Connect your wallet to create, buy, and sell meme coins on the Sui blockchain.
            </p>
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-medium">Select a Wallet</h2>
              {walletOptions.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedWallet === wallet.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${!wallet.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => wallet.available && handleSelectWallet(wallet.id)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img src={wallet.icon} alt={wallet.name} className="h-10 w-10" />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="font-medium">{wallet.name}</h3>
                      <p className="text-sm text-gray-500">{wallet.description}</p>
                    </div>
                    {!wallet.available && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                    {selectedWallet === wallet.id && (
                      <svg className="h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConnect}
                disabled={!selectedWallet || loading}
                className="w-full sm:w-auto"
              >
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold mb-4">New to Sui Blockchain?</h2>
        <p className="text-gray-700 mb-4">
          You'll need a Sui-compatible wallet to use PumpSui. Here's how to get started:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold">1</span>
            </div>
            <h3 className="font-bold mb-1">Install a Wallet</h3>
            <p className="text-sm text-gray-600">
              Download and install a Sui-compatible wallet from your browser's extension store.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold">2</span>
            </div>
            <h3 className="font-bold mb-1">Create an Account</h3>
            <p className="text-sm text-gray-600">
              Set up your wallet by creating a new account and securely storing your recovery phrase.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-2">
              <span className="font-bold">3</span>
            </div>
            <h3 className="font-bold mb-1">Get SUI Tokens</h3>
            <p className="text-sm text-gray-600">
              Add SUI tokens to your wallet to pay for transaction fees and trade meme coins.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletConnection
