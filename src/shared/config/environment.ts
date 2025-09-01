export const environment = {
  development: {
    API_BASE_URL: 'https://lavacar-back-office.codigtivo.com/api/v1',
    API_TIMEOUT: 10000,
  },
  production: {
    API_BASE_URL: 'https://api.lavacar.com/api/v1', // Cambiar cuando tengas el dominio de producción
    API_TIMEOUT: 10000,
  }
};

// Determinar el entorno actual
const isDevelopment = __DEV__;

export const config = isDevelopment ? environment.development : environment.production;

// Log configuration on startup
console.log('🔧 Environment config loaded:', {
  isDevelopment,
  API_BASE_URL: config.API_BASE_URL,
  API_TIMEOUT: config.API_TIMEOUT,
});

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  AGENT_LOGIN: '/auth/agent/login',
  REGISTER: '/auth/register', 
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Account verification endpoints
  USER_ACCOUNT: '/account',
  AGENT_ACCOUNT: '/agent/me',
  
  // User endpoints
  USER_PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  
  // Services endpoints
  SERVICES: '/services',
  BOOK_SERVICE: '/bookings',
  USER_BOOKINGS: '/user/bookings',
  
  // Vehicle endpoints
  USER_VEHICLES: '/account/vehicles',
  PRIMARY_VEHICLE: '/account/vehicles/primary',
  CREATE_VEHICLE: '/account/vehicles',
  UPDATE_VEHICLE: '/user/vehicles',
  
  // Public vehicle data endpoints
  VEHICLE_BRANDS: '/public/vehicles/brands',
  VEHICLE_MODELS: '/public/vehicles/models',
  VEHICLE_TYPES: '/public/vehicles/types',
  
  // Banner endpoints
  BANNERS: '/banners',
  
  // Coupon endpoints
  COUPONS: '/coupons',
  RECENT_COUPONS: '/coupons/recent',
  COUPON_DETAIL: '/coupons',
  
  // Redemption endpoints
  REDEMPTIONS: '/redemptions',
  
  // Transaction endpoints
  RECENT_TRANSACTIONS: '/account/transactions/recent',
};