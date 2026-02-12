// 企业路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { enterpriseController } from '../controllers/enterprise.controller';
import { creditController } from '../controllers/credit.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ 企业管理路由 ============
router.get('/enterprises/search', 
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  enterpriseController.search.bind(enterpriseController)
);

router.get('/enterprises/:id', 
  param('id').isUUID().withMessage('Invalid enterprise ID'),
  enterpriseController.getById.bind(enterpriseController)
);

router.post('/enterprises',
  body('name').notEmpty().withMessage('Enterprise name is required'),
  enterpriseController.create.bind(enterpriseController)
);

router.put('/enterprises/:id',
  param('id').isUUID().withMessage('Invalid enterprise ID'),
  enterpriseController.update.bind(enterpriseController)
);

router.delete('/enterprises/:id',
  param('id').isUUID().withMessage('Invalid enterprise ID'),
  enterpriseController.delete.bind(enterpriseController)
);

// ============ 征信模块路由 ============
router.post('/credit/enterprise/parse',
  body('reportData').isObject().withMessage('Report data is required'),
  creditController.parseEnterprise.bind(creditController)
);

router.get('/credit/reports/:id',
  param('id').isUUID().withMessage('Invalid report ID'),
  creditController.getReport.bind(creditController)
);

router.get('/credit/enterprises/:enterpriseId/reports',
  param('enterpriseId').isUUID().withMessage('Invalid enterprise ID'),
  creditController.getEnterpriseReports.bind(creditController)
);

export default router;
