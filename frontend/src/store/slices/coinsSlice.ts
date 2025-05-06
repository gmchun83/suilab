import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchCoins,
  fetchCoinById,
  fetchTrendingCoins,
  fetchLeaderboard,
  fetchCoinPriceHistory
} from '../../utils/api'

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
  marketCap?: string
  volume24h?: string
  priceChange24h?: string
}

export interface PricePoint {
  timestamp: number
  price: string
}

interface CoinsState {
  coins: Coin[]
  selectedCoin: Coin | null
  trending: Coin[]
  leaderboard: Coin[]
  priceHistory: PricePoint[]
  loading: boolean
  error: string | null
}

const initialState: CoinsState = {
  coins: [],
  selectedCoin: null,
  trending: [],
  leaderboard: [],
  priceHistory: [],
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

export const fetchTrendingCoinsAsync = createAsyncThunk('coins/fetchTrending', async () => {
  const response = await fetchTrendingCoins()
  return response
})

export const fetchLeaderboardAsync = createAsyncThunk(
  'coins/fetchLeaderboard',
  async ({ limit = 10, sortBy = 'marketCap' }: { limit?: number, sortBy?: string } = {}) => {
    const response = await fetchLeaderboard(limit, sortBy)
    return response
  }
)

export const fetchCoinPriceHistoryAsync = createAsyncThunk(
  'coins/fetchPriceHistory',
  async ({ id, period = '24h' }: { id: string, period?: string }) => {
    const response = await fetchCoinPriceHistory(id, period)
    return response
  }
)

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
      // Fetch all coins
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

      // Fetch coin details
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

      // Fetch trending coins
      .addCase(fetchTrendingCoinsAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTrendingCoinsAsync.fulfilled, (state, action) => {
        state.trending = action.payload
        state.loading = false
      })
      .addCase(fetchTrendingCoinsAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch trending coins'
      })

      // Fetch leaderboard
      .addCase(fetchLeaderboardAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLeaderboardAsync.fulfilled, (state, action) => {
        state.leaderboard = action.payload
        state.loading = false
      })
      .addCase(fetchLeaderboardAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch leaderboard'
      })

      // Fetch price history
      .addCase(fetchCoinPriceHistoryAsync.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCoinPriceHistoryAsync.fulfilled, (state, action) => {
        state.priceHistory = action.payload
        state.loading = false
      })
      .addCase(fetchCoinPriceHistoryAsync.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch price history'
      })
  },
})

export const {
  setCoins,
  setSelectedCoin,
  setTrending,
  clearSelectedCoin
} = coinsSlice.actions

export default coinsSlice.reducer
