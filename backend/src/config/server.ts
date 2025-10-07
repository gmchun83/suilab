// Server configuration
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) {
    return defaultValue;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const parsePort = (port?: string): number => {
  return parseNumber(port, 3000);
};

export const SERVER_CONFIG = {
  host: process.env.HOST || '0.0.0.0',
  port: parsePort(process.env.PORT),
  portFallbackAttempts: parseNumber(process.env.PORT_FALLBACK_ATTEMPTS, 5),
  env: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  rateLimits: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
};

// API configuration
export const API_CONFIG = {
  prefix: '/api',
  version: 'v1',
  timeout: 30000, // 30 seconds
};

// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  suiRpcUrl: process.env.SUI_RPC_URL || 'https://fullnode.testnet.sui.io',
  suiWebsocketUrl: process.env.SUI_WEBSOCKET_URL || 'wss://fullnode.testnet.sui.io',
  cetusApiKey: process.env.CETUS_API_KEY || '',
  cetusApiUrl: process.env.CETUS_API_URL || 'https://api.cetus.zone',
};

// Redis configuration
export const REDIS_CONFIG = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  ttl: 60 * 60, // 1 hour
};

// Logging configuration
export const LOGGING_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  format: process.env.NODE_ENV === 'production' ? 'json' : 'pretty',
  directory: process.env.LOG_DIR || 'logs',
};

export default {
  SERVER_CONFIG,
  API_CONFIG,
  BLOCKCHAIN_CONFIG,
  REDIS_CONFIG,
  LOGGING_CONFIG,
};
