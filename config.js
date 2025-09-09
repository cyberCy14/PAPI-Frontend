// Backend configuration
export const API_BASE_URL = 'http://192.168.1.14:8000';

// API endpoints
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  LOGOUT: `${API_BASE_URL}/api/logout`,
  USER_PROFILE: `${API_BASE_URL}/api/profile`,
  COMPANIES: `${API_BASE_URL}/api/companies`,
  LOYALTY_PROGRAMS: `${API_BASE_URL}/api/loyalty-programs`,
  LOYALTY_RULES: `${API_BASE_URL}/api/loyalty-rules`,
  LOYALTY_TRANSACTIONS: `${API_BASE_URL}/api/loyalty-transaction`,
  REWARDS: `${API_BASE_URL}/api/rewards`,
  // New user loyalty endpoints
  USER_LOYALTY_SUMMARY: `${API_BASE_URL}/api/user/loyalty/summary`,
  USER_LOYALTY_TRANSACTIONS: `${API_BASE_URL}/api/user/loyalty/transactions`,
  USER_LOYALTY_REWARDS: `${API_BASE_URL}/api/user/loyalty/rewards`,
  USER_LOYALTY_REDEEM: `${API_BASE_URL}/api/user/loyalty/redeem`,
};

// Storage paths
export const STORAGE_PATHS = {
  PROFILE_IMAGES: `${API_BASE_URL}/storage/profile_images/`,
};