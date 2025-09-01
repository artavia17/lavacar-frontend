import { httpClient, ApiResponse } from '../http/HttpClient';
import { API_ENDPOINTS, config } from '../../shared/config/environment';

export interface AgentData {
  id: number;
  code: string;
  name: string;
  description: string;
  location: string;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
}

export interface AgentStats {
  total_coupon_transactions: number;
  total_redemption_transactions: number;
  total_transactions: number;
  transactions_today: number;
  transactions_this_week: number;
  last_transaction_date: string;
}

export interface AgentProfileResponse {
  agent: AgentData;
  stats: AgentStats;
}

export class AgentProfileService {
  async getAgentProfile(): Promise<ApiResponse<AgentProfileResponse>> {
    try {
      console.log('🔄 Loading agent profile...');
      
      const response = await httpClient.get<any>(
        API_ENDPOINTS.AGENT_ACCOUNT,
        true // Requires auth
      );

      if (response.success && response.data) {
        console.log('✅ Agent profile loaded successfully');
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      }

      return {
        success: false,
        message: response.message || 'Error al obtener perfil del agente',
      };
    } catch (error: any) {
      console.error('Agent profile service error:', error);
      return {
        success: false,
        message: 'Error al obtener perfil del agente',
      };
    }
  }
}

// Export singleton instance
export const agentProfileService = new AgentProfileService();