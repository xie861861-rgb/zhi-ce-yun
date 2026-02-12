// 认证控制器
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ResponseUtils } from '../core/response';
import { AppError } from '../core/error';

export class AuthController {
  // 用户注册
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register({ email, password, name });

      res.status(201).json(
        ResponseUtils.created(result, 'User registered successfully')
      );
    } catch (error) {
      next(error);
    }
  }

  // 用户登录
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.json(ResponseUtils.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  // 用户登出
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const refreshToken = req.body.refreshToken;

      await authService.logout(userId, refreshToken);

      res.json(ResponseUtils.success(null, 'Logout successful'));
    } catch (error) {
      next(error);
    }
  }

  // 刷新令牌
  async refreshTokens(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw AppError.badRequest('Refresh token is required');
      }

      const tokens = await authService.refreshTokens(refreshToken);

      res.json(ResponseUtils.success(tokens, 'Tokens refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  // 获取当前用户信息
  async getCurrentUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await authService.getCurrentUser(userId);

      res.json(ResponseUtils.success(user));
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
