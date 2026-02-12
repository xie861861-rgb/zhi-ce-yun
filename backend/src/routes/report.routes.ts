// 报告路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { reportController } from '../controllers/report.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ 报告生成与查询 ============
router.post('/reports/generate',
  body('type')
    .isIn(['CREDIT', 'NFS', 'ASSET_CONFIG', 'RISK_ANALYSIS'])
    .withMessage('Invalid report type'),
  body('title').notEmpty().withMessage('Report title is required'),
  body('enterpriseId').optional().isUUID().withMessage('Invalid enterprise ID'),
  validate,
  reportController.generate.bind(reportController)
);

router.get('/reports/:id',
  param('id').isUUID().withMessage('Invalid report ID'),
  reportController.getById.bind(reportController)
);

router.get('/reports',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('type')
    .optional()
    .isIn(['CREDIT', 'NFS', 'ASSET_CONFIG', 'RISK_ANALYSIS'])
    .withMessage('Invalid report type'),
  reportController.list.bind(reportController)
);

router.delete('/reports/:id',
  param('id').isUUID().withMessage('Invalid report ID'),
  reportController.delete.bind(reportController)
);

export default router;
