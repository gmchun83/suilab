import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import TrendingCoins from '../../components/TrendingCoins'

// Mock API service
vi.mock('../../services/api', () => ({
  getTrendingCoins: vi.fn().mockResolvedValue({
    data: [
      { id: '1', name: 'TrendingCoin1', symbol: 'TC1', priceChange24h: '5.2', price: '0.00123' },
      { id: '2', name: 'TrendingCoin2', symbol: 'TC2', priceChange24h: '-2.1', price: '0.00456' },
      { id: '3', name: 'TrendingCoin3', symbol: 'TC3', priceChange24h: '0.5', price: '0.00789' }
    ]
  })
}))

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      coins: (state = { trending: [], loading: false, error: null }, action) => {
        switch (action.type) {
          case 'coins/fetchTrendingCoins/pending':
            return { ...state, loading: true }
          case 'coins/fetchTrendingCoins/fulfilled':
            return { ...state, trending: action.payload, loading: false }
          case 'coins/fetchTrendingCoins/rejected':
            return { ...state, error: action.payload, loading: false }
          default:
            return state
        }
      }
    }
  })
}

describe('TrendingCoins Component', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
  })

  test('renders loading state initially', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TrendingCoins />
        </MemoryRouter>
      </Provider>
    )
    
    expect(screen.getByText('Trending Coins')).toBeInTheDocument()
    expect(screen.getByTestId('trending-coins-loading')).toBeInTheDocument()
  })

  test('renders trending coins after loading', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TrendingCoins />
        </MemoryRouter>
      </Provider>
    )
    
    // Wait for the trending coins to load
    await waitFor(() => {
      expect(screen.getByText('TrendingCoin1')).toBeInTheDocument()
    })
    
    // Check if all trending coins are displayed
    expect(screen.getByText('TrendingCoin1')).toBeInTheDocument()
    expect(screen.getByText('TrendingCoin2')).toBeInTheDocument()
    expect(screen.getByText('TrendingCoin3')).toBeInTheDocument()
    
    // Check if symbols are displayed
    expect(screen.getByText('TC1')).toBeInTheDocument()
    expect(screen.getByText('TC2')).toBeInTheDocument()
    expect(screen.getByText('TC3')).toBeInTheDocument()
    
    // Check if price changes are displayed with correct colors
    const positiveChange = screen.getByText('+5.2%')
    const negativeChange = screen.getByText('-2.1%')
    
    expect(positiveChange).toHaveClass('text-green-500')
    expect(negativeChange).toHaveClass('text-red-500')
  })

  test('renders error message when fetch fails', async () => {
    // Override the mock to simulate an error
    vi.mock('../../services/api', () => ({
      getTrendingCoins: vi.fn().mockRejectedValue(new Error('Failed to fetch trending coins'))
    }))
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TrendingCoins />
        </MemoryRouter>
      </Provider>
    )
    
    // Dispatch a rejected action to simulate an error
    store.dispatch({
      type: 'coins/fetchTrendingCoins/rejected',
      payload: 'Failed to fetch trending coins'
    })
    
    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to load trending coins')).toBeInTheDocument()
    })
  })

  test('renders empty state when no trending coins', async () => {
    // Override the mock to return empty data
    vi.mock('../../services/api', () => ({
      getTrendingCoins: vi.fn().mockResolvedValue({ data: [] })
    }))
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <TrendingCoins />
        </MemoryRouter>
      </Provider>
    )
    
    // Dispatch a fulfilled action with empty data
    store.dispatch({
      type: 'coins/fetchTrendingCoins/fulfilled',
      payload: []
    })
    
    // Wait for the empty state message to appear
    await waitFor(() => {
      expect(screen.getByText('No trending coins available')).toBeInTheDocument()
    })
  })
})
