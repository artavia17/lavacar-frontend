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

export interface UserVehicle {
  id: number;
  license_plate: string;
  year: number;
  color: string;
  is_active: boolean;
  is_primary: boolean;
  vehicle_description: string;
  brand: {
    id: number;
    name: string;
  };
  model: {
    id: number;
    name: string;
  };
  type: {
    id: number;
    name: string;
  };
  points: {
    total_earned: number;
    total_redeemed: number;
    available: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateVehicleRequest {
  vehicle_brand_id: number;
  vehicle_model_id: number;
  vehicle_type_id: number;
  license_plate: string;
  year: number;
  color?: string;
}

export interface CreateVehicleResponse {
  success: boolean;
  message: string;
  data: UserVehicle;
}

export interface UserAccount {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  profile_picture_url: string | null;
  has_profile_picture: boolean;
  is_active: boolean;
  registration_type: string;
  email_verified_at: string;
  created_at: string;
  vehicles?: UserVehicle[];
  category: {
    id: number | null;
    name: string;
    color: string;
    updated_at: string | null;
  };
  points: {
    total_earned: number;
    total_redeemed: number;
    available: number;
  };
  statistics: {
    total_vehicles: number;
    washes_last_3_months: number;
    transaction_breakdown: {
      total_transactions: number;
      washes: number;
      bonuses: number;
      redemptions: number;
      by_type: any[];
      by_operation: any[];
    };
  };
}

class VehicleServiceClass {

  async getBrands(): Promise<VehicleBrand[]> {
    try {
      console.log('🚗 Fetching vehicle brands...');
      
      const response = await httpClient.get<VehicleBrand[]>(
        API_ENDPOINTS.VEHICLE_BRANDS
      );

      console.log('📋 Brands response:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching brands:', error);
      throw error;
    }
  }

  async getModelsByBrand(brandId: string): Promise<VehicleModel[]> {
    try {
      console.log(`🚗 Fetching models for brand ${brandId}...`);
      
      const response = await httpClient.get<VehicleModelsResponse>(
        `${API_ENDPOINTS.VEHICLE_MODELS}?brand_id=${brandId}`
      );

      console.log('📋 Models response:', response);
      return response.data?.models || [];
    } catch (error) {
      console.error('❌ Error fetching models:', error);
      throw error;
    }
  }

  async getVehicleTypes(): Promise<VehicleType[]> {
    try {
      console.log('🚗 Fetching vehicle types...');
      
      const response = await httpClient.get<VehicleType[]>(
        API_ENDPOINTS.VEHICLE_TYPES
      );

      console.log('📋 Types response:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching vehicle types:', error);
      throw error;
    }
  }

  async getUserAccount(): Promise<UserAccount> {
    try {
      console.log('👤 Fetching user account...');
      
      const response = await httpClient.get<UserAccount>(
        API_ENDPOINTS.USER_ACCOUNT,
        true // Requires auth
      );

      console.log('📋 User account response:', response);
      return response.data!;
    } catch (error) {
      console.error('❌ Error fetching user account:', error);
      throw error;
    }
  }

  async getPrimaryVehicle(): Promise<UserVehicle> {
    try {
      console.log('🚗 Fetching primary vehicle...');
      
      const response = await httpClient.get<UserVehicle>(
        API_ENDPOINTS.PRIMARY_VEHICLE,
        true // Requires auth
      );

      console.log('📋 Primary vehicle response:', response);
      return response.data!;
    } catch (error) {
      console.error('❌ Error fetching primary vehicle:', error);
      throw error;
    }
  }

  async getUserVehicles(): Promise<UserVehicle[]> {
    try {
      console.log('🚗 Fetching user vehicles...');
      
      const response = await httpClient.get<UserVehicle[]>(
        API_ENDPOINTS.USER_VEHICLES,
        true // Requires auth
      );

      console.log('📋 User vehicles response:', response);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching user vehicles:', error);
      throw error;
    }
  }

  async createVehicle(vehicleData: CreateVehicleRequest): Promise<UserVehicle> {
    try {
      console.log('🚗 Creating vehicle...', vehicleData);
      
      const response = await httpClient.post<UserVehicle>(
        API_ENDPOINTS.CREATE_VEHICLE,
        vehicleData,
        true // Requires auth
      );

      console.log('📋 Create vehicle response:', response);
      
      if (!response.success) {
        // Create an error object that preserves the API response structure
        const apiError = new Error(response.message || 'Error creating vehicle');
        (apiError as any).response = { data: response };
        throw apiError;
      }

      if (!response.data) {
        throw new Error('No vehicle data received');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Error creating vehicle:', error);
      throw error;
    }
  }
}

// Export singleton instance and class
export const VehicleService = new VehicleServiceClass();
export const vehicleService = VehicleService;