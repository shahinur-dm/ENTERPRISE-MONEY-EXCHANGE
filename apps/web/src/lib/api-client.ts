const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  data: T;
  meta?: any;
  message?: string;
  errorCode?: string;
}

export class ApiClient {
  private static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('erp_access_token');
  }

  private static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('erp_refresh_token');
  }

  static setTokens(accessToken: string, refreshToken: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem('erp_access_token', accessToken);
    localStorage.setItem('erp_refresh_token', refreshToken);
  }

  static clearTokens() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('erp_access_token');
    localStorage.removeItem('erp_refresh_token');
    localStorage.removeItem('erp_user');
  }

  static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getAccessToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json();

      // Handle 401 Unauthorized - attempt token refresh
      if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry original request with fresh token
          const freshToken = this.getAccessToken();
          headers['Authorization'] = `Bearer ${freshToken}`;
          const retryRes = await fetch(url, { ...options, headers });
          return await retryRes.json();
        }
      }

      return json;
    } catch (err: any) {
      return {
        success: false,
        statusCode: 500,
        data: null as any,
        message: err.message || 'Network connection to ERP API failed',
      };
    }
  }

  private static async tryRefreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await res.json();
      if (data.success && data.data?.accessToken) {
        this.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }
      this.clearTokens();
      return false;
    } catch {
      this.clearTokens();
      return false;
    }
  }
}
