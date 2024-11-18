// src/config/aeon.ts
export const AEON_CONFIG = {
    API_KEY: import.meta.env.VITE_AEON_API_KEY,
    API_URL: import.meta.env.VITE_AEON_API_URL,
    SUPPORTED_TOKENS: ['USDT', 'ETH'],
    DEFAULT_CURRENCY: 'USD'
  };