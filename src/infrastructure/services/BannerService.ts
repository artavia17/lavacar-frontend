import { API_ENDPOINTS } from '../../shared/config/environment';
import { httpClient } from '../http/HttpClient';

export interface Banner {
  id: number;
  title: string;
  description: string | null;
  banner_image_url: string;
  link_url: string | null;
  has_link: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

export interface BannerResponse {
  success: boolean;
  data: Banner[];
  meta: {
    total: number;
    active_banners: number;
  };
}

class BannerService {

  async getBanners(): Promise<Banner[]> {
    try {
      const response = await httpClient.get<BannerResponse>(API_ENDPOINTS.BANNERS, true); // requiresAuth = true
      
      if (!response.success) {
        throw new Error('Failed to fetch banners');
      }

      // Sort banners by order_position
      return response.data.sort((a, b) => a.order_position - b.order_position);
    } catch (error) {
      console.error('Error fetching banners:', error);
      throw error;
    }
  }

  /**
   * Determines if a URL is external (starts with http/https) or internal (relative path)
   */
  isExternalUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Handles banner navigation based on URL type
   */
  handleBannerNavigation(banner: Banner): { type: 'external' | 'internal' | 'none'; url?: string } {
    if (!banner.has_link || !banner.link_url) {
      return { type: 'none' };
    }

    const isExternal = this.isExternalUrl(banner.link_url);
    
    return {
      type: isExternal ? 'external' : 'internal',
      url: banner.link_url
    };
  }
}

export const bannerService = new BannerService();
export { BannerService };