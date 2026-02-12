// 错误处理中间件
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/error';
import { ResponseUtils } from '../core/response';

interface ErrorResponse {
  code: number;
  message: string;
  data: null;
  timestamp: string;
  stack?: string;
}

// 开发环境错误处理
const sendErrorDev = (err: AppError, res: Response) => {
  const response: ErrorResponse = {
    code: err.statusCode,
    message: err.message,
    data: null,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(err.statusCode).json(response);
};

// 生产环境错误处理
const sendErrorProd = (err: AppError, res: Response) => {
  // 已知错误，直接返回
  if (err.isOperational) {
    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
      data: null,
      timestamp: new Date().toISOString(),
    });
  } else {
    // 未知错误，隐藏详细信息
    console.error('ERROR 💥', err);
    res.status(500).json({
      code: 500,
      message: 'Something went wrong',
      data: null,
      timestamp: new Date().toISOString(),
    });
  }
};

// 404 处理
const handleNotFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404, 'NOT_FOUND');
  next(error);
};

// 全局错误处理中间件
const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    // 将未知错误转换为 AppError
    error = new AppError('Internal server error', 500);
    error.stack = err.stack;
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export { errorHandler, handleNotFound };
