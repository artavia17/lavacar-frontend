import { ApiResponse } from '../../shared/types';

export interface ApiDataSource {
  get<T>(endpoint: string): Promise<ApiResponse<T>>;
  post<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  put<T>(endpoint: string, data: any): Promise<ApiResponse<T>>;
  delete<T>(endpoint: string): Promise<ApiResponse<T>>;
}

export class HttpApiDataSource implements ApiDataSource {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`);
      const data = await response.json();
      
      return {
        data,
        success: response.ok,
        message: response.ok ? 'Success' : 'Error'
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      return {
        data: responseData,
        success: response.ok,
        message: response.ok ? 'Success' : 'Error'
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const responseData = await response.json();
      
      return {
        data: responseData,
        success: response.ok,
        message: response.ok ? 'Success' : 'Error'
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'DELETE',
      });
      
      const responseData = await response.json();
      
      return {
        data: responseData,
        success: response.ok,
        message: response.ok ? 'Success' : 'Error'
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}