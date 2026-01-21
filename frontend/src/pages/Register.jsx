import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaIdCard, FaUniversity, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../styles/Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    nim_nip: '',
    kampus: '',
    email: '',
    no_telp: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!formData.nama_lengkap || !formData.nim_nip || !formData.password) {
      toast.error('Nama, NIM/NIP, dan Password harus diisi!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }

    if (formData.password !== formData.confirm_password) {
      toast.error('Password dan konfirmasi password tidak cocok!');
      return;
    }

    setLoading(true);
    try {
      // Remove confirm_password before sending to API
      const { confirm_password, ...dataToSend } = formData;
      console.log('Sending registration data:', dataToSend);
      
      const response = await register(dataToSend);
      console.log('Registration response:', response);
      
      if (response.success) {
        toast.success(response.message || 'Registrasi berhasil! Silakan login.');
        navigate('/login');
      } else {
        toast.error(response.message || 'Registrasi gagal!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registrasi gagal! Coba lagi.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <div className="logo">
            <img src="/logo-mandiri.png" alt="Bank Mandiri" />
          </div>
          <h2>Daftar Akun Baru</h2>
          <p>Lengkapi data diri Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="nama_lengkap">Nama Lengkap *</label>
            <div className="input-with-icon">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="nama_lengkap"
                name="nama_lengkap"
                placeholder="Nama lengkap sesuai identitas"
                value={formData.nama_lengkap}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="nim_nip">NIM / NIP *</label>
            <div className="input-with-icon">
              <FaIdCard className="input-icon" />
              <input
                type="text"
                id="nim_nip"
                name="nim_nip"
                placeholder="Nomor induk mahasiswa/pegawai"
                value={formData.nim_nip}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="kampus">Kampus / Institusi</label>
            <div className="input-with-icon">
              <FaUniversity className="input-icon" />
              <input
                type="text"
                id="kampus"
                name="kampus"
                placeholder="Nama kampus atau institusi"
                value={formData.kampus}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="alamat@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="no_telp">No. Telepon</label>
            <div className="input-with-icon">
              <FaPhone className="input-icon" />
              <input
                type="tel"
                id="no_telp"
                name="no_telp"
                placeholder="08xx-xxxx-xxxx"
                value={formData.no_telp}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password">Konfirmasi Password *</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm_password"
                name="confirm_password"
                placeholder="Ulangi password"
                value={formData.confirm_password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Sudah punya akun? <Link to="/login">Login di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
