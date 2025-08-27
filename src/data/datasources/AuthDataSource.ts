import AsyncStorage from '@react-native-async-storage/async-storage';
import { AUTH_CONFIG } from '../../infrastructure/api/authConfig';
import { Agent } from '../../core/entities/Agent';
import { Account } from '../../core/entities/Account';
import { UserType } from '../../shared/types/auth';

export interface AuthDataSource {
  checkAgentAuth(): Promise<Agent | null>;
  checkAccountAuth(): Promise<Account | null>;
  getStoredToken(): Promise<string | null>;
  storeToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

export class HttpAuthDataSource implements AuthDataSource {
  async checkAgentAuth(): Promise<Agent | null> {
    try {
      const token = await this.getStoredToken();
      if (!token) return null;

      const response = await fetch(`${AUTH_CONFIG.BASE_URL}${AUTH_CONFIG.ENDPOINTS.AGENT_ME}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await this.clearToken();
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking agent auth:', error);
      return null;
    }
  }

  async checkAccountAuth(): Promise<Account | null> {
    try {
      const token = await this.getStoredToken();
      if (!token) return null;

      const response = await fetch(`${AUTH_CONFIG.BASE_URL}${AUTH_CONFIG.ENDPOINTS.ACCOUNT_ME}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        await this.clearToken();
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error checking account auth:', error);
      return null;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }

  async clearToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  }
}