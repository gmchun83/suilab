import express from 'express';
import coinsRoutes from './coinsRoutes';
import transactionsRoutes from './transactionsRoutes';

const router = express.Router();

// Mount routes
router.use(coinsRoutes);
router.use(transactionsRoutes);

export default router;
