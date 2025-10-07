import dotenv from 'dotenv';
import { logger } from './utils/logger';
import app from './app';
import { SERVER_CONFIG } from './config/server';
import { disconnectDatabase } from './config/database';

// Load environment variables
dotenv.config();

// Define host and port
const { host, port } = SERVER_CONFIG;

// Start server
const server = app.listen(port, host, () => {
  logger.info(`Server running on ${host}:${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

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
