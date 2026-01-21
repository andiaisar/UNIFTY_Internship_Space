import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaIdCard, FaUniversity, FaEnvelope, FaPhone, FaEdit, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_lengkap: user?.nama_lengkap || '',
    nim_nip: user?.nim_nip || '',
    kampus: user?.kampus || '',
    email: user?.email || '',
    no_telp: user?.no_telp || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement update profile API call
    setTimeout(() => {
      toast.success('Profil berhasil diupdate!');
      setEditMode(false);
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({
      nama_lengkap: user?.nama_lengkap || '',
      nim_nip: user?.nim_nip || '',
      kampus: user?.kampus || '',
      email: user?.email || '',
      no_telp: user?.no_telp || '',
    });
    setEditMode(false);
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h2>Profil Saya</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? 'Batal' : <><FaEdit /> Edit Profil</>}
        </button>
      </div>

      <div className="profile-container">
        {/* Profile Picture */}
        <div className="profile-picture-section">
          <div className="profile-picture">
            {user?.foto_profil ? (
              <img src={user.foto_profil} alt={user.nama_lengkap} />
            ) : (
              <FaUser />
            )}
          </div>
          {editMode && (
            <button className="btn btn-secondary btn-sm">
              Ubah Foto
            </button>
          )}
        </div>

        {/* Profile Information */}
        <div className="profile-info-section">
          <form onSubmit={handleSubmit}>
            <div className="info-group">
              <label>
                <FaUser className="info-icon" />
                Nama Lengkap
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="nama_lengkap"
                  value={formData.nama_lengkap}
                  onChange={handleChange}
                />
              ) : (
                <p>{user?.nama_lengkap}</p>
              )}
            </div>

            <div className="info-group">
              <label>
                <FaIdCard className="info-icon" />
                NIM / NIP
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="nim_nip"
                  value={formData.nim_nip}
                  onChange={handleChange}
                  disabled
                />
              ) : (
                <p>{user?.nim_nip}</p>
              )}
            </div>

            <div className="info-group">
              <label>
                <FaUniversity className="info-icon" />
                Kampus / Institusi
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="kampus"
                  value={formData.kampus}
                  onChange={handleChange}
                />
              ) : (
                <p>{user?.kampus || '-'}</p>
              )}
            </div>

            <div className="info-group">
              <label>
                <FaEnvelope className="info-icon" />
                Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{user?.email || '-'}</p>
              )}
            </div>

            <div className="info-group">
              <label>
                <FaPhone className="info-icon" />
                No. Telepon
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="no_telp"
                  value={formData.no_telp}
                  onChange={handleChange}
                />
              ) : (
                <p>{user?.no_telp || '-'}</p>
              )}
            </div>

            {editMode && (
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <FaSave /> {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
