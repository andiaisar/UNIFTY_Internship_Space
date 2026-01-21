import api from '../utils/axios';

const logbookService = {
  // Create logbook entry
  create: async (data) => {
    const formData = new FormData();
    formData.append('tanggal', data.tanggal);
    formData.append('aktivitas', data.aktivitas);
    if (data.foto_kegiatan) {
      formData.append('foto_kegiatan', data.foto_kegiatan);
    }

    const response = await api.post('/logbook/create.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get user's logbooks
  getMyLogbooks: async (month, year) => {
    const response = await api.get('/logbook/my-logbooks.php', {
      params: { month, year },
    });
    return response.data.data;
  },

  // Get logbook detail
  getDetail: async (id) => {
    const response = await api.get(`/logbook/detail.php?id=${id}`);
    return response.data;
  },

  // Update logbook
  update: async (id, data) => {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('tanggal', data.tanggal);
    formData.append('aktivitas', data.aktivitas);
    if (data.foto_kegiatan) {
      formData.append('foto_kegiatan', data.foto_kegiatan);
    }

    const response = await api.post('/logbook/update.php', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete logbook
  delete: async (id) => {
    const response = await api.post('/logbook/delete.php', { id });
    return response.data;
  },
};

export default logbookService;
