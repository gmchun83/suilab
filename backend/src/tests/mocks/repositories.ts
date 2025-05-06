// Mock repository implementations for testing

export const mockCoinRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByObjectId: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  count: jest.fn().mockResolvedValue(0),
  findTrending: jest.fn().mockResolvedValue([]),
  search: jest.fn().mockResolvedValue([]),
  getPriceHistory: jest.fn().mockResolvedValue([]),
  getLeaderboard: jest.fn().mockResolvedValue([]),
};

export const mockTransactionRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByCoinId: jest.fn().mockResolvedValue([]),
  findByWalletAddress: jest.fn().mockResolvedValue([]),
  findByTxId: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
  count: jest.fn().mockResolvedValue(0),
  countByCoinId: jest.fn().mockResolvedValue(0),
};

export const mockUserRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByWalletAddress: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
  count: jest.fn().mockResolvedValue(0),
};
