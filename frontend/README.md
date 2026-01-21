# 🏢 Sistem Absensi & Logbook Magang - Frontend

Frontend aplikasi sistem absensi dan logbook untuk anak magang, dibangun dengan **React** dan **Vite**.

## 📋 Fitur Utama

### 🔐 Autentikasi

- Login dengan NIM/NIP dan Password
- Register akun baru
- Protected routes dengan authentication check

### 📊 Dashboard

- Statistik kehadiran dan logbook
- Ringkasan absensi hari ini
- Logbook terbaru
- Persentase kehadiran

### ✅ Absensi

- **Check-in** dengan foto selfie
- **Check-out** otomatis
- Capture foto melalui kamera atau upload
- Geolokasi otomatis (GPS)
- Waktu real-time
- Riwayat absensi

### 📝 Logbook

- Buat logbook kegiatan harian
- Upload foto dokumentasi
- Edit & hapus logbook (hanya yang pending)
- Status validasi (Pending, Disetujui, Ditolak)
- Feedback dari admin

### 👤 Profile

- Lihat dan edit data diri
- Update informasi kontak
- Ganti foto profil

## 🚀 Cara Menjalankan

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Konfigurasi API

Edit file `src/config/api.js` dan sesuaikan URL backend:

```javascript
const API_BASE_URL = "http://localhost/absensi-logbook-api";
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:3000`

### 4. Build untuk Production

```bash
npm run build
```

File production akan ada di folder `dist/`

## 📁 Struktur Project

```
frontend/
├── public/
│   └── logo-mandiri.png          # Logo Bank Mandiri
├── src/
│   ├── components/               # Reusable components
│   │   ├── Layout.jsx           # Main layout dengan sidebar
│   │   └── ProtectedRoute.jsx   # Route protection
│   │
│   ├── context/                 # React Context
│   │   └── AuthContext.jsx      # Authentication context
│   │
│   ├── pages/                   # Halaman aplikasi
│   │   ├── Login.jsx           # Halaman login
│   │   ├── Register.jsx        # Halaman register
│   │   ├── Dashboard.jsx       # Dashboard utama
│   │   ├── Attendance.jsx      # Halaman absensi
│   │   ├── Logbook.jsx         # Halaman logbook
│   │   ├── History.jsx         # Riwayat absensi
│   │   └── Profile.jsx         # Profil user
│   │
│   ├── services/                # API Services
│   │   ├── authService.js      # Authentication API
│   │   ├── attendanceService.js # Attendance API
│   │   └── logbookService.js   # Logbook API
│   │
│   ├── styles/                  # CSS Files
│   │   ├── index.css           # Global styles
│   │   ├── Auth.css            # Login & Register styles
│   │   ├── Layout.css          # Layout & sidebar styles
│   │   ├── Dashboard.css       # Dashboard styles
│   │   ├── Attendance.css      # Attendance page styles
│   │   ├── Logbook.css         # Logbook page styles
│   │   ├── History.css         # History page styles
│   │   └── Profile.css         # Profile page styles
│   │
│   ├── utils/                   # Utility functions
│   │   ├── axios.js            # Axios instance & interceptors
│   │   └── helpers.js          # Helper functions
│   │
│   ├── config/                  # Configuration
│   │   └── api.js              # API base URL
│   │
│   ├── App.jsx                  # Main App component
│   └── main.jsx                 # Entry point
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Teknologi yang Digunakan

- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Toast notifications
- **Date-fns** - Date utility

## 🎨 Fitur UI/UX

- Responsive design (Mobile, Tablet, Desktop)
- Theme Bank Mandiri (Biru & Kuning)
- Smooth animations & transitions
- Toast notifications untuk feedback
- Loading states
- Empty states
- Protected routes

## 📱 Halaman yang Tersedia

| Route        | Deskripsi          | Auth Required |
| ------------ | ------------------ | ------------- |
| `/login`     | Halaman login      | ❌            |
| `/register`  | Halaman registrasi | ❌            |
| `/dashboard` | Dashboard utama    | ✅            |
| `/absensi`   | Check-in/Check-out | ✅            |
| `/logbook`   | Kelola logbook     | ✅            |
| `/history`   | Riwayat absensi    | ✅            |
| `/profile`   | Profil user        | ✅            |

## 🔧 Konfigurasi Penting

### Axios Interceptor

- Otomatis menambahkan token ke header request
- Redirect ke login jika token expired (401)
- Error handling global

### LocalStorage

Data yang disimpan:

- `token` - JWT token autentikasi
- `user` - Data user yang sedang login

### Environment Variables (Optional)

Buat file `.env` untuk konfigurasi:

```env
VITE_API_URL=http://localhost/absensi-logbook-api
```

## 📸 Fitur Kamera

Aplikasi menggunakan:

- `navigator.mediaDevices.getUserMedia()` untuk akses kamera
- HTML5 Canvas untuk capture foto
- File API untuk upload foto

### Permissions Required:

- Camera access (untuk selfie absensi)
- Location access (untuk koordinat GPS)

## 🔒 Security

- Password tidak pernah disimpan di localStorage
- Token JWT untuk autentikasi
- Protected routes dengan authentication check
- Logout otomatis jika token expired
- HTTPS recommended untuk production

## 🚨 Troubleshooting

### Error: Cannot access camera

- Pastikan browser memiliki izin akses kamera
- HTTPS diperlukan untuk production (getUserMedia)

### Error: Network Error

- Periksa URL backend di `src/config/api.js`
- Pastikan backend sudah running
- Periksa CORS configuration di backend

### Error: 401 Unauthorized

- Token mungkin expired
- Logout dan login kembali
- Periksa localStorage apakah token tersimpan

## 📝 Notes

- Backend API harus sudah running sebelum menjalankan frontend
- Pastikan CORS diaktifkan di backend PHP
- Untuk production, build project dengan `npm run build`
- Deploy folder `dist/` ke web server

## 🎯 Next Steps

Setelah frontend selesai, langkah selanjutnya:

1. ✅ Database sudah dibuat
2. ✅ Frontend sudah dibuat
3. ⏳ **Backend API** (PHP) - coming next!
4. ⏳ Integration & Testing
5. ⏳ Deployment

## 👨‍💻 Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📄 License

Private project untuk Bank Mandiri Internship Program.

---

**Dibuat dengan ❤️ untuk Program Magang Bank Mandiri**
