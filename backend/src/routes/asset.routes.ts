// 资产路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { assetController } from '../controllers/asset.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ 资产路由 ============
router.post('/assets/search',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  assetController.search.bind(assetController)
);

router.get('/assets/:id',
  param('id').isUUID().withMessage('Invalid asset ID'),
  assetController.getById.bind(assetController)
);

router.post('/assets',
  body('name').notEmpty().withMessage('Asset name is required'),
  body('type').isIn(['REAL_ESTATE', 'VEHICLE', 'EQUIPMENT', 'INTANGIBLE', 'FINANCIAL', 'OTHER'])
    .withMessage('Invalid asset type'),
  assetController.create.bind(assetController)
);

router.put('/assets/:id',
  param('id').isUUID().withMessage('Invalid asset ID'),
  assetController.update.bind(assetController)
);

router.delete('/assets/:id',
  param('id').isUUID().withMessage('Invalid asset ID'),
  assetController.delete.bind(assetController)
);

// ============ 资产批量导入 ============
router.post('/assets/import',
  body('assets').isArray({ min: 1 }).withMessage('Assets array is required'),
  assetController.importAssets.bind(assetController)
);

// ============ 资产统计 ============
router.get('/assets/statistics/summary',
  assetController.getStatistics.bind(assetController)
);

export default router;
