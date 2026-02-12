// 认证路由
import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// 验证规则
const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  body('name').notEmpty().withMessage('Name is required'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// 路由
router.post('/register', validate(registerValidation), authController.register.bind(authController));
router.post('/login', validate(loginValidation), authController.login.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));
router.post('/refresh-tokens', authController.refreshTokens.bind(authController));
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

export default router;
