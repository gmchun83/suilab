import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchCoins, fetchCoinById } from '../../utils/api'

export interface Coin {
  id: string
  objectId: string
  name: string
  symbol: string
  description?: string
  creatorAddress: string
  supply: string
  price: number
  imageUrl?: string
  createdAt: string
}

interface CoinsState {
  coins: Coin[]
  selectedCoin: Coin | null
  trending: Coin[]
  loading: boolean
  error: string | null
}

const initialState: CoinsState = {
  coins: [],
  selectedCoin: null,
  trending: [],
  loading: false,
  error: null,
}

export const fetchAllCoins = createAsyncThunk('coins/fetchAll', async () => {
  const response = await fetchCoins()
  return response
})

export const fetchCoinDetails = createAsyncThunk('coins/fetchDetails', async (id: string) => {
  const response = await fetchCoinById(id)
  return response
})

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setCoins(state, action: PayloadAction<Coin[]>) {
      state.coins = action.payload
    },
    setSelectedCoin(state, action: PayloadAction<Coin>) {
      state.selectedCoin = action.payload
    },
    setTrending(state, action: PayloadAction<Coin[]>) {
      state.trending = action.payload
    },
    clearSelectedCoin(state) {
      state.selectedCoin = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoins.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllCoins.fulfilled, (state, action) => {
        state.coins = action.payload
        state.loading = false
      })
      .addCase(fetchAllCoins.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch coins'
      })
      .addCase(fetchCoinDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCoinDetails.fulfilled, (state, action) => {
        state.selectedCoin = action.payload
        state.loading = false
      })
      .addCase(fetchCoinDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch coin details'
      })
  },
})

export const { setCoins, setSelectedCoin, setTrending, clearSelectedCoin } = coinsSlice.actions

export default coinsSlice.reducer
