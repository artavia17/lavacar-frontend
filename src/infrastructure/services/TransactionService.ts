import { API_ENDPOINTS } from '../../shared/config/environment';
import { httpClient } from '../http/HttpClient';

export interface Transaction {
  id: number;
  transaction_type: string;
  transaction_type_display: string;
  points_amount: number;
  points_operation: string;
  points_operation_display: string;
  formatted_points: string;
  description: string;
  vehicle: {
    id: number;
    license_plate: string;
    vehicle_description: string;
    brand_name: string;
    model_name: string;
  };
  related_item: {
    type: string;
    id: number;
    points: number | null;
    description: string | null;
  };
  metadata: any;
  created_at: string;
  created_at_human: string;
}

export interface TransactionStats {
  total_transactions: number;
  total_coupons: number;
  total_redemptions: number;
  total_bonuses: number;
  total_points_earned: string;
  total_points_spent: number;
  net_points: number;
}

export interface TransactionPeriod {
  months: string;
  from_date: string;
  to_date: string;
}

export interface TransactionPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface RecentTransactionsResponse {
  success: boolean;
  data: Transaction[];
  period: TransactionPeriod;
  stats: TransactionStats;
  pagination: TransactionPagination;
}

class TransactionServiceClass {
  async getRecentTransactions(months: number = 6): Promise<RecentTransactionsResponse> {
    try {
      console.log(`📊 Loading recent transactions for ${months} months...`);
      
      const response = await httpClient.get<RecentTransactionsResponse>(
        `${API_ENDPOINTS.RECENT_TRANSACTIONS}?months=${months}`,
        true // Requires auth
      );

      console.log('📋 Recent transactions response:', response);
      
      if (!response.success) {
        const apiError = new Error(response.message || 'Error loading transactions');
        (apiError as any).response = { data: response };
        throw apiError;
      }

      return response;
    } catch (error) {
      console.error('❌ Error loading recent transactions:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const transactionService = new TransactionServiceClass();
export { TransactionServiceClass };