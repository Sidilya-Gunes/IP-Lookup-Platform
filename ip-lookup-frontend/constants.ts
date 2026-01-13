export const API_BASE_URL = 'http://localhost:3002';

export const ENDPOINTS = {
  LOOKUP: `${API_BASE_URL}/lookup`,
  HISTORY: `${API_BASE_URL}/lookup/history`,
};

export const WILL_FAIL_MIXED_CONTENT = 
  typeof window !== 'undefined' && 
  window.location.protocol === 'https:' && 
  API_BASE_URL.startsWith('http:');
