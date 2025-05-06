// Mock the logger first to avoid circular dependencies
jest.mock('../../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }
}));

// Import after mocking to avoid circular dependency
import notificationService from '../../../services/notificationService';
import { logger } from '../../../utils/logger';

describe('NotificationService', () => {
  let mockIo: any;
  let mockEmit: jest.Mock;
  let mockTo: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock Socket.IO instance
    mockEmit = jest.fn();
    mockTo = jest.fn().mockReturnValue({ emit: mockEmit });
    mockIo = {
      emit: mockEmit,
      to: mockTo
    };

    // Set the mocked Socket.IO instance
    (notificationService as any).io = mockIo;
  });

  describe('notifyCoinCreated', () => {
    it('should emit coin:created event with coin data', () => {
      const mockCoinData = {
        id: 'coin1',
        name: 'TestCoin',
        symbol: 'TC',
        creatorAddress: '0x123'
      };

      notificationService.notifyCoinCreated(mockCoinData);

      expect(mockIo.emit).toHaveBeenCalledWith('coin:created', mockCoinData);
      expect(logger.info).toHaveBeenCalledWith(`Sent coin creation notification for ${mockCoinData.name}`);
    });

    it('should log warning if io is not initialized', () => {
      // Set io to null to simulate uninitialized state
      (notificationService as any).io = null;

      const mockCoinData = {
        id: 'coin1',
        name: 'TestCoin',
        symbol: 'TC',
        creatorAddress: '0x123'
      };

      notificationService.notifyCoinCreated(mockCoinData);

      expect(logger.warn).toHaveBeenCalledWith('Notification service not initialized');
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe('notifyTransaction', () => {
    it('should emit transaction event to coin room and global feed', () => {
      const mockCoinId = 'coin1';
      const mockTransactionData = {
        id: 'tx1',
        coinId: mockCoinId,
        amount: '100',
        type: 'BUY',
        walletAddress: '0x123'
      };

      notificationService.notifyTransaction(mockCoinId, mockTransactionData);

      // Should emit to the coin-specific room
      expect(mockIo.to).toHaveBeenCalledWith(`coin:${mockCoinId}`);
      expect(mockEmit).toHaveBeenCalledWith('transaction', mockTransactionData);

      // Should also emit to the global transaction feed
      expect(mockIo.emit).toHaveBeenCalledWith('transactions:new', mockTransactionData);

      expect(logger.info).toHaveBeenCalledWith(`Sent transaction notification for coin ${mockCoinId}`);
    });

    it('should log warning if io is not initialized', () => {
      // Set io to null to simulate uninitialized state
      (notificationService as any).io = null;

      const mockCoinId = 'coin1';
      const mockTransactionData = {
        id: 'tx1',
        coinId: mockCoinId,
        amount: '100',
        type: 'BUY',
        walletAddress: '0x123'
      };

      notificationService.notifyTransaction(mockCoinId, mockTransactionData);

      expect(logger.warn).toHaveBeenCalledWith('Notification service not initialized');
      expect(mockTo).not.toHaveBeenCalled();
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe('initialize', () => {
    it('should set io instance and log initialization', () => {
      // Reset io to null
      (notificationService as any).io = null;

      notificationService.initialize(mockIo);

      expect((notificationService as any).io).toBe(mockIo);
      expect(logger.info).toHaveBeenCalledWith('Notification service initialized');
    });
  });
});
