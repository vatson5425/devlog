import { Storage } from './storage';

const isLocal =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.startsWith('10.') ||
  window.location.hostname.startsWith('192.168.') ||
  window.location.hostname.startsWith('172.') ||
  window.location.port === '5173' ||
  window.location.port === '3000';

export const API_BASE_URL = isLocal
  ? 'http://localhost:5000/api'
  : 'https://devlog-api.onrender.com/api';

export function getAuthHeaders() {
  const token = Storage.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}


