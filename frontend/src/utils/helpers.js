// Format date to Indonesian format
export const formatDate = (date) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(date).toLocaleDateString('id-ID', options);
};

// Format date to YYYY-MM-DD
export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format time to HH:MM
export const formatTime = (time) => {
  if (!time) return '-';
  return time.substring(0, 5);
};

// Get greeting based on time
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 10) return 'Selamat Pagi';
  if (hour < 15) return 'Selamat Siang';
  if (hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
};

// Calculate duration between two times
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '-';
  
  const start = new Date(`2000-01-01 ${startTime}`);
  const end = new Date(`2000-01-01 ${endTime}`);
  const diff = Math.abs(end - start) / 1000 / 60; // in minutes
  
  const hours = Math.floor(diff / 60);
  const minutes = Math.floor(diff % 60);
  
  return `${hours} jam ${minutes} menit`;
};

// Get status badge color
export const getStatusColor = (status) => {
  switch (status) {
    case 'Hadir':
      return 'success';
    case 'Izin':
      return 'warning';
    case 'Sakit':
      return 'info';
    case 'Alpha':
      return 'danger';
    default:
      return 'secondary';
  }
};

// Get validation status badge color
export const getValidationColor = (status) => {
  switch (status) {
    case 'Disetujui':
      return 'success';
    case 'Ditolak':
      return 'danger';
    case 'Pending':
      return 'warning';
    default:
      return 'secondary';
  }
};
