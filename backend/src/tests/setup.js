// Mock Redis client
jest.mock('../utils/redisClient', () => {
  const mockRedisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  };

  return {
    redisClient: mockRedisClient,
    redisGet: jest.fn().mockImplementation(async (key) => {
      return mockRedisClient.get(key);
    }),
    redisSet: jest.fn().mockImplementation(async (key, value, ttl) => {
      return mockRedisClient.set(key, value, ttl);
    }),
    redisDel: jest.fn().mockImplementation(async (key) => {
      return mockRedisClient.del(key);
    }),
    __esModule: true,
    default: mockRedisClient,
  };
});

// Mock logger
jest.mock('../utils/logger', () => {
  return {
    logger: {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    },
    __esModule: true,
  };
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.PORT = '3001';
