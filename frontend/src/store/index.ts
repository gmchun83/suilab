import { configureStore } from '@reduxjs/toolkit'
import walletReducer from './slices/walletSlice'
import coinsReducer from './slices/coinsSlice'

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    coins: coinsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
