import { MOCK_USER, MOCK_STATS, MOCK_LOGS } from './mockData';

// Simulated delay function to act like a real API
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (email, password) => {
  await delay(800); // Simulate network request
  if (email === 'admin@gateway.local' && password === 'password') {
    localStorage.setItem('auth_token', 'mock_token_123');
    return { success: true, user: MOCK_USER };
  }
  throw new Error('Invalid credentials');
};

export const logout = async () => {
  await delay(300);
  localStorage.removeItem('auth_token');
  return { success: true };
};

export const fetchDashboardStats = async () => {
  await delay(500);
  return MOCK_STATS;
};

export const fetchLogs = async () => {
  await delay(600);
  return MOCK_LOGS;
};
