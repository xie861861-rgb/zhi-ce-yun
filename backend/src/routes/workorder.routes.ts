// 服务工单路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { workOrderController } from '../controllers/workorder.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ 工单操作 ============
router.post('/service-orders',
  body('type')
    .isIn(['CONSULTATION', 'FINANCING', 'ASSET_MANAGEMENT', 'OTHER'])
    .withMessage('Invalid order type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('companyName').notEmpty().withMessage('Company name is required'),
  body('contactName').notEmpty().withMessage('Contact name is required'),
  body('contactPhone').notEmpty().withMessage('Contact phone is required'),
  validate,
  workOrderController.create.bind(workOrderController)
);

router.get('/service-orders',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid status'),
  workOrderController.list.bind(workOrderController)
);

router.get('/service-orders/:id',
  param('id').isUUID().withMessage('Invalid order ID'),
  workOrderController.getById.bind(workOrderController)
);

router.put('/service-orders/:id/status',
  param('id').isUUID().withMessage('Invalid order ID'),
  body('status')
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
    .withMessage('Invalid status'),
  validate,
  workOrderController.updateStatus.bind(workOrderController)
);

router.delete('/service-orders/:id',
  param('id').isUUID().withMessage('Invalid order ID'),
  workOrderController.delete.bind(workOrderController)
);

router.get('/service-orders/statistics',
  workOrderController.getStatistics.bind(workOrderController)
);

export default router;
