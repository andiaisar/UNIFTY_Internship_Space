import api from '../utils/axios';

const attendanceService = {
  // Check-in (Masuk)
  checkIn: async (data) => {
    const formData = new FormData();
    formData.append('foto_bukti', data.foto_bukti);
    formData.append('lokasi_lat', data.lokasi_lat);
    formData.append('lokasi_long', data.lokasi_long);

    const response = await api.post('/attendance/checkin.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Check-out (Keluar)
  checkOut: async (attendance_id) => {
    const response = await api.post('/attendance/checkout.php', {
      attendance_id,
    });
    return response.data;
  },

  // Get today's attendance
  getTodayAttendance: async () => {
    const response = await api.get('/attendance/today.php');
    return response.data.data;
  },

  // Get attendance history
  getHistory: async (month, year) => {
    const response = await api.get('/attendance/history.php', {
      params: { month, year },
    });
    return response.data.data;
  },

  // Get attendance statistics
  getStatistics: async () => {
    const response = await api.get('/attendance/statistics.php');
    return response.data.data;
  },
};

export default attendanceService;
