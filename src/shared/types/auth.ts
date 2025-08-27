import { Agent } from '../../core/entities/Agent';
import { Account } from '../../core/entities/Account';

export type UserType = 'agent' | 'user' | null;

export interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  user: Agent | Account | null;
  token: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Agent | Account;
}