import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
  connected: boolean
  address: string | null
  balance: string | null
  loading: boolean
  error: string | null
}

const initialState: WalletState = {
  connected: false,
  address: null,
  balance: null,
  loading: false,
  error: null,
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    connectWalletStart(state) {
      state.loading = true
      state.error = null
    },
    connectWalletSuccess(state, action: PayloadAction<{ address: string; balance: string }>) {
      state.connected = true
      state.address = action.payload.address
      state.balance = action.payload.balance
      state.loading = false
    },
    connectWalletFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    disconnectWallet(state) {
      state.connected = false
      state.address = null
      state.balance = null
    },
    updateBalance(state, action: PayloadAction<string>) {
      state.balance = action.payload
    },
  },
})

export const {
  connectWalletStart,
  connectWalletSuccess,
  connectWalletFailure,
  disconnectWallet,
  updateBalance,
} = walletSlice.actions

export default walletSlice.reducer
