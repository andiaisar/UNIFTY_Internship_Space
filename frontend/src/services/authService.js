import api from '../utils/axios';

const authService = {
  // Login
  login: async (nim_nip, password) => {
    const response = await api.post('/auth/login.php', {
      nim_nip,
      password,
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/auth/register.php', userData);
    return response.data; // Backend returns { success, message }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is logged in
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
