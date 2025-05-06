import dexService from '../../../services/dexService';
import { SuiClient } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import axios from 'axios';
import logger from '../../../utils/logger';
import { prisma } from '../../../config';

// Mock dependencies
jest.mock('@mysten/sui.js/client', () => ({
  SuiClient: jest.fn(),
  getFullnodeUrl: jest.fn().mockReturnValue('https://fullnode.testnet.sui.io:443')
}));

jest.mock('@mysten/sui.js/transactions', () => ({
  TransactionBlock: jest.fn().mockImplementation(() => ({
    moveCall: jest.fn().mockReturnThis(),
    setSender: jest.fn().mockReturnThis()
  }))
}));

jest.mock('axios');

jest.mock('../../../utils/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

jest.mock('../../../config', () => ({
  prisma: {
    coin: {
      findUnique: jest.fn()
    }
  }
}));

describe('DexService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPoolInfo', () => {
    it('should return pool information for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockCoin = {
        id: mockCoinId,
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'TC'
      };
      const mockPoolInfo = {
        poolId: 'pool1',
        liquidity: '1000',
        price: '0.001'
      };

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);
      (axios.get as jest.Mock).mockResolvedValue({ data: mockPoolInfo });

      const result = await dexService.getPoolInfo(mockCoinId);

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(axios.get).toHaveBeenCalled();
      expect(result).toEqual(mockPoolInfo);
    });

    it('should throw error if coin is not found', async () => {
      const mockCoinId = 'nonexistent';

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(dexService.getPoolInfo(mockCoinId)).rejects.toThrow('Coin not found');
      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const mockCoinId = 'coin1';
      const mockCoin = {
        id: mockCoinId,
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'TC'
      };
      const mockError = new Error('API error');

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      await expect(dexService.getPoolInfo(mockCoinId)).rejects.toThrow('Failed to get pool info');
      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(axios.get).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getPriceHistory', () => {
    it('should return price history for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockTimeframe = '1d';
      const mockCoin = {
        id: mockCoinId,
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'TC'
      };
      const mockPriceHistory = [
        { timestamp: '2023-01-01', price: '0.001' },
        { timestamp: '2023-01-02', price: '0.002' }
      ];

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);
      (axios.get as jest.Mock).mockResolvedValue({ data: mockPriceHistory });

      const result = await dexService.getPriceHistory(mockCoinId, mockTimeframe);

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(axios.get).toHaveBeenCalled();
      expect(result).toEqual(mockPriceHistory);
    });

    it('should throw error if coin is not found', async () => {
      const mockCoinId = 'nonexistent';
      const mockTimeframe = '1d';

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(dexService.getPriceHistory(mockCoinId, mockTimeframe)).rejects.toThrow('Coin not found');
      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(axios.get).not.toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const mockCoinId = 'coin1';
      const mockTimeframe = '1d';
      const mockCoin = {
        id: mockCoinId,
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'TC'
      };
      const mockError = new Error('API error');

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      await expect(dexService.getPriceHistory(mockCoinId, mockTimeframe)).rejects.toThrow('Failed to get price history');
      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(axios.get).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getDexPools', () => {
    it('should return DEX pools for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockPools = [
        { id: 'pool1', coinId: mockCoinId, poolAddress: '0xpool1', liquidity: '1000' },
        { id: 'pool2', coinId: mockCoinId, poolAddress: '0xpool2', liquidity: '2000' }
      ];

      // Mock axios.get instead of prisma.dexPool
      (axios.get as jest.Mock).mockResolvedValue({ data: mockPools });

      const result = await dexService.getDexPools(mockCoinId);

      expect(axios.get).toHaveBeenCalled();
      expect(result).toEqual(mockPools);
    });

    it('should handle API errors', async () => {
      const mockCoinId = 'coin1';
      const mockError = new Error('API error');

      // Mock axios.get with error
      (axios.get as jest.Mock).mockRejectedValue(mockError);

      await expect(dexService.getDexPools(mockCoinId)).rejects.toThrow('Failed to get DEX pools');
      expect(axios.get).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('getMarketCap', () => {
    it('should return market cap for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockCoin = {
        id: mockCoinId,
        supply: BigInt(1000000),
        price: 0.001
      };
      const expectedMarketCap = '1000'; // 1000000 * 0.001 = 1000

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);

      const result = await dexService.getMarketCap(mockCoinId);

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(result).toEqual(expectedMarketCap);
    });

    it('should throw error if coin is not found', async () => {
      const mockCoinId = 'nonexistent';

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(dexService.getMarketCap(mockCoinId)).rejects.toThrow('Coin not found');
      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
    });

    it('should handle database errors', async () => {
      const mockCoinId = 'coin1';
      const mockError = new Error('Database error');

      (prisma.coin.findUnique as jest.Mock).mockRejectedValue(mockError);

      await expect(dexService.getMarketCap(mockCoinId)).rejects.toThrow('Failed to get market cap');
      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('createCetusDexPool', () => {
    it('should create a DEX pool for a coin', async () => {
      const mockCoinId = 'coin1';
      const mockSuiAmount = '1000';
      const mockTokenAmount = '1000000';
      const mockWalletAddress = '0x123';
      const mockCoin = {
        id: mockCoinId,
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'TC'
      };
      const mockTxResult = {
        digest: '0xabc',
        effects: {
          created: [
            { reference: { objectId: 'pool1' } }
          ]
        }
      };
      const mockCreatedPool = {
        id: 'pool1',
        coinId: mockCoinId,
        poolAddress: 'pool1',
        creatorAddress: mockWalletAddress,
        suiAmount: mockSuiAmount,
        tokenAmount: mockTokenAmount,
        txHash: '0xabc'
      };

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);

      // Mock SuiClient instance
      const mockSuiClient = {
        signAndExecuteTransactionBlock: jest.fn().mockResolvedValue(mockTxResult)
      };
      (SuiClient as jest.Mock).mockImplementation(() => mockSuiClient);

      // Mock axios.post for pool creation
      (axios.post as jest.Mock).mockResolvedValue({ data: mockCreatedPool });

      const result = await dexService.createCetusDexPool(
        mockCoinId,
        mockSuiAmount,
        mockTokenAmount,
        mockWalletAddress
      );

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(SuiClient).toHaveBeenCalled();
      expect(TransactionBlock).toHaveBeenCalled();
      expect(mockSuiClient.signAndExecuteTransactionBlock).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
      expect(result).toEqual(mockCreatedPool);
    });

    it('should throw error if coin is not found', async () => {
      const mockCoinId = 'nonexistent';
      const mockSuiAmount = '1000';
      const mockTokenAmount = '1000000';
      const mockWalletAddress = '0x123';

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(dexService.createCetusDexPool(
        mockCoinId,
        mockSuiAmount,
        mockTokenAmount,
        mockWalletAddress
      )).rejects.toThrow('Coin not found');

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(SuiClient).not.toHaveBeenCalled();
      expect(TransactionBlock).not.toHaveBeenCalled();
    });

    it('should handle transaction errors', async () => {
      const mockCoinId = 'coin1';
      const mockSuiAmount = '1000';
      const mockTokenAmount = '1000000';
      const mockWalletAddress = '0x123';
      const mockCoin = {
        id: mockCoinId,
        objectId: 'obj123',
        name: 'TestCoin',
        symbol: 'TC'
      };
      const mockError = new Error('Transaction error');

      (prisma.coin.findUnique as jest.Mock).mockResolvedValue(mockCoin);

      // Mock SuiClient instance with error
      const mockSuiClient = {
        signAndExecuteTransactionBlock: jest.fn().mockRejectedValue(mockError)
      };
      (SuiClient as jest.Mock).mockImplementation(() => mockSuiClient);

      await expect(dexService.createCetusDexPool(
        mockCoinId,
        mockSuiAmount,
        mockTokenAmount,
        mockWalletAddress
      )).rejects.toThrow('Failed to create DEX pool');

      expect(prisma.coin.findUnique).toHaveBeenCalledWith({
        where: { id: mockCoinId }
      });
      expect(SuiClient).toHaveBeenCalled();
      expect(TransactionBlock).toHaveBeenCalled();
      expect(mockSuiClient.signAndExecuteTransactionBlock).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(axios.post).not.toHaveBeenCalled();
    });
  });
});
