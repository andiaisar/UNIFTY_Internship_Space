# 📱 Sistem Absensi & Logbook Magang - Panduan Lengkap

## ✅ Status Progress

### 1. Database ✅ SELESAI

- ✅ 4 Tabel utama (users, attendance, logbooks, settings)
- ✅ Views untuk laporan
- ✅ Triggers & Stored Procedures
- ✅ Sample data & admin default

### 2. Frontend (React) ✅ SELESAI

- ✅ Authentication (Login & Register)
- ✅ Dashboard dengan statistik
- ✅ Absensi dengan foto & GPS
- ✅ Logbook kegiatan harian
- ✅ Riwayat & Profile
- ✅ Responsive design

### 3. Backend API (PHP) ⏳ BELUM

- Coming next!

---

## 🚀 Cara Menjalankan Frontend

### Langkah 1: Pastikan XAMPP Running

```bash
# Apache & MySQL harus aktif (hijau) di XAMPP Control Panel
```

### Langkah 2: Import Database

1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Import file: `database/absensi_logbook.sql`

### Langkah 3: Jalankan Frontend

```bash
cd "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\frontend"
npm run dev
```

Aplikasi akan terbuka di: **http://localhost:3000**

---

## 📂 Struktur Project

```
BankMandiri/
│
├── database/
│   ├── absensi_logbook.sql      ✅ Database SQL
│   └── README.md                 ✅ Panduan database
│
├── frontend/                     ✅ React Application
│   ├── src/
│   │   ├── components/          # Layout & ProtectedRoute
│   │   ├── context/             # AuthContext
│   │   ├── pages/               # Login, Dashboard, dll
│   │   ├── services/            # API services
│   │   ├── styles/              # CSS files
│   │   ├── utils/               # Helper functions
│   │   ├── config/              # API config
│   │   ├── App.jsx              # Main app
│   │   └── main.jsx             # Entry point
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── README.md                ✅ Dokumentasi frontend
│
└── backend/                      ⏳ Coming Next
    └── (PHP API files)
```

---

## 🎨 Fitur Frontend yang Sudah Dibuat

### 1. 🔐 Halaman Login & Register

- Form login dengan NIM/NIP & password
- Form registrasi lengkap
- Validasi input
- Show/hide password
- Redirect otomatis setelah login

### 2. 📊 Dashboard

- **Welcome card** dengan greeting
- **Stats cards**: Total hadir, logbook, pending, persentase
- **Absensi hari ini**: Jam masuk, jam keluar, status
- **Logbook terbaru**: 5 entry terakhir

### 3. ✅ Halaman Absensi

- **Jam real-time** (update setiap detik)
- **Check-in**:
  - Buka kamera atau upload foto
  - Capture selfie
  - Deteksi lokasi GPS otomatis
  - Submit dengan foto bukti
- **Check-out**: Satu klik setelah check-in
- **Status absensi** hari ini

### 4. 📝 Halaman Logbook

- **Grid view** semua logbook
- **Filter** by bulan & tahun
- **Create logbook**:
  - Pilih tanggal
  - Input aktivitas (textarea)
  - Upload foto kegiatan (optional)
- **Edit/Delete**: Hanya untuk status pending
- **Badge status**: Pending, Disetujui, Ditolak
- **Admin comment**: Tampil jika ada feedback

### 5. 📜 Halaman History (Riwayat)

- **Tabel riwayat** absensi
- Filter by bulan & tahun
- Info: Tanggal, jam masuk/keluar, durasi, status
- Link ke Google Maps (jika ada koordinat)

### 6. 👤 Halaman Profile

- Tampil data diri lengkap
- Edit mode untuk update data
- Upload foto profil
- Form validasi

---

## 🎨 Design System

### Warna Bank Mandiri

```css
Primary: #003d7a (Biru Bank Mandiri)
Secondary: #fdb913 (Kuning)
Success: #28a745
Danger: #dc3545
Warning: #ffc107
Info: #17a2b8
```

### Fitur UI/UX

- ✅ Responsive (Mobile, Tablet, Desktop)
- ✅ Sidebar navigation dengan toggle
- ✅ Toast notifications (success, error, warning)
- ✅ Loading states & spinners
- ✅ Empty states dengan ilustrasi
- ✅ Smooth animations & transitions
- ✅ Modal forms
- ✅ Badge untuk status

---

## 🔧 Teknologi yang Digunakan

### Frontend

