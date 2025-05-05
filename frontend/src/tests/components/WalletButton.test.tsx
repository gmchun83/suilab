import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import WalletButton from '../../components/WalletButton'

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn()
  }
})

// Create a mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      wallet: (state = initialState, action) => {
        if (action.type === 'wallet/disconnectWallet') {
          return { ...state, connected: false, address: null }
        }
        return state
      }
    },
    preloadedState: {
      wallet: initialState
    }
  })
}

describe('WalletButton Component', () => {
  test('renders connect button when not connected', () => {
    const store = createMockStore({ connected: false, address: null, loading: false })
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WalletButton />
        </MemoryRouter>
      </Provider>
    )
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })

  test('renders address and disconnect button when connected', () => {
    const store = createMockStore({ 
      connected: true, 
      address: '0x123456789abcdef', 
      loading: false 
    })
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WalletButton />
        </MemoryRouter>
      </Provider>
    )
    
    // Check if the truncated address is displayed
    expect(screen.getByText('0x1234...cdef')).toBeInTheDocument()
    
    // Check if the disconnect button is displayed
    expect(screen.getByText('Disconnect')).toBeInTheDocument()
  })

  test('disables connect button when loading', () => {
    const store = createMockStore({ connected: false, address: null, loading: true })
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WalletButton />
        </MemoryRouter>
      </Provider>
    )
    
    const connectButton = screen.getByText('Connect Wallet')
    expect(connectButton).toBeDisabled()
  })

  test('dispatches disconnect action when disconnect button is clicked', () => {
    const store = createMockStore({ 
      connected: true, 
      address: '0x123456789abcdef', 
      loading: false 
    })
    
    const dispatchSpy = vi.spyOn(store, 'dispatch')
    
    render(
      <Provider store={store}>
        <MemoryRouter>
          <WalletButton />
        </MemoryRouter>
      </Provider>
    )
    
    const disconnectButton = screen.getByText('Disconnect')
    fireEvent.click(disconnectButton)
    
    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'wallet/disconnectWallet'
    }))
  })
})
