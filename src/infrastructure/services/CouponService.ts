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

export interface CouponDetail extends Coupon {
  vehicle_brands: any[];
  vehicle_types: any[];
  plate_ending_filter: string;
  applies_to_your_vehicle: boolean;
  your_vehicle: {
    license_plate: string;
    brand: string;
    type: string;
  };
  updated_at: string;
}

export interface CouponDetailResponse {
  success: boolean;
  data: CouponDetail;
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
  async getAllCoupons(): Promise<CouponResponse> {
    try {
      console.log('🎟️ Loading all coupons...');
      
      const response = await httpClient.get<CouponResponse>(
        API_ENDPOINTS.COUPONS,
        true // Requires auth
      );

      console.log('📋 All coupons response:', response);
      
      if (!response.success) {
        const apiError = new Error(response.message || 'Error loading coupons');
        (apiError as any).response = { data: response };
        throw apiError;
      }

      return response;
    } catch (error) {
      console.error('❌ Error loading all coupons:', error);
      throw error;
    }
  }

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

  async getCouponDetail(couponId: number): Promise<CouponDetailResponse> {
    try {
      console.log('🎟️ Loading coupon detail for ID:', couponId);
      
      const response = await httpClient.get<CouponDetailResponse>(
        `${API_ENDPOINTS.COUPON_DETAIL}/${couponId}`,
        true // Requires auth
      );

      console.log('📋 Coupon detail response:', response);
      
      if (!response.success) {
        const apiError = new Error(response.message || 'Error loading coupon detail');
        (apiError as any).response = { data: response };
        throw apiError;
      }

      return response;
    } catch (error) {
      console.error('❌ Error loading coupon detail:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const couponService = new CouponServiceClass();
export { CouponServiceClass };