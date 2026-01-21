import React, { useState, useEffect, useRef } from 'react';
import attendanceService from '../services/attendanceService';
import { formatDate, formatTime } from '../utils/helpers';
import { FaCamera, FaMapMarkerAlt, FaClock, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/Attendance.css';

const Attendance = () => {
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: null, long: null });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    fetchTodayAttendance();
    getLocation();
    
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    try {
      const data = await attendanceService.getTodayAttendance();
      setTodayAttendance(data);
    } catch (error) {
      // No attendance today is okay
      setTodayAttendance(null);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          toast.success('Lokasi berhasil didapatkan');
        },
        (error) => {
          toast.warning('Gagal mendapatkan lokasi. Lanjutkan tanpa lokasi?');
          console.error(error);
        }
      );
    } else {
      toast.error('Geolocation tidak didukung oleh browser Anda');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error('Gagal mengakses kamera. Pastikan izin kamera diaktifkan.');
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'attendance-photo.jpg', { type: 'image/jpeg' });
        setPhotoFile(file);
        setPhotoPreview(canvas.toDataURL('image/jpeg'));
        stopCamera();
        toast.success('Foto berhasil diambil');
      }, 'image/jpeg');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = async () => {
    if (!photoFile) {
      toast.error('Silakan ambil foto terlebih dahulu!');
      return;
    }

    if (!location.lat || !location.long) {
      if (!window.confirm('Lokasi tidak tersedia. Lanjutkan tanpa lokasi?')) {
        return;
      }
    }

    setLoading(true);
    try {
      const formData = {
        foto_bukti: photoFile,
        lokasi_lat: location.lat || '',
        lokasi_long: location.long || '',
      };

      await attendanceService.checkIn(formData);
      toast.success('Check-in berhasil!');
      setPhotoPreview(null);
      setPhotoFile(null);
      fetchTodayAttendance();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in gagal!');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayAttendance?.id) {
      toast.error('Tidak ada data check-in hari ini');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin check-out?')) {
      setLoading(true);
      try {
        await attendanceService.checkOut(todayAttendance.id);
        toast.success('Check-out berhasil!');
        fetchTodayAttendance();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Check-out gagal!');
      } finally {
        setLoading(false);
      }
    }
  };

  const canCheckIn = !todayAttendance;
  const canCheckOut = todayAttendance && !todayAttendance.jam_keluar;

  return (
    <div className="attendance-page">
      <div className="page-header">
        <h2>Absensi</h2>
        <p>{formatDate(new Date())}</p>
      </div>

      {/* Current Time */}
      <div className="current-time-card">
        <FaClock className="time-icon" />
        <div className="time-display">
          <h1>{currentTime.toLocaleTimeString('id-ID')}</h1>
          <p>Waktu Sekarang</p>
        </div>
      </div>

      {/* Today's Attendance Status */}
      {todayAttendance && (
        <div className="attendance-status-card">
          <div className="status-header">
            <FaCheckCircle className="check-icon" />
            <h3>Status Absensi Hari Ini</h3>
          </div>
          <div className="status-details">
            <div className="detail-item">
              <span className="label">Jam Masuk:</span>
              <span className="value">{formatTime(todayAttendance.jam_masuk)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Jam Keluar:</span>
              <span className="value">{formatTime(todayAttendance.jam_keluar)}</span>
            </div>
            <div className="detail-item">
              <span className="label">Status:</span>
              <span className={`badge badge-${todayAttendance.status.toLowerCase()}`}>
                {todayAttendance.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Camera Section */}
      {canCheckIn && (
        <div className="camera-section">
          <h3>Ambil Foto untuk Absensi</h3>
          
          {!cameraActive && !photoPreview && (
            <div className="camera-controls">
              <button className="btn btn-primary" onClick={startCamera}>
                <FaCamera /> Buka Kamera
              </button>
              <label className="btn btn-secondary">
                <FaCamera /> Upload Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          )}

          {cameraActive && (
            <div className="camera-preview">
              <video ref={videoRef} autoPlay playsInline></video>
              <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
              <div className="camera-actions">
                <button className="btn btn-primary" onClick={capturePhoto}>
                  <FaCamera /> Ambil Foto
                </button>
                <button className="btn btn-secondary" onClick={stopCamera}>
                  Batal
                </button>
              </div>
            </div>
          )}

          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
              <div className="preview-actions">
                <button className="btn btn-secondary" onClick={() => {
                  setPhotoPreview(null);
                  setPhotoFile(null);
                }}>
                  Ambil Ulang
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Location Info */}
      <div className="location-card">
        <FaMapMarkerAlt className="location-icon" />
        <div className="location-info">
          <h4>Lokasi</h4>
          {location.lat && location.long ? (
            <p>Lat: {location.lat.toFixed(6)}, Long: {location.long.toFixed(6)}</p>
          ) : (
            <p className="text-muted">Lokasi tidak tersedia</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {canCheckIn && (
          <button
            className="btn btn-success btn-lg"
            onClick={handleCheckIn}
            disabled={loading || !photoFile}
          >
            {loading ? 'Memproses...' : 'Check In'}
          </button>
        )}
        
        {canCheckOut && (
          <button
            className="btn btn-danger btn-lg"
            onClick={handleCheckOut}
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Check Out'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Attendance;
