// 自定义应用错误类
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 错误类型定义
export type ErrorType = 
  | 'VALIDATION_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'AUTHORIZATION_ERROR'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'BAD_REQUEST'
  | 'SERVICE_UNAVAILABLE';

// 错误工厂函数
export class ErrorFactory {
  static validationError(message: string): AppError {
    return new AppError(message, 400, 'VALIDATION_ERROR');
  }

  static authenticationError(message: string = 'Authentication required'): AppError {
    return new AppError(message, 401, 'AUTHENTICATION_ERROR');
  }

  static authorizationError(message: string = 'Access denied'): AppError {
    return new AppError(message, 403, 'AUTHORIZATION_ERROR');
  }

  static notFoundError(message: string = 'Resource not found'): AppError {
    return new AppError(message, 404, 'NOT_FOUND');
  }

  static conflictError(message: string): AppError {
    return new AppError(message, 409, 'CONFLICT');
  }

  static internalError(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500, 'INTERNAL_ERROR');
  }

  static badRequest(message: string): AppError {
    return new AppError(message, 400, 'BAD_REQUEST');
  }

  static serviceUnavailable(message: string = 'Service temporarily unavailable'): AppError {
    return new AppError(message, 503, 'SERVICE_UNAVAILABLE');
  }
}
