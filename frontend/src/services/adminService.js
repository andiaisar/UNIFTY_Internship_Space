import axios from '../utils/axios';

const adminService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    const response = await axios.get('/admin/dashboard-stats.php');
    return response.data;
  },

  // Get all users with filters
  getUsers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const response = await axios.get(`/admin/users.php?${params.toString()}`);
    return response.data;
  },

  // Update user status
  updateUserStatus: async (userId, status) => {
    const response = await axios.post('/admin/update-user-status.php', {
      user_id: userId,
      status: status
    });
    return response.data;
  },

  // Get logbooks with filter
  getLogbooks: async (statusFilter = 'Pending') => {
    const response = await axios.get(`/admin/pending-logbooks.php?status=${statusFilter}`);
    return response.data;
  },

  // Validate logbook
  validateLogbook: async (logbookId, status, catatan = '') => {
    const response = await axios.post('/admin/validate-logbook.php', {
      logbook_id: logbookId,
      status: status,
      catatan: catatan
    });
    return response.data;
  },

  // Get attendance by date
  getAttendance: async (date = null, userId = null) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (userId) params.append('user_id', userId);
    
    const response = await axios.get(`/admin/attendance.php?${params.toString()}`);
    return response.data;
  }
};

export default adminService;
