import express from 'express';
import coinsRoutes from './coinsRoutes';
import transactionsRoutes from './transactionsRoutes';
import dexRoutes from './dexRoutes';

const router = express.Router();

// Mount routes
router.use(coinsRoutes);
router.use(transactionsRoutes);
router.use(dexRoutes);

export default router;
