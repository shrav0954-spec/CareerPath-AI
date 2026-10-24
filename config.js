/**
 * Application Configuration
 *
 * Configures the backend API endpoint.
 * To point to your deployed Render backend:
 * Update frontend/.env with:
 * VITE_API_BASE_URL=https://<your-service>.onrender.com
 */

const rawApiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Remove any trailing slashes
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

export const ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/api/health`,
  ANALYZE: `${API_BASE_URL}/api/analyze`,
  ANALYZE_TEXT: `${API_BASE_URL}/api/analyze-text`,
  ROOT: `${API_BASE_URL}/`,
};

export default {
  API_BASE_URL,
  ENDPOINTS,
};
