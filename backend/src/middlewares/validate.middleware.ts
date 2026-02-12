// 请求验证中间件
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from '../core/error';

// 验证结果处理中间件
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 执行所有验证
    await Promise.all(validations.map(validation => validation.run(req)));

    // 检查验证错误
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // 提取错误信息
    const errorMessages = errors.array().map(err => {
      if ('path' in err) {
        return `${err.path}: ${err.msg}`;
      }
      return err.msg;
    });

    throw AppError.validationError(errorMessages.join('; '));
  };
};

// 常用验证规则
export const commonValidation = {
  // ID 参数验证
  idParam: (paramName: string = 'id') => [
    require(paramName).isUUID().withMessage(`Invalid ${paramName} format`),
  ],

  // 分页参数验证
  pagination: [
    require('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be a positive integer'),
    require('pageSize').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('PageSize must be between 1 and 100'),
  ],

  // 邮箱验证
  email: require('email').isEmail().withMessage('Invalid email format'),

  // 密码验证
  password: require('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
};

// 导入 express-validator 的 chain 函数类型
import { require } from 'express-validator';
