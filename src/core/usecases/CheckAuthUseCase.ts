import { AuthDataSource } from '../../data/datasources/AuthDataSource';
import { Agent } from '../entities/Agent';
import { Account } from '../entities/Account';
import { UserType } from '../../shared/types/auth';

export interface AuthResult {
  isAuthenticated: boolean;
  userType: UserType;
  user: Agent | Account | null;
}

export class CheckAuthUseCase {
  constructor(private authDataSource: AuthDataSource) {}

  async execute(): Promise<AuthResult> {
    try {
      // Primero verifica si es un agente
      const agent = await this.authDataSource.checkAgentAuth();
      if (agent) {
        return {
          isAuthenticated: true,
          userType: 'agent',
          user: agent,
        };
      }

      // Si no es agente, verifica si es una cuenta normal
      const account = await this.authDataSource.checkAccountAuth();
      if (account) {
        return {
          isAuthenticated: true,
          userType: 'user',
          user: account,
        };
      }

      // No está autenticado
      return {
        isAuthenticated: false,
        userType: null,
        user: null,
      };
    } catch (error) {
      console.error('Error in CheckAuthUseCase:', error);
      return {
        isAuthenticated: false,
        userType: null,
        user: null,
      };
    }
  }
}