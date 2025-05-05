import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../store'
import { disconnectWallet } from '../store/slices/walletSlice'
import Button from './common/Button'

const WalletButton: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { connected, address, loading } = useSelector((state: RootState) => state.wallet)

  const handleConnect = () => {
    navigate('/wallet')
  }

  const handleDisconnect = () => {
    dispatch(disconnectWallet())
  }

  if (connected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-700">
          {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={loading}
    >
      Connect Wallet
    </Button>
  )
}

export default WalletButton
