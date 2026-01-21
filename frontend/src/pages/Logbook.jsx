import React, { useState, useEffect } from 'react';
import logbookService from '../services/logbookService';
import { formatDate, formatDateForInput, getValidationColor } from '../utils/helpers';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import '../styles/Logbook.css';

const Logbook = () => {
  const [logbooks, setLogbooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [formData, setFormData] = useState({
    id: null,
    tanggal: formatDateForInput(new Date()),
    aktivitas: '',
    foto_kegiatan: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchLogbooks();
  }, [selectedMonth, selectedYear]);

  const fetchLogbooks = async () => {
    setLoading(true);
    try {
      const data = await logbookService.getMyLogbooks(selectedMonth, selectedYear);
      setLogbooks(data);
    } catch (error) {
      toast.error('Gagal memuat logbook');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        foto_kegiatan: file,
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tanggal || !formData.aktivitas) {
      toast.error('Tanggal dan aktivitas harus diisi!');
      return;
    }

    setLoading(true);
    try {
      if (editMode) {
        await logbookService.update(formData.id, formData);
        toast.success('Logbook berhasil diupdate!');
      } else {
        await logbookService.create(formData);
        toast.success('Logbook berhasil ditambahkan!');
      }
      
      resetForm();
      setShowModal(false);
      fetchLogbooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menyimpan logbook');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (logbook) => {
    setFormData({
      id: logbook.id,
      tanggal: logbook.tanggal,
      aktivitas: logbook.aktivitas,
      foto_kegiatan: null,
    });
    if (logbook.foto_kegiatan) {
      setPhotoPreview(logbook.foto_kegiatan);
    }
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus logbook ini?')) {
      setLoading(true);
      try {
        await logbookService.delete(id);
        toast.success('Logbook berhasil dihapus!');
        fetchLogbooks();
      } catch (error) {
        toast.error('Gagal menghapus logbook');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      tanggal: formatDateForInput(new Date()),
      aktivitas: '',
      foto_kegiatan: null,
    });
    setPhotoPreview(null);
    setEditMode(false);
  };

  const openModal = () => {
    resetForm();
    setShowModal(true);
  };

  const closeModal = () => {
    resetForm();
    setShowModal(false);
  };

  return (
    <div className="logbook-page">
      <div className="page-header">
        <div>
          <h2>Logbook Kegiatan</h2>
          <p>Catat kegiatan harian Anda</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <FaPlus /> Tambah Logbook
        </button>
      </div>

      {/* Filter */}
      <div className="filter-section">
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

      {/* Logbook List */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : logbooks.length > 0 ? (
        <div className="logbook-grid">
          {logbooks.map((logbook) => (
            <div key={logbook.id} className="logbook-card">
              <div className="logbook-header">
                <span className="logbook-date">{formatDate(logbook.tanggal)}</span>
                <span className={`badge badge-${getValidationColor(logbook.status_validasi)}`}>
                  {logbook.status_validasi}
                </span>
              </div>
              
              {logbook.foto_kegiatan && (
                <div className="logbook-image">
                  <img src={logbook.foto_kegiatan} alt="Kegiatan" />
                </div>
              )}
              
              <div className="logbook-content">
                <p>{logbook.aktivitas}</p>
              </div>

              {logbook.komentar_admin && (
                <div className="admin-comment">
                  <strong>Komentar Admin:</strong>
                  <p>{logbook.komentar_admin}</p>
                </div>
              )}

              {logbook.status_validasi === 'Pending' && (
                <div className="logbook-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(logbook)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(logbook.id)}>
                    <FaTrash /> Hapus
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>Belum ada logbook untuk bulan ini</p>
          <button className="btn btn-primary" onClick={openModal}>
            <FaPlus /> Buat Logbook
          </button>
        </div>
      )}

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editMode ? 'Edit Logbook' : 'Tambah Logbook'}</h3>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="logbook-form">
              <div className="form-group">
                <label htmlFor="tanggal">Tanggal *</label>
                <input
                  type="date"
                  id="tanggal"
                  name="tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="aktivitas">Aktivitas/Kegiatan *</label>
                <textarea
                  id="aktivitas"
                  name="aktivitas"
                  rows="5"
                  placeholder="Deskripsikan kegiatan yang Anda lakukan..."
                  value={formData.aktivitas}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="foto_kegiatan">Foto Kegiatan (Opsional)</label>
                <input
                  type="file"
                  id="foto_kegiatan"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {photoPreview && (
                  <div className="image-preview">
                    <img src={photoPreview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Batal
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Menyimpan...' : editMode ? 'Update' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logbook;
