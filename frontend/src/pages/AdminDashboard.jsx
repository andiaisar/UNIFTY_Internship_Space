import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FaUsers, 
  FaUserCheck, 
  FaClipboardList, 
  FaClock,
  FaCheckCircle, 
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    total_users: 0,
    active_users: 0,
    today_attendance: 0,
    pending_logbooks: 0,
    this_month_logbooks: 0,
    avg_work_hours: 0,
    latest_users: [],
    today_attendance_list: []
  });
  
  const [users, setUsers] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [validationModal, setValidationModal] = useState({
    show: false,
    logbook: null,
    status: '',
    catatan: ''
  });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Loading dashboard data...');
      
      const statsData = await adminService.getDashboardStats();
      console.log('Stats data received:', statsData);
      if (statsData && statsData.data) {
        setStats(statsData.data);
      }
      
      const usersData = await adminService.getUsers({ status: 'all', search: '' });
      console.log('Users data received:', usersData);
      if (usersData && usersData.data) {
        setUsers(usersData.data);
      }
      
      const logbooksData = await adminService.getLogbooks('Pending');
      console.log('Logbooks data received:', logbooksData);
      if (logbooksData && logbooksData.data) {
        setLogbooks(logbooksData.data);
      }
      
    } catch (error) {
      console.error('Error loading dashboard:', error);
      console.error('Error details:', error.response?.data);
      alert(`Gagal memuat data dashboard: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateLogbook = async () => {
    try {
      await adminService.validateLogbook(
        validationModal.logbook.logbook_id,
        validationModal.status,
        validationModal.catatan
      );
      
      const logbooksData = await adminService.getLogbooks('Pending');
      if (logbooksData && logbooksData.data) {
        setLogbooks(logbooksData.data);
      }
      
      closeValidationModal();
      alert(`Logbook berhasil ${validationModal.status.toLowerCase()}!`);
      loadDashboardData();
    } catch (error) {
      console.error('Error validating logbook:', error);
      alert('Gagal memvalidasi logbook');
    }
  };

  const openValidationModal = (logbook, status) => {
    setValidationModal({
      show: true,
      logbook: logbook,
      status: status,
      catatan: ''
    });
  };

  const closeValidationModal = () => {
    setValidationModal({
      show: false,
      logbook: null,
      status: '',
      catatan: ''
    });
  };

  // Data untuk grafik
  const statusData = [
    { name: 'Aktif', value: stats?.active_users || 0, color: '#10b981' },
    { name: 'Non-Aktif', value: (stats?.total_users || 0) - (stats?.active_users || 0), color: '#ef4444' }
  ];

  const logbookStatusData = [
    { name: 'Pending', value: stats?.pending_logbooks || 0, color: '#fbbf24' },
    { name: 'Disetujui', value: (stats?.this_month_logbooks || 0) - (stats?.pending_logbooks || 0), color: '#10b981' }
  ];

  const attendanceData = (stats?.today_attendance_list || []).map(att => ({
    name: att.nama_lengkap?.substring(0, 15) || 'Unknown',
    jam: att.waktu_masuk ? new Date(att.waktu_masuk).getHours() : 0
  }));

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Memuat dashboard admin...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-new">
      {/* Section: Statistics with Charts */}
      <section id="statistics" className="dashboard-section">
        <h2 className="section-title">
          <FaUsers /> Statistik & Grafik
        </h2>

        {/* Statistics Cards */}
        <div className="stats-cards-grid">
          <div className="stat-card-new blue">
            <div className="stat-icon-new">
              <FaUsers />
            </div>
            <div className="stat-info">
              <h3>{stats?.total_users || 0}</h3>
              <p>Total Peserta</p>
            </div>
          </div>

          <div className="stat-card-new green">
            <div className="stat-icon-new">
              <FaUserCheck />
            </div>
            <div className="stat-info">
              <h3>{stats?.active_users || 0}</h3>
              <p>Aktif</p>
            </div>
          </div>

          <div className="stat-card-new orange">
            <div className="stat-icon-new">
              <FaClipboardList />
            </div>
            <div className="stat-info">
              <h3>{stats?.today_attendance || 0}</h3>
              <p>Hadir Hari Ini</p>
            </div>
          </div>

          <div className="stat-card-new yellow">
            <div className="stat-icon-new">
              <FaHourglassHalf />
            </div>
            <div className="stat-info">
              <h3>{stats?.pending_logbooks || 0}</h3>
              <p>Pending Logbook</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Status Peserta Pie Chart */}
          <div className="chart-card">
            <h3>Status Peserta Magang</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Logbook Status Pie Chart */}
          <div className="chart-card">
            <h3>Status Logbook Bulan Ini</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={logbookStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {logbookStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Attendance Bar Chart */}
          <div className="chart-card full-width">
            <h3>Jam Kehadiran Hari Ini</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jam" fill="#667eea" name="Jam Masuk" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Section: Peserta Magang */}
      <section id="peserta" className="dashboard-section">
        <h2 className="section-title">
          <FaUsers /> Daftar Peserta Magang Terdaftar
        </h2>

        <div className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Lengkap</th>
                  <th>NIM/NIP</th>
                  <th>Email</th>
                  <th>No. Telepon</th>
                  <th>Status</th>
                  <th>Total Absensi</th>
                  <th>Total Logbook</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((userItem, index) => (
                    <tr key={userItem.user_id}>
                      <td>{index + 1}</td>
                      <td>{userItem.nama_lengkap || '-'}</td>
                      <td>{userItem.nim_nip || '-'}</td>
                      <td>{userItem.email || '-'}</td>
                      <td>{userItem.no_telepon || '-'}</td>
                      <td>
                        <span className={`status-badge ${userItem.status || 'nonaktif'}`}>
                          {userItem.status || 'nonaktif'}
                        </span>
                      </td>
                      <td className="text-center">{userItem.total_attendance || 0}</td>
                      <td className="text-center">{userItem.total_logbooks || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">Belum ada peserta magang terdaftar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section: Validasi Logbook */}
      <section id="validasi" className="dashboard-section">
        <h2 className="section-title">
          <FaClipboardList /> Validasi Logbook Pending
        </h2>

        <div className="logbook-grid">
          {logbooks.length > 0 ? (
            logbooks.map((logbook) => (
              <div key={logbook.logbook_id} className="logbook-card-new">
                <div className="logbook-header">
                  <div>
                    <h4>{logbook.nama_lengkap}</h4>
                    <p className="logbook-nim">{logbook.nim_nip}</p>
                  </div>
                  <span className="badge-pending">Pending</span>
                </div>

                <div className="logbook-body">
                  <div className="logbook-meta">
                    <p><FaClock /> {new Date(logbook.tanggal).toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                    <p><FaClock /> {logbook.waktu_mulai} - {logbook.waktu_selesai}</p>
                  </div>

                  <div className="logbook-description">
                    <strong>Kegiatan:</strong>
                    <p>{logbook.kegiatan}</p>
                  </div>

                  {logbook.foto_kegiatan && (
                    <div className="logbook-image">
                      <img 
                        src={`http://localhost/absensi-logbook-api/uploads/${logbook.foto_kegiatan}`} 
                        alt="Foto kegiatan" 
                      />
                    </div>
                  )}
                </div>

                <div className="logbook-actions">
                  <button 
                    className="btn-approve"
                    onClick={() => openValidationModal(logbook, 'Disetujui')}
                  >
                    <FaCheckCircle /> Setujui
                  </button>
                  <button 
                    className="btn-reject"
                    onClick={() => openValidationModal(logbook, 'Ditolak')}
                  >
                    <FaTimesCircle /> Tolak
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FaCheckCircle size={64} color="#10b981" />
              <h3>Tidak ada logbook pending</h3>
              <p>Semua logbook sudah divalidasi</p>
            </div>
          )}
        </div>
      </section>

      {/* Validation Modal */}
      {validationModal.show && (
        <div className="modal-overlay" onClick={closeValidationModal}>
          <div className="modal-content-new" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-new">
              <h2>{validationModal.status} Logbook</h2>
              <button className="modal-close" onClick={closeValidationModal}>×</button>
            </div>

            <div className="modal-body-new">
              <div className="logbook-preview">
                <p><strong>Nama:</strong> {validationModal.logbook?.nama_lengkap}</p>
                <p><strong>Tanggal:</strong> {new Date(validationModal.logbook?.tanggal).toLocaleDateString('id-ID')}</p>
                <p><strong>Kegiatan:</strong></p>
                <p className="kegiatan-text">{validationModal.logbook?.kegiatan}</p>
              </div>

              <div className="form-group">
                <label>Catatan (Opsional):</label>
                <textarea 
                  rows="4"
                  placeholder="Berikan catatan untuk logbook ini..."
                  value={validationModal.catatan}
                  onChange={(e) => setValidationModal({...validationModal, catatan: e.target.value})}
                />
              </div>
            </div>

            <div className="modal-footer-new">
              <button className="btn-cancel" onClick={closeValidationModal}>
                Batal
              </button>
              <button 
                className={validationModal.status === 'Disetujui' ? 'btn-approve' : 'btn-reject'}
                onClick={handleValidateLogbook}
              >
                {validationModal.status}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
