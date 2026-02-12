// 统一响应格式
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
  requestId?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export class ResponseUtils {
  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return {
      code: 200,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    pageSize: number,
    total: number
  ): PaginatedResponse<T> {
    return {
      code: 200,
      message: 'Success',
      data,
      timestamp: new Date().toISOString(),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  static error(message: string, code: number = 400, data: any = null): ApiResponse {
    return {
      code,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static created<T>(data: T, message: string = 'Created'): ApiResponse<T> {
    return {
      code: 201,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static noContent(): ApiResponse {
    return {
      code: 204,
      message: 'No Content',
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static notFound(message: string = 'Resource not found'): ApiResponse {
    return {
      code: 404,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static unauthorized(message: string = 'Unauthorized'): ApiResponse {
    return {
      code: 401,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static forbidden(message: string = 'Forbidden'): ApiResponse {
    return {
      code: 403,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  static internalError(message: string = 'Internal server error'): ApiResponse {
    return {
      code: 500,
      message,
      data: null,
      timestamp: new Date().toISOString(),
    };
  }
}
