// NFS 计算路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { nfsController } from '../controllers/nfs.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ NFS 计算核心路由 ============
router.post('/nfs/calculate-batch',
  body('calculations').isArray({ min: 1 }).withMessage('Calculations array is required'),
  body('calculations.*.enterpriseId').isUUID().withMessage('Invalid enterprise ID'),
  body('calculations.*.financialData').isObject().withMessage('Financial data is required'),
  nfsController.calculateBatch.bind(nfsController)
);

// ============ NFS 结果查询路由 ============
router.get('/nfs/calculations/:id',
  param('id').isUUID().withMessage('Invalid calculation ID'),
  nfsController.getResult.bind(nfsController)
);

router.get('/nfs/enterprises/:enterpriseId/calculations',
  param('enterpriseId').isUUID().withMessage('Invalid enterprise ID'),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  nfsController.getHistory.bind(nfsController)
);

export default router;
