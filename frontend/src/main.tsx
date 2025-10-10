import React, { useEffect, useMemo, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { WalletProvider } from '@mysten/wallet-adapter-react'
import App from './App'
import store from './store'
import {
  getWalletProviderAdapters,
  subscribeToWalletChanges
} from './utils/walletAdapters'
import './assets/styles/global.css'

const WalletAdapterManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState(() => getWalletProviderAdapters())

  useEffect(() => {
    const updateWallets = () => {
      setWallets(getWalletProviderAdapters())
    }

    const unsubscribe = subscribeToWalletChanges(updateWallets)
    return () => unsubscribe()
  }, [])

  const managedWallets = useMemo(() => wallets.slice(), [wallets])

  return (
    <WalletProvider wallets={managedWallets} autoConnect={false}>
      {children}
    </WalletProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <WalletAdapterManager>
          <App />
        </WalletAdapterManager>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
