// DevFolio API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7175/api/v1', // Pas aan naar jouw backend URL
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      PROFILE: '/auth/profile'
    },
    PROJECTS: {
      LIST: '/projects',
      CREATE: '/projects',
      UPDATE: (id: number) => `/projects/${id}`,
      DELETE: (id: number) => `/projects/${id}`,
      GET: (id: number) => `/projects/${id}`
    }
  },
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'devfolio_access_token',
    REFRESH_TOKEN: 'devfolio_refresh_token',
    USER_PROFILE: 'devfolio_user_profile'
  }
} as const;
