import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import useWallet from '../hooks/useWallet'
import { formatSUI } from '../utils/formatting'
import {
  getStoredWalletPreference,
  getWalletAdapter,
  getWalletAvailability,
  type WalletId
} from '../utils/walletAdapters'

interface WalletOption {
  id: WalletId
  name: string
  icon: string
  description: string
  available: boolean
}

const WalletConnection: React.FC = () => {
  const navigate = useNavigate()
  const { connected, address, balance, loading, error, connect, disconnect } = useWallet()
  const [selectedWallet, setSelectedWallet] = useState<WalletId | null>(null)
  const [walletAvailability, setWalletAvailability] = useState(() => getWalletAvailability())
  const selectedWalletRef = useRef<WalletId | null>(null)

  useEffect(() => {
    selectedWalletRef.current = selectedWallet
  }, [selectedWallet])

  const walletDetected = useMemo(
    () => Object.values(walletAvailability).some(Boolean),
    [walletAvailability]
  )

  // Check if wallet is available in the browser
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const selectWallet = (walletId: WalletId | null) => {
      if (selectedWalletRef.current !== walletId) {
        setSelectedWallet(walletId)
      }
    }

    const updateAvailability = () => {
      const availability = getWalletAvailability()
      setWalletAvailability(availability)

      const detected = Object.values(availability).some(Boolean)
      const currentSelection = selectedWalletRef.current

      if (currentSelection && availability[currentSelection]) {
        return detected
      }

      const storedPreference = getStoredWalletPreference()

      if (storedPreference && availability[storedPreference]) {
        selectWallet(storedPreference)
        return detected
      }

      const { id } = getWalletAdapter(storedPreference)

      if (id && availability[id]) {
        selectWallet(id)
        return detected
      }

      const firstAvailable = (Object.entries(availability).find(([, available]) => available) ?? [])[0] as
        | WalletId
        | undefined

      selectWallet(firstAvailable ?? null)
      return detected
    }

    let attempts = 0
    const maxAttempts = 10
    let intervalId: number | undefined

    const runCheck = () => updateAvailability()

    const startInterval = () => {
      if (intervalId) {
        return
      }

      attempts = 0
      intervalId = window.setInterval(() => {
        attempts += 1
        const detected = runCheck()

        if (detected || attempts >= maxAttempts) {
          if (intervalId) {
            window.clearInterval(intervalId)
            intervalId = undefined
          }
        }
      }, 1000)
    }

    if (!runCheck()) {
      startInterval()
    }

    const handleFocus = () => {
      if (!runCheck()) {
        startInterval()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && !runCheck()) {
        startInterval()
      }
    }

    const handleWalletReadyEvent = () => {
      if (!runCheck()) {
        startInterval()
      }
    }

    const walletReadyEvents = [
      'suiet#initialized',
      'sui_wallet_initialized',
      'ethos#initialized',
      'martian#initialized',
      'slush#initialized'
    ] as const

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    walletReadyEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleWalletReadyEvent)
    })

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId)
      }
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      walletReadyEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleWalletReadyEvent)
      })
    }
  }, [])

  // Redirect to home if already connected
  useEffect(() => {
    if (connected && address) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [connected, address, navigate])

  // Wallet options
  const walletOptions: WalletOption[] = useMemo(() => ([
    {
      id: 'sui-wallet',
      name: 'Sui Wallet',
      icon: 'https://assets.website-files.com/61a9a8412ca7053e3ff6f2ef/6434d419cfb6b4a058d4cb2c_sui-favicon.svg',
      description: 'The official wallet for the Sui blockchain',
      available: walletAvailability['sui-wallet']
    },
    {
      id: 'ethos-wallet',
      name: 'Ethos Wallet',
      icon: 'https://ethoswallet.xyz/assets/images/ethos-logo.svg',
      description: 'A user-friendly wallet for Sui',
      available: walletAvailability['ethos-wallet']
    },
    {
      id: 'suiet-wallet',
      name: 'Suiet Wallet',
      icon: 'https://suiet.app/favicon.ico',
      description: 'A comprehensive wallet for Sui ecosystem',
      available: walletAvailability['suiet-wallet']
    },
    {
      id: 'slush-wallet',
      name: 'Slush Wallet',
      icon: '/wallets/slush.svg',
      description: 'A lightweight Sui wallet focused on speed and simplicity',
      available: walletAvailability['slush-wallet']
    },
    {
      id: 'martian-wallet',
      name: 'Martian Wallet',
      icon: 'https://martianwallet.xyz/assets/images/martian.png',
      description: 'Multi-chain wallet with Sui support',
      available: walletAvailability['martian-wallet']
    }
  ]), [walletAvailability])

  const handleSelectWallet = (walletId: WalletId) => {
    setSelectedWallet(walletId)
  }

  const handleConnect = async () => {
    if (!selectedWallet) {
      return
    }

    try {
      await connect(selectedWallet)
    } catch (err) {
      console.error('Connection error:', err)
    }
  }

  const handleDisconnect = () => {
    disconnect()
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
            <div className="bg-gray-100 rounded-md p-3 mb-2 inline-block">
              <code className="text-gray-800 font-mono">
                {address}
              </code>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-1">Balance</p>
              <p className="text-xl font-bold">{formatSUI(balance || '0')} SUI</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                onClick={() => navigate('/portfolio')}
                className="w-full sm:w-auto"
              >
                Go to Portfolio
              </Button>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Disconnect Wallet
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              Redirecting to home page in a moment...
            </p>
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

              {!walletDetected && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">No Compatible Wallet Detected</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>You need to install a Sui-compatible wallet to use PumpSui. We recommend the official Sui Wallet.</p>
                        <a
                          href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-yellow-800 font-medium hover:text-yellow-900 underline"
                        >
                          Install Sui Wallet
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                    {!wallet.available ? (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {wallet.id === 'sui-wallet' ? 'Not Installed' : 'Unavailable'}
                      </span>
                    ) : (
                      <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                        Detected
                      </span>
                    )}
                    {selectedWallet === wallet.id && (
                      <svg className="h-5 w-5 text-primary-600 ml-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
              {!walletDetected ? (
                <a
                  href="https://chrome.google.com/webstore/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 w-full sm:w-auto"
                >
                  Install Sui Wallet
                </a>
              ) : (
                <Button
                  onClick={handleConnect}
                  disabled={!selectedWallet || loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? 'Connecting...' : 'Connect Wallet'}
                </Button>
              )}
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
