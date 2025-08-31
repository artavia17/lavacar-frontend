import { httpClient } from '../http/HttpClient';
import { API_ENDPOINTS } from '../../shared/config/environment';

export interface Coupon {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  presentation_image_url: string;
  price: string;
  points: number;
  start_date: string | null;
  expiration_date: string | null;
  is_valid: boolean;
  is_alert: boolean;
  applicability_description: string;
  created_at: string;
  created_at_human: string;
}

export interface CouponResponse {
  success: boolean;
  data: Coupon[];
  meta: {
    limit: number;
    total: number;
    is_recent: boolean;
    filtered_for_vehicle: {
      license_plate: string;
      brand: string;
      type: string;
    };
  };
}

class CouponServiceClass {
  async getRecentCoupons(): Promise<CouponResponse> {
    try {
      console.log('🎟️ Loading recent coupons...');
      
      const response = await httpClient.get<CouponResponse>(
        API_ENDPOINTS.RECENT_COUPONS,
        true // Requires auth
      );

      console.log('📋 Recent coupons response:', response);
      
      if (!response.success) {
        const apiError = new Error(response.message || 'Error loading coupons');
        (apiError as any).response = { data: response };
        throw apiError;
      }

      return response;
    } catch (error) {
      console.error('❌ Error loading coupons:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const couponService = new CouponServiceClass();
export { CouponServiceClass };