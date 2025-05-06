import express from 'express';
import { dexController } from '../controllers';
import { authMiddleware } from '../middleware';

const router = express.Router();

// DEX routes
router.get('/dex/pools/:coinId', dexController.getDexPools);
router.get('/dex/pool/:coinId', dexController.getPoolInfo);
router.get('/dex/price-history/:coinId', dexController.getPriceHistory);
router.get('/dex/market-cap/:coinId', dexController.getMarketCap);
router.post('/dex/price-impact/:coinId', dexController.calculatePriceImpact);
router.post('/dex/create-pool/:coinId', authMiddleware.authenticate, dexController.createDexPool);

export default router;
