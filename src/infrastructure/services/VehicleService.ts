import { httpClient, ApiResponse } from '../http/HttpClient';
import { API_ENDPOINTS } from '../../shared/config/environment';

export interface VehicleBrand {
  id: number;
  name: string;
  logo_url: string;
}

export interface VehicleModel {
  id: number;
  name: string;
  brand_id: number;
  vehicle_type_id: number;
  vehicle_type_name: string;
  year: number;
}

export interface VehicleType {
  id: number;
  name: string;
  description: string;
}

export interface VehicleModelsResponse {
  brand: {
    id: number;
    name: string;
  };
  models: VehicleModel[];
}

export class VehicleService {

  async getBrands(): Promise<ApiResponse<VehicleBrand[]>> {
    try {
      console.log('🚗 Fetching vehicle brands...');
      
      const response = await httpClient.get<VehicleBrand[]>(
        API_ENDPOINTS.VEHICLE_BRANDS
      );

      console.log('📋 Brands response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching brands:', error);
      return {
        success: false,
        message: 'Error al cargar las marcas de vehículos',
      };
    }
  }

  async getModelsByBrand(brandId: number): Promise<ApiResponse<VehicleModelsResponse>> {
    try {
      console.log(`🚗 Fetching models for brand ${brandId}...`);
      
      const response = await httpClient.get<VehicleModelsResponse>(
        `${API_ENDPOINTS.VEHICLE_MODELS}?brand_id=${brandId}`
      );

      console.log('📋 Models response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching models:', error);
      return {
        success: false,
        message: 'Error al cargar los modelos de vehículos',
      };
    }
  }

  async getVehicleTypes(): Promise<ApiResponse<VehicleType[]>> {
    try {
      console.log('🚗 Fetching vehicle types...');
      
      const response = await httpClient.get<VehicleType[]>(
        API_ENDPOINTS.VEHICLE_TYPES
      );

      console.log('📋 Types response:', response);
      return response;
    } catch (error) {
      console.error('❌ Error fetching vehicle types:', error);
      return {
        success: false,
        message: 'Error al cargar los tipos de vehículos',
      };
    }
  }
}

// Export singleton instance
export const vehicleService = new VehicleService();