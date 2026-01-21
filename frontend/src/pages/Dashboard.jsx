import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import attendanceService from '../services/attendanceService';
import logbookService from '../services/logbookService';
import { formatDate, getGreeting } from '../utils/helpers';
import { FaCheckCircle, FaClock, FaBook, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [recentLogbooks, setRecentLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch today's attendance
      const attendanceData = await attendanceService.getTodayAttendance();
      setTodayAttendance(attendanceData);

      // Fetch statistics
      const statsData = await attendanceService.getStatistics();
      setStatistics(statsData);

      // Fetch recent logbooks
      const currentDate = new Date();
      const logbooksData = await logbookService.getMyLogbooks(
        currentDate.getMonth() + 1,
        currentDate.getFullYear()
      );
      setRecentLogbooks(logbooksData.slice(0, 5)); // Get latest 5

    } catch (error) {
      toast.error('Gagal memuat data dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Section */}
      <div className="welcome-section">
        <div className="welcome-content">
          <h2>{getGreeting()}, {user?.nama_lengkap}!</h2>
          <p>{formatDate(new Date())}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>{statistics?.total_hadir || 0}</h3>
            <p>Total Kehadiran</p>
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-content">
            <h3>{statistics?.total_logbook || 0}</h3>
            <p>Total Logbook</p>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>{statistics?.logbook_pending || 0}</h3>
            <p>Logbook Pending</p>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>{statistics?.attendance_percentage || 0}%</h3>
            <p>Persentase Kehadiran</p>
          </div>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="dashboard-section">
        <h3>Absensi Hari Ini</h3>
        {todayAttendance ? (
          <div className="attendance-card">
            <div className="attendance-info">
              <div className="info-item">
                <span className="label">Jam Masuk:</span>
                <span className="value">{todayAttendance.jam_masuk || '-'}</span>
              </div>
              <div className="info-item">
                <span className="label">Jam Keluar:</span>
                <span className="value">{todayAttendance.jam_keluar || '-'}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className={`badge badge-${todayAttendance.status.toLowerCase()}`}>
                  {todayAttendance.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <FaCalendarAlt />
            <p>Anda belum melakukan absensi hari ini</p>
            <a href="/absensi" className="btn btn-primary">Absen Sekarang</a>
          </div>
        )}
      </div>

      {/* Recent Logbooks */}
      <div className="dashboard-section">
        <div className="section-header">
          <h3>Logbook Terbaru</h3>
          <a href="/logbook" className="link">Lihat Semua</a>
        </div>
        {recentLogbooks.length > 0 ? (
          <div className="logbook-list">
            {recentLogbooks.map((logbook) => (
              <div key={logbook.id} className="logbook-item">
                <div className="logbook-date">
                  <FaCalendarAlt />
                  <span>{formatDate(logbook.tanggal)}</span>
                </div>
                <p className="logbook-activity">{logbook.aktivitas}</p>
                <span className={`badge badge-${logbook.status_validasi.toLowerCase()}`}>
                  {logbook.status_validasi}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <FaBook />
            <p>Belum ada logbook</p>
            <a href="/logbook" className="btn btn-primary">Buat Logbook</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
