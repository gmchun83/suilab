import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import TrendingCoins from '../../components/TrendingCoins'
import coinsReducer, { setTrending } from '../../store/slices/coinsSlice'
import { act } from 'react'

// Mock the API module
vi.mock('../../utils/api', () => ({
  default: {
    get: vi.fn()
  }
}))

// Create a mock store with the actual reducer
const createMockStore = () => {
  return configureStore({
    reducer: {
      coins: coinsReducer
    }
  })
}

describe('TrendingCoins Component', () => {
  let store

  beforeEach(() => {
    store = createMockStore()
    vi.resetAllMocks()
  })

  test('renders trending coins when data is available', () => {
    // Mock sample coin data
    const mockCoins = [
      {
        id: '1',
        objectId: 'obj1',
        name: 'TrendingCoin1',
        symbol: 'TC1',
        creatorAddress: '0x123',
        supply: '1000000',
        price: 0.00123,
        createdAt: '2023-01-01'
      },
      {
        id: '2',
        objectId: 'obj2',
        name: 'TrendingCoin2',
        symbol: 'TC2',
        creatorAddress: '0x456',
        supply: '2000000',
        price: 0.00456,
        createdAt: '2023-01-02'
      },
      {
        id: '3',
        objectId: 'obj3',
        name: 'TrendingCoin3',
        symbol: 'TC3',
        creatorAddress: '0x789',
        supply: '3000000',
        price: 0.00789,
        createdAt: '2023-01-03'
      }
    ];

    // Set up the store with trending coins
    act(() => {
      store.dispatch(setTrending(mockCoins));
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <TrendingCoins />
        </MemoryRouter>
      </Provider>
    )

    // Check if trending coins section is displayed
    expect(screen.getByTestId('trending-coins-content')).toBeInTheDocument();
    expect(screen.getByText('Trending Coins')).toBeInTheDocument();

    // Check if all trending coins are displayed
    expect(screen.getByText('TrendingCoin1')).toBeInTheDocument();
    expect(screen.getByText('TrendingCoin2')).toBeInTheDocument();
    expect(screen.getByText('TrendingCoin3')).toBeInTheDocument();

    // Check if symbols are displayed
    expect(screen.getByText('TC1')).toBeInTheDocument();
    expect(screen.getByText('TC2')).toBeInTheDocument();
    expect(screen.getByText('TC3')).toBeInTheDocument();
  })
})