- **React 18** - UI Library
- **Vite** - Build tool (lebih cepat dari Create React App)
- **React Router v6** - Routing & navigation
- **Axios** - HTTP client dengan interceptors
- **React Icons** - Icon library (Font Awesome, dll)
- **React Toastify** - Toast notifications
- **Date-fns** - Date manipulation

### Backend (Next)

- **PHP 8+** - Server-side scripting
- **MySQL** - Database (via XAMPP)
- **JWT** - Token authentication
- **PHPMailer** - Email (optional)

---

## 📱 API Endpoints (Backend - Next Step)

### Auth

```
POST /auth/login.php          # Login
POST /auth/register.php       # Register
POST /auth/logout.php         # Logout
```

### Attendance

```
GET  /attendance/today.php           # Absensi hari ini
GET  /attendance/history.php         # Riwayat absensi
GET  /attendance/statistics.php      # Statistik
POST /attendance/checkin.php         # Check-in
POST /attendance/checkout.php        # Check-out
```

### Logbook

```
GET  /logbook/my-logbooks.php   # List logbook user
GET  /logbook/detail.php        # Detail logbook
POST /logbook/create.php        # Buat logbook baru
POST /logbook/update.php        # Update logbook
POST /logbook/delete.php        # Hapus logbook
```

### User

```
GET  /user/profile.php          # Get profile
POST /user/update.php           # Update profile
POST /user/upload-photo.php     # Upload foto profil
```

---

## 🔐 Security Features

### Frontend

- ✅ JWT token storage di localStorage
- ✅ Protected routes (hanya user login)
- ✅ Auto redirect jika token expired
- ✅ Password tidak disimpan di localStorage
- ✅ Axios interceptors untuk auth header

### Backend (Akan dibuat)

- ⏳ Password hashing dengan bcrypt
- ⏳ JWT token generation & validation
- ⏳ CORS configuration
- ⏳ SQL injection prevention (prepared statements)
- ⏳ File upload validation
- ⏳ Rate limiting (optional)

---

## 🚨 Catatan Penting

### Permissions Required (Browser)

1. **Camera Access** - Untuk selfie absensi
2. **Location Access** - Untuk GPS koordinat
3. **Cookies/LocalStorage** - Untuk menyimpan token

### HTTPS Required (Production)

- `getUserMedia()` (camera) hanya bekerja di HTTPS atau localhost
- Untuk production, wajib pakai HTTPS

### CORS Configuration

Backend PHP harus allow CORS dari frontend:

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## 📋 Next Steps

### Yang Sudah Selesai ✅

1. ✅ Database design & setup
2. ✅ Frontend complete dengan semua fitur

### Yang Harus Dikerjakan ⏳

3. **Backend API (PHP)** - Priority!
   - Auth endpoints (login, register)
   - Attendance endpoints
   - Logbook endpoints
   - User profile endpoints
   - File upload handler
   - JWT authentication middleware

4. **Integration Testing**
   - Test API dengan frontend
   - Fix bugs & issues
   - Optimize performance

5. **Deployment**
   - Setup production server
   - Configure HTTPS
   - Database migration
   - Environment variables

---

## 🎯 Testing Checklist

### Frontend (Manual Testing)

- [ ] Login berhasil dengan kredensial valid
- [ ] Register user baru
- [ ] Dashboard menampilkan data statistik
- [ ] Check-in dengan foto & lokasi
- [ ] Check-out setelah check-in
- [ ] Buat logbook baru
- [ ] Edit & delete logbook
- [ ] Lihat riwayat absensi
- [ ] Update profile
- [ ] Logout

### Integration (Setelah Backend Selesai)

- [ ] API connection berhasil
- [ ] Authentication flow complete
- [ ] File upload (foto) berhasil
- [ ] Data tersimpan di database
- [ ] Error handling works
- [ ] Loading states proper
- [ ] Toast notifications muncul

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Cek dokumentasi di `frontend/README.md`
2. Cek error di browser console (F12)
3. Cek network tab untuk API errors
4. Cek localStorage untuk token & user data

---

## 🎓 Tips Development

### Debug Mode

```javascript
// Di browser console
console.log(localStorage.getItem("token"));
console.log(localStorage.getItem("user"));
```

### Clear Cache

Jika ada masalah, coba:

1. Clear browser cache & cookies
2. Clear localStorage: `localStorage.clear()`
3. Restart dev server: `Ctrl+C` lalu `npm run dev`

### Hot Reload

Vite support hot module replacement (HMR).
Perubahan code otomatis reload tanpa refresh full page.

---

**Happy Coding! 🚀**

_Last Updated: 21 Januari 2026_
