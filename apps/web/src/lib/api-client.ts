const API_BASE_URL = typeof window !== 'undefined'
  ? '/api/v1'
  : (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000/api/v1');

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

      // Handle 401 Unauthorized - attempt token refresh
      if (res.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
        const refreshed = await this.tryRefreshToken();
        if (refreshed) {
          // Retry original request with fresh token
          const freshToken = this.getAccessToken();
          headers['Authorization'] = `Bearer ${freshToken}`;
          const retryRes = await fetch(url, { ...options, headers });
          const retryContentType = retryRes.headers.get('content-type') || '';
          if (retryContentType.includes('application/json')) {
            try {
              return await retryRes.json();
            } catch {
              // fallback below
            }
          }
          const retryText = await retryRes.text();
          return {
            success: false,
            statusCode: retryRes.status,
            data: null as any,
            message: `Server returned HTTP ${retryRes.status}: ${retryText.replace(/<[^>]*>?/gm, '').trim().slice(0, 150) || 'Non-JSON response'}`,
          };
        }
      }

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          const json = await res.json();
          return json;
        } catch (jsonErr: any) {
          return {
            success: false,
            statusCode: res.status,
            data: null as any,
            message: `Invalid JSON response from server (HTTP ${res.status}): ${jsonErr.message}`,
          };
        }
      }

      // Non-JSON response (e.g. HTML error page or plain text)
      const text = await res.text();
      const sanitizedText = text.replace(/<[^>]*>?/gm, '').trim();
      return {
        success: false,
        statusCode: res.status,
        data: null as any,
        message: res.status === 404
          ? 'API endpoint not found (404). Backend service or route handler is being reached.'
          : (sanitizedText ? sanitizedText.slice(0, 160) : `Server returned HTTP ${res.status}`),
      };
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
