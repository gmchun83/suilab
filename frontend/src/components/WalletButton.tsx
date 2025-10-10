import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './common/Button'
import useWallet from '../hooks/useWallet'
import { formatSUI } from '../utils/formatting'
import { getWalletAdapter } from '../utils/walletAdapters'

const WalletButton: React.FC = () => {
  const navigate = useNavigate()
  const { connected, address, balance, loading, connect, disconnect } = useWallet()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleConnect = async () => {
    const { adapter } = getWalletAdapter()

    if (adapter) {
      const success = await connect()
      if (!success) {
        navigate('/wallet')
      }
    } else {
      navigate('/wallet')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  if (connected && address) {
    return (
      <div className="relative">
        <div
          className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
          onClick={toggleDropdown}
        >
          <div className="h-2 w-2 rounded-full bg-green-500" title="Connected"></div>
          <div className="text-sm font-medium">
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
            <div className="p-4">
              <div className="mb-2 text-sm text-gray-500">Address</div>
              <div className="mb-4 text-sm font-mono break-all">{address}</div>

              <div className="mb-2 text-sm text-gray-500">Balance</div>
              <div className="mb-4 text-lg font-semibold">{formatSUI(balance || '0')} SUI</div>

              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate('/portfolio')
                    setIsDropdownOpen(false)
                  }}
                >
                  My Portfolio
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}

export default WalletButton
