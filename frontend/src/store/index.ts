import { configureStore } from '@reduxjs/toolkit'
import walletReducer from './slices/walletSlice'
import coinsReducer from './slices/coinsSlice'
import userReducer from './slices/userSlice'

const store = configureStore({
  reducer: {
    wallet: walletReducer,
    coins: coinsReducer,
    user: userReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
