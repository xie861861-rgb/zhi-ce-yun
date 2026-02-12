// 企业/公司路由
import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { enterpriseController } from '../controllers/enterprise.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 所有路由需要认证
router.use(authenticate);

// ============ 公司管理路由 ============
router.get('/companies/search', 
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('pageSize').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('name').optional().isString(),
  enterpriseController.search.bind(enterpriseController)
);

router.get('/companies/:id', 
  param('id').isUUID().withMessage('Invalid company ID'),
  enterpriseController.getById.bind(enterpriseController)
);

router.post('/companies',
  body('name').notEmpty().withMessage('Company name is required'),
  body('unifiedSocialCreditCode').optional().isString(),
  body('legalRepresentative').optional().isString(),
  body('registrationCapital').optional().isFloat({ min: 0 }),
  body('establishmentDate').optional().isISO8601(),
  body('address').optional().isString(),
  body('businessScope').optional().isString(),
  body('industry').optional().isString(),
  body('annualRevenue').optional().isFloat({ min: 0 }),
  body('totalAssets').optional().isFloat({ min: 0 }),
  body('totalLiabilities').optional().isFloat({ min: 0 }),
  body('netAssets').optional().isFloat({ min: 0 }),
  validate,
  enterpriseController.create.bind(enterpriseController)
);

router.put('/companies/:id',
  param('id').isUUID().withMessage('Invalid company ID'),
  enterpriseController.update.bind(enterpriseController)
);

router.delete('/companies/:id',
  param('id').isUUID().withMessage('Invalid company ID'),
  enterpriseController.delete.bind(enterpriseController)
);

export default router;
