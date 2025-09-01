import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../../shared/config/environment';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface HttpClientConfig {
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL || '';
    this.timeout = config.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...config.headers,
    };
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return token ? { 'Authorization': `Bearer ${token}` } : {};
    } catch (error) {
      console.error('Error getting auth token:', error);
      return {};
    }
  }

  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    options: { requiresAuth?: boolean; headers?: Record<string, string> } = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = false, headers: customHeaders = {} } = options;
    
    try {
      const authHeaders = requiresAuth ? await this.getAuthHeaders() : {};
      
      const headers = {
        ...this.defaultHeaders,
        ...authHeaders,
        ...customHeaders,
      };

      const fullUrl = `${this.baseURL}${endpoint}`;
      
      console.log(`🌐 HTTP ${method} ${fullUrl}`);
      console.log('📋 Headers:', headers);
      console.log('📦 Body:', data ? JSON.stringify(data, null, 2) : 'undefined');

      const requestOptions: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(fullUrl, {
        ...requestOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      const responseData = await response.json();
      
      console.log(`📄 Response data:`, responseData);

      if (!response.ok) {
        console.log(`❌ Request failed with status ${response.status}`);
        
        // Handle 401 Unauthorized - only if we're making an authenticated request and it's not a login endpoint
        if (response.status === 401 && requiresAuth && !endpoint.includes('/login')) {
          console.log('🔒 Token expired, clearing auth data and redirecting to login');
          await this.handleTokenExpiration();
        }
        
        return {
          success: false,
          message: responseData.message || 'Ha ocurrido un error',
          errors: responseData.errors,
          status: response.status,
        };
      }

      console.log(`✅ Request successful`);
      return {
        success: true,
        data: responseData.data || responseData,
        message: responseData.message,
        status: response.status,
      };
    } catch (error: any) {
      console.error(`❌ HTTP ${method} ${endpoint} error:`, error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'La petición ha tardado demasiado. Verifica tu conexión.',
          status: 408,
        };
      }

      return {
        success: false,
        message: error.message || 'Error de conexión. Verifica tu internet.',
        status: 500,
      };
    }
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, { requiresAuth });
  }

  async post<T>(endpoint: string, data?: any, requiresAuth = false): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data, { requiresAuth });
  }

  async put<T>(endpoint: string, data?: any, requiresAuth = false): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data, { requiresAuth });
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, { requiresAuth });
  }

  // Method to save auth token
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error saving auth token:', error);
    }
  }

  // Method to clear auth token
  async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  // Method to get current auth token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Handle token expiration by clearing data and redirecting to login
  private async handleTokenExpiration(): Promise<void> {
    try {
      // Clear all auth-related data
      await this.clearAuthToken();
      await AsyncStorage.removeItem('user_data');
      
      // Import router dynamically to avoid circular dependencies
      const { router } = await import('expo-router');
      
      // Redirect to login screen
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error handling token expiration:', error);
    }
  }
}

// Create and export a singleton instance
export const httpClient = new HttpClient({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
});