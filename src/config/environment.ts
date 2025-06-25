/// <reference types="vite/client" />

// Environment configuration for API URLs
const getApiBaseUrl = () => {
    // Check if we're in development mode
    if (import.meta.env.DEV) {
        return 'http://localhost:3000';
    }

    // For production, you can set this via environment variable
    // or hardcode your production backend URL
    return import.meta.env.VITE_API_BASE_URL || 'https://your-backend-domain.com';
};

export const config = {
    apiBaseUrl:
        import.meta.env.VITE_API_BASE_URL ||
        (window?.location?.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://erm-be.onrender.com'),
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
}; 