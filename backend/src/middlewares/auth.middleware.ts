// JWT 认证中间件
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../core/error';
import { prisma } from '../lib/prisma';

// JWT Payload 接口
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

// 认证中间件 - 验证 JWT token
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 从 Authorization header 获取 token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.authenticationError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    // 验证 token
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 将用户信息添加到请求对象
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(AppError.authenticationError('Token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(AppError.authenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
};

// 可选认证中间件 - token 存在则验证，不存在也允许继续
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'default-secret';
      const decoded = jwt.verify(token, secret) as JwtPayload;
      req.user = decoded;
    }
    
    next();
  } catch {
    // token 无效时静默通过
    next();
  }
};

// 角色授权中间件工厂
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw AppError.authenticationError();
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.authorizationError('Insufficient permissions');
    }

    next();
  };
};

// JWT 工具函数
export const jwtUtils = {
  // 生成访问令牌
  generateAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
  },

  // 生成刷新令牌
  generateRefreshToken(userId: string): string {
    const secret = process.env.JWT_SECRET || 'default-secret';
    return jwt.sign({ userId, type: 'refresh' }, secret, { expiresIn: '30d' });
  },

  // 验证刷新令牌
  verifyRefreshToken(token: string): { userId: string } | null {
    try {
      const secret = process.env.JWT_SECRET || 'default-secret';
      const decoded = jwt.verify(token, secret) as { userId: string; type: string };
      if (decoded.type !== 'refresh') return null;
      return { userId: decoded.userId };
    } catch {
      return null;
    }
  },
};
