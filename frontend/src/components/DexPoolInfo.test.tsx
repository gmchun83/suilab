import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DexPoolInfo from './DexPoolInfo';
import { PoolType } from '../types';

// Mock the useDex hook
vi.mock('../hooks/useDex', () => ({
  default: vi.fn()
}));

// Mock the Card component
vi.mock('./common/Card', () => ({
  Card: ({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  )
}));

// Import after mocking
import useDex from '../hooks/useDex';

describe('DexPoolInfo', () => {
  const mockCoin = {
    id: '123',
    objectId: '0x123',
    name: 'Test Coin',
    symbol: 'TEST',
    creatorAddress: '0xabc123',
    supply: '1000000',
    price: 0.001,
    createdAt: '2023-01-01T00:00:00Z'
  };

  const mockPools = [
    {
      id: 'pool1',
      objectId: '0xpool1',
      coinId: '123',
      type: PoolType.BONDING_CURVE,
      suiBalance: '1000',
      tokenBalance: '1000000',
      creatorAddress: '0xabc123',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    },
    {
      id: 'pool2',
      objectId: '0xpool2',
      coinId: '123',
      type: PoolType.DEX,
      suiBalance: '2000',
      tokenBalance: '2000000',
      creatorAddress: '0xabc123',
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z'
    }
  ];

  const mockGetDexPools = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useDex as any).mockReturnValue({
      pools: [],
      loading: false,
      error: null,
      getDexPools: mockGetDexPools
    });
  });

  it('renders loading state correctly', () => {
    (useDex as any).mockReturnValue({
      pools: [],
      loading: true,
      error: null,
      getDexPools: mockGetDexPools
    });

    render(<DexPoolInfo coin={mockCoin} />);

    expect(screen.getByText('DEX Pools')).toBeInTheDocument();
    expect(screen.getByText('Loading pool information...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    (useDex as any).mockReturnValue({
      pools: [],
      loading: false,
      error: 'Failed to load pools',
      getDexPools: mockGetDexPools
    });

    render(<DexPoolInfo coin={mockCoin} />);

    expect(screen.getByText('DEX Pools')).toBeInTheDocument();
    expect(screen.getByText('Error loading pool information: Failed to load pools')).toBeInTheDocument();
  });

  it('renders empty state correctly', () => {
    (useDex as any).mockReturnValue({
      pools: [],
      loading: false,
      error: null,
      getDexPools: mockGetDexPools
    });

    render(<DexPoolInfo coin={mockCoin} />);

    expect(screen.getByText('DEX Pools')).toBeInTheDocument();
    expect(screen.getByText('No DEX pools found for this coin.')).toBeInTheDocument();
  });

  it('renders pools correctly', () => {
    (useDex as any).mockReturnValue({
      pools: mockPools,
      loading: false,
      error: null,
      getDexPools: mockGetDexPools
    });

    render(<DexPoolInfo coin={mockCoin} />);

    expect(screen.getByText('DEX Pools')).toBeInTheDocument();
    expect(screen.getByText('Bonding Curve Pool')).toBeInTheDocument();
    expect(screen.getByText('Cetus DEX Pools')).toBeInTheDocument();

    // Check for bonding curve pool data
    expect(screen.getByText(/1,000.00 SUI/)).toBeInTheDocument();
    expect(screen.getByText(/1,000,000.00/)).toBeInTheDocument();

    // Check for DEX pool data
    expect(screen.getByText(/2,000.00 SUI/)).toBeInTheDocument();
    expect(screen.getByText(/2,000,000.00/)).toBeInTheDocument();
    expect(screen.getByText('View on Cetus DEX →')).toBeInTheDocument();
  });

  it('calls getDexPools on mount', () => {
    render(<DexPoolInfo coin={mockCoin} />);
    expect(mockGetDexPools).toHaveBeenCalledWith('123');
  });
});
