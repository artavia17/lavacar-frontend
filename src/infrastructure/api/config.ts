// Configuración de API
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

// Endpoints
export const ENDPOINTS = {
  USERS: '/users',
  AUTH: '/auth',
  // Agregar más endpoints según necesidad
} as const;