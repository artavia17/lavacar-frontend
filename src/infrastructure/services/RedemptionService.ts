import { API_ENDPOINTS } from '../../shared/config/environment';
import { httpClient } from '../http/HttpClient';

export interface Redemption {
  id: number;
  title: string;
  description: string;
  points: number;
  cover_image_url: string;
  presentation_image_url: string;
  background_image_url: string;
  user_can_redeem: boolean;
  created_at: string;
  created_at_human: string;
  points_required: number;
}

export interface RedemptionResponse {
  success: boolean;
  data: Redemption[];
  meta: {
    limit: number;
    total: number;
  };
}

class RedemptionServiceClass {
  async getRedemptions(): Promise<RedemptionResponse> {
    try {
      console.log('🎁 Loading redemptions...');
      
      const response = await httpClient.get<RedemptionResponse>(
        API_ENDPOINTS.REDEMPTIONS,
        true // Requires auth
      );

      console.log('📋 Redemptions response:', response);
      
      if (!response.success) {
        const apiError = new Error(response.message || 'Error loading redemptions');
        (apiError as any).response = { data: response };
        throw apiError;
      }

      return response;
    } catch (error) {
      console.error('❌ Error loading redemptions:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const redemptionService = new RedemptionServiceClass();
export { RedemptionServiceClass };
