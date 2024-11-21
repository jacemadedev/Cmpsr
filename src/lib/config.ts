const isDevelopment = import.meta.env.DEV;

export const config = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    apiUrl: '/.netlify/functions',
  },
  api: {
    baseUrl: isDevelopment ? '' : import.meta.env.VITE_APP_URL || '',
  },
} as const;
