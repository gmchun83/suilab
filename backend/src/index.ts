import dotenv from 'dotenv';
import { createServer } from 'http';
import { logger } from './utils/logger';
import app from './app';
import { SERVER_CONFIG } from './config/server';
import { disconnectDatabase } from './config/database';

// Load environment variables
dotenv.config();

// Define host and port
const { host, port, portFallbackAttempts } = SERVER_CONFIG;

const server = createServer(app);

let currentPort = port;
let attempts = 0;

const listen = () => {
  server.listen(currentPort, host, () => {
    if (currentPort !== port) {
      logger.warn(
        `Configured port ${port} is in use. Server running on fallback port ${currentPort}`
      );
    } else {
      logger.info(`Server running on ${host}:${currentPort}`);
    }

    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE' && attempts < portFallbackAttempts) {
    const previousPort = currentPort;
    attempts += 1;
    currentPort += 1;

    logger.warn(
      `Port ${previousPort} is already in use. Attempting to start server on port ${currentPort} (retry ${attempts} of ${portFallbackAttempts}).`
    );

    setTimeout(listen, 100);
    return;
  }

  logger.error('Failed to start server', { error: error.message });
  process.exit(1);
});

listen();

// Handle graceful shutdown
const shutdown = async (signal: NodeJS.Signals) => {
  logger.info(`${signal} signal received: closing HTTP server`);

  server.close(async () => {
    logger.info('HTTP server closed');

    await disconnectDatabase();

    process.exit(0);
  });
};

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

export default server;
