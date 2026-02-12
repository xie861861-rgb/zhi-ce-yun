// 工单路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { workOrderController } from '../controllers/workorder.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ 工单基础操作 ============
router.post('/workorders/create',
  body('type')
    .isIn(['CREDIT_QUERY', 'ASSET_SEARCH', 'NFS_CALCULATION', 'REPORT_GENERATION', 'TECHNICAL_SUPPORT', 'OTHER'])
    .withMessage('Invalid workorder type'),
  body('title').notEmpty().withMessage('Title is required'),
  workOrderController.create.bind(workOrderController)
);

router.get('/workorders',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status')
    .optional()
    .isIn(['OPEN', 'IN_PROGRESS', 'PENDING_CUSTOMER', 'RESOLVED', 'CLOSED'])
    .withMessage('Invalid status'),
  query('type')
    .optional()
    .isIn(['CREDIT_QUERY', 'ASSET_SEARCH', 'NFS_CALCULATION', 'REPORT_GENERATION', 'TECHNICAL_SUPPORT', 'OTHER'])
    .withMessage('Invalid type'),
  workOrderController.list.bind(workOrderController)
);

router.get('/workorders/:id',
  param('id').isUUID().withMessage('Invalid workorder ID'),
  workOrderController.getById.bind(workOrderController)
);

// ============ 工单状态管理 ============
router.put('/workorders/:id/status',
  param('id').isUUID().withMessage('Invalid workorder ID'),
  body('status')
    .isIn(['OPEN', 'IN_PROGRESS', 'PENDING_CUSTOMER', 'RESOLVED', 'CLOSED'])
    .withMessage('Invalid status'),
  workOrderController.updateStatus.bind(workOrderController)
);

router.post('/workorders/:id/assign',
  param('id').isUUID().withMessage('Invalid workorder ID'),
  workOrderController.assign.bind(workOrderController)
);

router.delete('/workorders/:id/cancel',
  param('id').isUUID().withMessage('Invalid workorder ID'),
  workOrderController.cancel.bind(workOrderController)
);

// ============ 工单统计 ============
router.get('/workorders/statistics/summary',
  workOrderController.getStatistics.bind(workOrderController)
);

export default router;
