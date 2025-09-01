import { httpClient, ApiResponse } from '../http/HttpClient';
import { API_ENDPOINTS, config } from '../../shared/config/environment';

export interface AgentTransaction {
  id: number;
  type: 'redemption' | 'coupon';
  transaction_type: string;
  status: string;
  account_id: number;
  item_id: number;
  item_title: string;
  license_plate: string;
  value: string | null;
  points: number;
  points_before?: number;
  points_after?: number;
  notes: string | null;
  transaction_date: string;
  created_at: string;
}

export interface AgentTransactionsResponse {
  data: AgentTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
    date_from: string | null;
    date_to: string | null;
  };
}

export interface ClaimCouponRequest {
  license_plate: string;
  coupon_id: string;
}

export interface ClaimRedemptionRequest {
  license_plate: string;
  redemption_id: string;
}

export interface ClaimCouponResponse {
  transaction: {
    id: number;
    transaction_type: string;
    status: string | null;
    transaction_date: string | null;
    notes: string | null;
  };
  coupon: {
    id: number;
    title: string;
    description: string;
    price: string;
    points: number;
  };
  account: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    id: number;
    license_plate: string;
    brand: string;
    type: string;
    points: number;
    available_points: number;
  };
  agent: {
    id: number;
    code: string;
    name: string;
  };
}

export interface ClaimRedemptionResponse {
  transaction: {
    id: number;
    transaction_type: string;
    status: string | null;
    transaction_date: string | null;
    notes: string | null;
  };
  redemption: {
    id: number;
    title: string;
    description: string;
    points_required: number;
  };
  account: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  vehicle: {
    id: number;
    license_plate: string;
    brand: string;
    type: string;
    points: number;
    available_points: number;
  };
  agent: {
    id: number;
    code: string;
    name: string;
  };
}

export class AgentTransactionService {
  async getTransactions(limit?: number): Promise<ApiResponse<AgentTransactionsResponse>> {
    try {
      console.log(`🔄 Loading ${limit || 'all'} agent transactions...`);
      
      // Use direct fetch with longer timeout for transactions
      const token = await httpClient.getToken();
      if (!token) {
        return {
          success: false,
          message: 'No se encontró token de autenticación',
        };
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

      const endpoint = limit ? `${config.API_BASE_URL}${API_ENDPOINTS.AGENT_TRANSACTIONS}?limit=${limit}` : `${config.API_BASE_URL}${API_ENDPOINTS.AGENT_TRANSACTIONS}`;
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Error al obtener transacciones',
          status: response.status,
        };
      }

      return {
        success: true,
        data: data,
        message: data.message,
        status: response.status,
      };
    } catch (error: any) {
      console.error('Agent transactions service error:', error);
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'La carga de transacciones está tardando más de lo normal. Intenta de nuevo.',
        };
      }
      
      return {
        success: false,
        message: 'Error al obtener transacciones del agente',
      };
    }
  }

  async getRecentTransactions(): Promise<ApiResponse<AgentTransaction[]>> {
    try {
      const response = await httpClient.get<any>(
        `${API_ENDPOINTS.AGENT_TRANSACTIONS}?limit=3`,
        true // Requires auth
      );
      
      if (response.success && response.data) {
        // The API returns { data: [...], meta: {...}, success: true }
        // We need to extract the data array
        const transactions = response.data.data || response.data;
        return {
          success: true,
          data: Array.isArray(transactions) ? transactions : [],
          message: response.message,
        };
      }

      return {
        success: false,
        message: response.message || 'Error al obtener transacciones recientes',
      };
    } catch (error) {
      console.error('Recent agent transactions error:', error);
      return {
        success: false,
        message: 'Error al obtener transacciones recientes',
      };
    }
  }

  async claimCoupon(request: ClaimCouponRequest): Promise<ApiResponse<ClaimCouponResponse>> {
    try {
      console.log('🎫 Processing coupon claim:', request);
      
      const response = await httpClient.post<ClaimCouponResponse>(
        API_ENDPOINTS.CLAIM_COUPON,
        request,
        true // Requires auth
      );

      console.log('✅ Coupon claim response:', response);
      return response;
    } catch (error) {
      console.error('❌ Coupon claim error:', error);
      return {
        success: false,
        message: 'Error al procesar el canje del cupón',
      };
    }
  }

  async claimRedemption(request: ClaimRedemptionRequest): Promise<ApiResponse<ClaimRedemptionResponse>> {
    try {
      console.log('💰 Processing redemption claim:', request);
      
      const response = await httpClient.post<ClaimRedemptionResponse>(
        API_ENDPOINTS.CLAIM_REDEMPTION,
        request,
        true // Requires auth
      );

      console.log('✅ Redemption claim response:', response);
      return response;
    } catch (error) {
      console.error('❌ Redemption claim error:', error);
      return {
        success: false,
        message: 'Error al procesar el canje de la redención',
      };
    }
  }
}

// Export singleton instance
export const agentTransactionService = new AgentTransactionService();