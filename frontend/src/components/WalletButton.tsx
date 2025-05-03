import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { 
  connectWalletStart, 
  connectWalletSuccess, 
  connectWalletFailure, 
  disconnectWallet 
} from '../store/slices/walletSlice'
import { connectWallet } from '../utils/suiClient'
import Button from './common/Button'

const WalletButton: React.FC = () => {
  const dispatch = useDispatch()
  const { connected, address, loading, error } = useSelector((state: RootState) => state.wallet)
  
  const handleConnect = async () => {
    try {
      dispatch(connectWalletStart())
      const walletData = await connectWallet()
      dispatch(connectWalletSuccess(walletData))
    } catch (err) {
      dispatch(connectWalletFailure((err as Error).message))
    }
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
      {loading ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
}

export default WalletButton
