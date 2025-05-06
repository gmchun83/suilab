import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from './utils/logger';
import { routes } from './api';
import { SERVER_CONFIG, API_CONFIG } from './config';
import { ERROR_MESSAGES, HTTP_STATUS } from './constants';

// Create Express server
const app = express();

// Middleware
app.use(cors(SERVER_CONFIG.corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// API routes
app.use(routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    environment: SERVER_CONFIG.env
  });
});

// 404 handler
app.use((req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: ERROR_MESSAGES.NOT_FOUND,
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    message: SERVER_CONFIG.env === 'development' ? err.message : undefined
  });
});

export default app;
