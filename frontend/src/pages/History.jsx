import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import { formatDate, formatTime, getStatusColor } from '../utils/helpers';
import { FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/History.css';

const History = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchHistory();
  }, [selectedMonth, selectedYear]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await attendanceService.getHistory(selectedMonth, selectedYear);
      setAttendanceHistory(data);
    } catch (error) {
      toast.error('Gagal memuat riwayat absensi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page">
      <div className="page-header">
        <h2>Riwayat Absensi</h2>
        <p>Lihat riwayat kehadiran Anda</p>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <FaFilter className="filter-icon" />
        <div className="filter-group">
          <label>Bulan:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('id-ID', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Tahun:</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : attendanceHistory.length > 0 ? (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jam Masuk</th>
                <th>Jam Keluar</th>
                <th>Durasi</th>
                <th>Status</th>
                <th>Lokasi</th>
              </tr>
            </thead>
            <tbody>
              {attendanceHistory.map((record) => (
                <tr key={record.id}>
                  <td>
                    <FaCalendarAlt className="table-icon" />
                    {formatDate(record.tanggal)}
                  </td>
                  <td>{formatTime(record.jam_masuk)}</td>
                  <td>{formatTime(record.jam_keluar)}</td>
                  <td>{record.durasi_kerja ? `${record.durasi_kerja} menit` : '-'}</td>
                  <td>
                    <span className={`badge badge-${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    {record.lokasi_lat && record.lokasi_long ? (
                      <a
                        href={`https://www.google.com/maps?q=${record.lokasi_lat},${record.lokasi_long}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-link"
                      >
                        Lihat Map
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <FaCalendarAlt />
          <p>Tidak ada riwayat absensi untuk periode ini</p>
        </div>
      )}
    </div>
  );
};

export default History;
