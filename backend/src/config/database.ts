import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log queries in development mode
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// Log errors
prisma.$on('error', (e: any) => {
  logger.error(`Prisma Error: ${e.message}`);
});

let disconnectPromise: Promise<void> | null = null;

const disconnectPrisma = async () => {
  if (!disconnectPromise) {
    disconnectPromise = prisma
      .$disconnect()
      .then(() => {
        logger.info('Disconnected from database');
      })
      .catch((error: unknown) => {
        logger.error('Error disconnecting from database', { error });
      });
  }

  return disconnectPromise;
};

// Handle graceful shutdown
process.once('beforeExit', () => {
  void disconnectPrisma();
});

process.once('SIGINT', async () => {
  await disconnectPrisma();
});

process.once('SIGTERM', async () => {
  await disconnectPrisma();
});

export const disconnectDatabase = disconnectPrisma;

export default prisma;
