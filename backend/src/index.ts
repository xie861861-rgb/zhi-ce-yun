// 主应用入口
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 导入路由
import authRoutes from './routes/auth.routes';
import enterpriseRoutes from './routes/enterprise.routes';
import creditRoutes from './routes/enterprise.routes';
import assetRoutes from './routes/asset.routes';
import nfsRoutes from './routes/nfs.routes';
import reportRoutes from './routes/report.routes';
import workorderRoutes from './routes/workorder.routes';

// 导入中间件
import { errorHandler, handleNotFound } from './middlewares/error.middleware';

const app = express();

// ============ 中间件配置 ============

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body 解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 请求日志 (开发环境)
if (process.env.NODE_ENV === 'development') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// ============ 健康检查 ============
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// ============ API 路由 ============
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', enterpriseRoutes); // 企业 + 征信
app.use('/api/v1', assetRoutes);       // 资产
app.use('/api/v1', nfsRoutes);          // NFS 计算
app.use('/api/v1', reportRoutes);       // 报告
app.use('/api/v1', workorderRoutes);    // 工单

// ============ 错误处理 ============

// 404 处理
app.use(handleNotFound);

// 全局错误处理
app.use(errorHandler);

// ============ 启动服务器 ============
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 ZhiCeYun Backend Server                               ║
║                                                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   Port: ${PORT}                                              ║
║   API: http://localhost:${PORT}/api/v1                        ║
║   Health: http://localhost:${PORT}/health                    ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
