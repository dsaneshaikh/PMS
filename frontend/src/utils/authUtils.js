// Utility functions for handling auth tokens and session management

// Save auth token to localStorage
export const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Get auth token from localStorage
export const getToken = () => {
  return localStorage.getItem('authToken');
};

// Remove auth token from localStorage
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getToken();
};
