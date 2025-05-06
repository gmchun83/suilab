import express from 'express';
import { dexController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = express.Router();

// DEX routes
router.get('/api/dex/pools/:coinId', dexController.getDexPools);
router.get('/api/dex/pool/:coinId', dexController.getPoolInfo);
router.get('/api/dex/price-history/:coinId', dexController.getPriceHistory);
router.get('/api/dex/market-cap/:coinId', dexController.getMarketCap);
router.post('/api/dex/price-impact/:coinId', dexController.calculatePriceImpact);
router.post('/api/dex/create-pool/:coinId', authMiddleware.authenticate, dexController.createDexPool);

export default router;
