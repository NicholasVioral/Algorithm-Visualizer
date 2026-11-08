// Central place for backend configuration.
// Override at build/run time with a VITE_API_URL entry in a .env file.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
