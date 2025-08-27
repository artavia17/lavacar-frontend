export const AUTH_CONFIG = {
  BASE_URL: 'http://127.0.0.1:8000/api/v1',
  ENDPOINTS: {
    AGENT_ME: '/agent/me',
    ACCOUNT_ME: '/account',
    LOGIN: '/auth/login',
  },
  TOKEN_KEY: 'lavacar_token',
} as const;