import AsyncStorage from '@react-native-async-storage/async-storage';
import { httpClient, ApiResponse } from '../http/HttpClient';
import { API_ENDPOINTS } from '../../shared/config/environment';

export interface LoginRequest {
  email?: string;
  code?: string;
  password: string;
  userType: 'user' | 'agent';
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  vehicle_brand_id: string;
  vehicle_model_id: string;
  vehicle_type_id: string;
  vehicle_year: string;
  license_plate: string;
  phone: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface UserAccount {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  profile_picture_url: string;
  email_verified_at: string;
  created_at: string;
  last_login_at: string;
}

export interface LoginResponse {
  token: string;
  account: UserAccount;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface RegisterResponse {
  account_id: number;
  email: string;
  verification_required: boolean;
}

const USER_DATA_KEY = 'user_data';

export class AuthService {
  
  // User data storage methods
  async saveUserData(userData: UserAccount): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  async getUserData(): Promise<UserAccount | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async clearUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
  
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      // Choose endpoint based on user type
      const endpoint = credentials.userType === 'agent' 
        ? API_ENDPOINTS.AGENT_LOGIN 
        : API_ENDPOINTS.LOGIN;

      // Prepare request body based on user type
      const requestBody = credentials.userType === 'agent'
        ? { code: credentials.code, password: credentials.password }
        : { email: credentials.email, password: credentials.password };

      console.log(`🔐 Attempting ${credentials.userType} login to ${endpoint}:`, {
        ...requestBody,
        password: '***'
      });

      const response = await httpClient.post<LoginResponse>(
        endpoint,
        requestBody
      );

      // If login successful, save token and user data
      if (response.success && response.data) {
        await httpClient.saveAuthToken(response.data.token);
        await this.saveUserData(response.data.account);
      }

      return response;
    } catch (error: any) {
      console.error('❌ Login service error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      return {
        success: false,
        message: `Error de conexión: ${error.message}`,
      };
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    try {
      const response = await httpClient.post<RegisterResponse>(
        API_ENDPOINTS.REGISTER,
        userData
      );

      return response;
    } catch (error) {
      console.error('Register service error:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
      };
    }
  }

  async verifyEmail(verificationData: VerifyEmailRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await httpClient.post<LoginResponse>(
        API_ENDPOINTS.VERIFY_EMAIL,
        verificationData
      );

      // If verification successful, save token and user data
      if (response.success && response.data) {
        await httpClient.saveAuthToken(response.data.token);
        await this.saveUserData(response.data.account);
      }

      return response;
    } catch (error) {
      console.error('Verify email service error:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
      };
    }
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await httpClient.post<{ message: string }>(
        API_ENDPOINTS.FORGOT_PASSWORD,
        { email }
      );

      return response;
    } catch (error) {
      console.error('Forgot password service error:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
      };
    }
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await httpClient.post<{ message: string }>(
        API_ENDPOINTS.RESET_PASSWORD,
        { token, password }
      );

      return response;
    } catch (error) {
      console.error('Reset password service error:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
      };
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await httpClient.post<{ token: string }>(
        API_ENDPOINTS.REFRESH_TOKEN,
        {},
        true // Requires auth
      );

      // If refresh successful, save the new token
      if (response.success && response.data?.token) {
        await httpClient.saveAuthToken(response.data.token);
      }

      return response;
    } catch (error) {
      console.error('Refresh token service error:', error);
      return {
        success: false,
        message: 'Error interno del servidor',
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear the stored token and user data
      await httpClient.clearAuthToken();
      await this.clearUserData();
      
      // TODO: Call logout endpoint if needed
      // await httpClient.post('/auth/logout', {}, true);
    } catch (error) {
      console.error('Logout service error:', error);
    }
  }

  async getCurrentToken(): Promise<string | null> {
    return await httpClient.getToken();
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getCurrentToken();
    return !!token;
  }

  async checkUserAccount(): Promise<ApiResponse<UserAccount>> {
    try {
      const response = await httpClient.get<UserAccount>(
        API_ENDPOINTS.USER_ACCOUNT,
        true // Requires auth
      );

      return response;
    } catch (error) {
      console.error('Check user account service error:', error);
      return {
        success: false,
        message: 'Error al verificar cuenta de usuario',
        status: 401,
      };
    }
  }

  async checkAgentAccount(): Promise<ApiResponse<UserAccount>> {
    try {
      const response = await httpClient.get<UserAccount>(
        API_ENDPOINTS.AGENT_ACCOUNT,
        true // Requires auth
      );

      return response;
    } catch (error) {
      console.error('Check agent account service error:', error);
      return {
        success: false,
        message: 'Error al verificar cuenta de agente',
        status: 401,
      };
    }
  }

  async checkAuthenticationStatus(): Promise<{
    isAuthenticated: boolean;
    userType: 'user' | 'agent' | null;
    userData?: UserAccount;
  }> {
    try {
      // First check if we have a token
      const token = await this.getCurrentToken();
      if (!token) {
        return {
          isAuthenticated: false,
          userType: null,
        };
      }

      // Try to verify as user first
      const userResponse = await this.checkUserAccount();
      if (userResponse.success && userResponse.data) {
        // Save/update user data locally
        await this.saveUserData(userResponse.data);
        return {
          isAuthenticated: true,
          userType: 'user',
          userData: userResponse.data,
        };
      }

      // If user check fails, try as agent
      const agentResponse = await this.checkAgentAccount();
      if (agentResponse.success && agentResponse.data) {
        // Save/update agent data locally
        await this.saveUserData(agentResponse.data);
        return {
          isAuthenticated: true,
          userType: 'agent',
          userData: agentResponse.data,
        };
      }

      // If both fail, clear the invalid token and user data
      await httpClient.clearAuthToken();
      await this.clearUserData();
      return {
        isAuthenticated: false,
        userType: null,
      };
    } catch (error) {
      console.error('Check authentication status error:', error);
      // Clear token and user data on any error
      await httpClient.clearAuthToken();
      await this.clearUserData();
      return {
        isAuthenticated: false,
        userType: null,
      };
    }
  }
}

// Export singleton instance
export const authService = new AuthService();