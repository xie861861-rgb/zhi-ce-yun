// 认证服务层
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { jwtUtils } from '../middlewares/auth.middleware';
import { AppError } from '../core/error';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  // 用户注册
  async register(data: RegisterDto): Promise<{ user: any; tokens: AuthTokens }> {
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw AppError.conflictError('Email already registered');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    // 生成令牌
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // 保存刷新令牌
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return { user, tokens };
  }

  // 用户登录
  async login(data: LoginDto): Promise<{ user: any; tokens: AuthTokens }> {
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw AppError.authenticationError('Invalid email or password');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw AppError.authenticationError('Invalid email or password');
    }

    // 生成令牌
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // 保存刷新令牌
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return { user: userResponse, tokens };
  }

  // 用户登出
  async logout(userId: string, refreshToken?: string): Promise<void> {
    // 如果提供了刷新令牌，删除它
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken,
        },
      });
    } else {
      // 删除该用户的所有刷新令牌
      await prisma.refreshToken.deleteMany({
        where: { userId },
      });
    }
  }

  // 刷新访问令牌
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // 验证刷新令牌
    const decoded = jwtUtils.verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw AppError.authenticationError('Invalid refresh token');
    }

    // 查找刷新令牌
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken) {
      throw AppError.authenticationError('Refresh token not found');
    }

    // 检查是否过期
    if (new Date() > storedToken.expiresAt) {
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });
      throw AppError.authenticationError('Refresh token expired');
    }

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw AppError.authenticationError('User not found');
    }

    // 删除旧刷新令牌
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });

    // 生成新令牌
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // 保存新刷新令牌
    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  // 获取当前用户信息
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFoundError('User not found');
    }

    return user;
  }

  // 生成令牌
  private generateTokens(userId: string, email: string, role: string) {
    const payload = { userId, email, role };
    return {
      accessToken: jwtUtils.generateAccessToken(payload),
      refreshToken: jwtUtils.generateRefreshToken(userId),
    };
  }

  // 保存刷新令牌
  private async saveRefreshToken(userId: string, token: string) {
    // 计算过期时间（30天后）
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }
}

export const authService = new AuthService();
