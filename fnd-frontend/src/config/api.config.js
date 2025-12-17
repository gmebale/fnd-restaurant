// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://72.62.24.247:3001/api';


// Token storage keys
export const TOKEN_KEY = 'fnd_access_token';
export const REFRESH_TOKEN_KEY = 'fnd_refresh_token';
export const USER_KEY = 'fnd_user';

// Get stored token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Get stored refresh token
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

// Store tokens
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

// Remove tokens
export const removeTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// Store user
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Get stored user
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

