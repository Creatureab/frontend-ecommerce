import { config } from './config';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = config.apiUrl;
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    console.log(`API Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      console.error('API Error:', error);
      throw new Error(this.formatErrorMessage(error, 'Request failed'));
    }

    const data = await response.json();
    console.log('API Response Data:', data);
    return data;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload method for file uploads
  async upload<T>(
    endpoint: string,
    formData: FormData,
    method: 'POST' | 'PUT' = 'POST',
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {};
    const hasToken = Boolean(this.token);

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.info('[api upload] starting request', {
      method,
      url,
      authorizationAttached: hasToken,
      fileCount: Array.from(formData.values()).filter((value) => typeof value !== 'string').length,
    });

    let response: Response;
    try {
      response = await fetch(url, {
        method,
        headers,
        body: formData,
      });
    } catch (error) {
      console.error('[api upload] network request failed', {
        method,
        url,
        authorizationAttached: hasToken,
        message: error instanceof Error ? error.message : 'Unknown network error',
      });
      throw error;
    }

    console.info('[api upload] response received', {
      method,
      url,
      status: response.status,
      ok: response.ok,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch (e) {
        error = { message: errorText || 'Upload failed' };
      }
      console.error('[api upload] request rejected', {
        method,
        url,
        status: response.status,
        message: this.formatErrorMessage(error, 'Upload failed'),
      });
      throw new Error(this.formatErrorMessage(error, 'Upload failed'));
    }

    return response.json();
  }

  private formatErrorMessage(error: any, fallback: string): string {
    if (error?.message) {
      return error.message;
    }

    if (Array.isArray(error?.errors)) {
      return error.errors.map((entry: { msg?: string }) => entry.msg).filter(Boolean).join(', ');
    }

    return fallback;
  }
}

export const apiClient = new ApiClient();
