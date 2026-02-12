// API 客户端配置
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    // 获取token
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    // 处理204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/login',
      { method: 'POST', body: { email, password } }
    );
  }

  async register(data: { email: string; password: string; name: string }) {
    return this.request<{ user: any; tokens: { accessToken: string; refreshToken: string } }>(
      '/auth/register',
      { method: 'POST', body: data }
    );
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  // Companies
  async getCompanies(params?: { page?: number; pageSize?: number; name?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.name) queryParams.set('name', params.name);

    const query = queryParams.toString();
    return this.request<{ data: any[]; pagination: any }>(
      `/companies/search${query ? '?' + query : ''}`
    );
  }

  async getCompany(id: string) {
    return this.request<any>(`/companies/${id}`);
  }

  async createCompany(data: any) {
    return this.request<any>('/companies', { method: 'POST', body: data });
  }

  async updateCompany(id: string, data: any) {
    return this.request<any>(`/companies/${id}`, { method: 'PUT', body: data });
  }

  async deleteCompany(id: string) {
    return this.request<any>(`/companies/${id}`, { method: 'DELETE' });
  }

  // Reports
  async getReports(params?: { page?: number; pageSize?: number; type?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.type) queryParams.set('type', params.type);

    const query = queryParams.toString();
    return this.request<{ data: any[]; pagination: any }>(
      `/reports${query ? '?' + query : ''}`
    );
  }

  async getReport(id: string) {
    return this.request<any>(`/reports/${id}`);
  }

  async generateReport(data: { type: string; title: string; enterpriseId?: string }) {
    return this.request<any>('/reports/generate', { method: 'POST', body: data });
  }

  async deleteReport(id: string) {
    return this.request<any>(`/reports/${id}`, { method: 'DELETE' });
  }

  // Service Orders
  async getServiceOrders(params?: { page?: number; pageSize?: number; status?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.pageSize) queryParams.set('pageSize', params.pageSize.toString());
    if (params?.status) queryParams.set('status', params.status);

    const query = queryParams.toString();
    return this.request<{ data: any[]; pagination: any }>(
      `/service-orders${query ? '?' + query : ''}`
    );
  }

  async createServiceOrder(data: any) {
    return this.request<any>('/service-orders', { method: 'POST', body: data });
  }

  async updateServiceOrderStatus(id: string, status: string) {
    return this.request<any>(`/service-orders/${id}/status`, { 
      method: 'PUT', 
      body: { status } 
    });
  }

  // NFS Calculation
  async calculateNfs(calculations: any[]) {
    return this.request<any[]>('/nfs/calculate-batch', { 
      method: 'POST', 
      body: { calculations } 
    });
  }
}

export const api = new ApiClient();
export default api;
