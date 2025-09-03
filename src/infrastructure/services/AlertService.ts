import { httpClient, ApiResponse } from '../http/HttpClient';
import { API_ENDPOINTS } from '../../shared/config/environment';

export interface Alert {
  id: number;
  type: 'coupon' | 'alert';
  title: string;
  description: string;
  alert_image_url: string | null;
  link_url: string | null;
  has_link: boolean;
  has_image: boolean;
  priority: number;
  priority_label: string;
  start_date: string | null;
  expiration_date: string | null;
  is_valid: boolean;
  coupon_data?: {
    price: string;
    points: number;
  };
  created_at: string;
  updated_at: string;
}

export interface AlertsResponse {
  data: Alert[];
  meta: {
    total: number;
    normal_alerts: number;
    coupon_alerts: number;
    ordered_by: string;
  };
}

export class AlertService {
  async getAlerts(): Promise<ApiResponse<Alert[]>> {
    try {
      console.log('🔔 Loading user alerts...');
      
      const response = await httpClient.get<Alert[]>(
        API_ENDPOINTS.ALERTS,
        true // Requires auth
      );

      console.log('✅ Alerts loaded:', response);
      return response;
    } catch (error) {
      console.error('❌ Alerts service error:', error);
      return {
        success: false,
        message: 'Error al obtener alertas',
      };
    }
  }
}

// Export singleton instance
export const alertService = new AlertService();