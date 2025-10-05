import dotenv from 'dotenv';
import { logger } from './utils/logger';
import app from './app';
import { disconnectDatabase } from './config/database';

// Load environment variables
dotenv.config();

// Define port
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
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
