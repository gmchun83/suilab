// Mock Redis client
jest.mock('../utils/redisClient', () => {
  const mockRedisClient = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    exists: jest.fn().mockResolvedValue(0),
    expire: jest.fn().mockResolvedValue(1),
    hGet: jest.fn().mockResolvedValue(null),
    hSet: jest.fn().mockResolvedValue(1),
    hGetAll: jest.fn().mockResolvedValue({}),
    hDel: jest.fn().mockResolvedValue(1),
    incr: jest.fn().mockResolvedValue(1),
    decr: jest.fn().mockResolvedValue(0),
    keys: jest.fn().mockResolvedValue([]),
    flushAll: jest.fn().mockResolvedValue('OK'),
  };

  return {
    redisClient: mockRedisClient,
    redisGet: jest.fn().mockImplementation(async (key) => {
      return mockRedisClient.get(key);
    }),
    redisSet: jest.fn().mockImplementation(async (key, value, options) => {
      // Handle both the old style (key, value, 'EX', ttl) and new style (key, value, { EX: ttl })
      if (typeof options === 'object' && options !== null) {
        return mockRedisClient.set(key, value, options);
      } else if (options === 'EX' && arguments.length === 4) {
        const ttl = arguments[3];
        return mockRedisClient.set(key, value, { EX: ttl });
      } else {
        return mockRedisClient.set(key, value);
      }
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

// Mock auth middleware
jest.mock('../api/middleware/authMiddleware', () => {
  return jest.fn().mockImplementation((req, res, next) => {
    // Skip authentication in tests
    next();
  });
});

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.PORT = '3001';
