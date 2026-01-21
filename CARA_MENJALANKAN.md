# 🚀 Cara Menjalankan Aplikasi - Sistem Absensi & Logbook Magang

## ✅ Checklist Sebelum Mulai

- [x] XAMPP terinstall
- [x] Node.js terinstall
- [x] Database sudah diimport
- [x] Backend sudah di copy ke htdocs
- [x] Frontend dependencies sudah terinstall

## 📋 Langkah-Langkah Menjalankan

### 1️⃣ Start XAMPP

1. Buka **XAMPP Control Panel**
2. Klik **Start** pada:
   - ✅ **Apache** (untuk backend PHP)
   - ✅ **MySQL** (untuk database)
3. Tunggu hingga keduanya berwarna **HIJAU**

### 2️⃣ Import Database (Jika Belum)

1. Buka browser: `http://localhost/phpmyadmin`
2. Klik tab **"SQL"**
3. Copy semua isi file: `database/absensi_logbook.sql`
4. Paste ke textarea SQL
5. Klik **"Go"** atau **"Kirim"**
6. Database `absensi_logbook` akan terbuat

### 3️⃣ Verifikasi Backend API

1. Buka browser: `http://localhost/absensi-logbook-api/`
2. Jika berhasil, akan muncul JSON seperti ini:

```json
{
  "success": true,
  "message": "Absensi & Logbook API",
  "version": "1.0.0",
  "endpoints": { ... }
}
```

✅ **Backend Ready!**

### 4️⃣ Jalankan Frontend

Buka **Terminal/PowerShell** baru:

```bash
# Masuk ke folder frontend
cd "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\frontend"

# Jalankan development server
npm run dev
```

Output:

```
VITE v5.4.21 ready in 338 ms
➜  Local:   http://localhost:3000/
```

✅ **Frontend Ready!**

### 5️⃣ Buka Aplikasi di Browser

Buka browser dan akses: **http://localhost:3000**

---

## 🔐 Login Pertama Kali

### Akun Default (Admin):

- **NIM/NIP:** `ADMIN001`
- **Password:** `admin123`

### Atau Daftar Akun Baru:

1. Klik **"Daftar di sini"**
2. Isi form registrasi
3. Klik **"Daftar Sekarang"**
4. Login dengan akun yang baru dibuat

---

## 🎯 Fitur yang Bisa Dicoba

### 1. Dashboard

- Lihat statistik kehadiran
- Lihat absensi hari ini
- Lihat logbook terbaru

### 2. Absensi

- **Check-in:**
  - Buka kamera atau upload foto
  - Ambil selfie
  - Klik "Check In"
  - GPS otomatis tersimpan
- **Check-out:**
  - Setelah check-in, klik "Check Out"
  - Durasi kerja otomatis terhitung

### 3. Logbook

- **Buat logbook baru:**
  - Klik tombol "+ Tambah Logbook"
  - Pilih tanggal
  - Isi aktivitas
  - Upload foto (opsional)
  - Klik "Simpan"
- **Edit/Hapus:**
  - Hanya bisa untuk status "Pending"
  - Klik tombol Edit atau Hapus pada card logbook

### 4. Riwayat

- Filter by bulan & tahun
- Lihat detail absensi
- Klik link Google Maps untuk lokasi

### 5. Profile

- Klik "Edit Profil"
- Update data diri
- Upload foto profil
- Klik "Simpan Perubahan"

---

## 🗂️ Struktur Lengkap Project

```
BankMandiri/
│
├── 📁 database/
│   ├── absensi_logbook.sql      ✅ Database SQL
│   └── README.md
│
├── 📁 frontend/                  ✅ React App
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── 📁 backend/                   ✅ PHP API
│   ├── config/
│   ├── helpers/
│   ├── auth/
│   ├── attendance/
│   ├── logbook/
│   ├── user/
│   ├── uploads/
│   ├── .htaccess
│   ├── index.php
│   └── README.md
│
└── 📄 PANDUAN.md                 ✅ Dokumentasi lengkap
```

---

## 🔧 Troubleshooting

### ❌ Backend API Error (404 Not Found)

**Penyebab:** Backend belum di copy ke htdocs

**Solusi:**

```bash
# Copy manual atau jalankan:
robocopy "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\backend" "C:\xampp\htdocs\absensi-logbook-api" /E
```

### ❌ CORS Error

**Penyebab:** Frontend tidak bisa akses backend karena CORS

**Solusi:** Cek `backend/config/database.php`:

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
```

### ❌ Database Connection Failed

**Penyebab:** MySQL tidak running atau database belum diimport

**Solusi:**

1. Start MySQL di XAMPP
2. Import database: `database/absensi_logbook.sql`
3. Cek config: `backend/config/database.php`

### ❌ File Upload Error

**Penyebab:** Permission folder atau max file size

**Solusi:**

1. Pastikan folder `backend/uploads/` writable
2. Cek `php.ini`: `upload_max_filesize = 10M`

### ❌ Token Invalid / Expired

**Penyebab:** Token expired (24 jam)

**Solusi:**

1. Logout
2. Login ulang
3. Token baru akan di-generate

### ❌ Frontend Blank / Error

**Penyebab:** Dependencies belum terinstall

**Solusi:**

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 Port yang Digunakan

| Service              | Port | URL                                  |
| -------------------- | ---- | ------------------------------------ |
| **Frontend (React)** | 3000 | http://localhost:3000                |
| **Backend (PHP)**    | 80   | http://localhost/absensi-logbook-api |
| **Database (MySQL)** | 3306 | localhost:3306                       |
| **phpMyAdmin**       | 80   | http://localhost/phpmyadmin          |

---

## 🎨 Teknologi Stack

### Frontend

- React 18
- Vite
- React Router v6
- Axios
- React Icons
- React Toastify

### Backend

- PHP 7.4+
- MySQL/MariaDB
- JWT Authentication
- PDO (Database)

### Server

- Apache (XAMPP)
- CORS enabled

---

## 📸 Flow Aplikasi

```
1. User Register/Login
   ↓
2. Dapat JWT Token
   ↓
3. Token disimpan di localStorage
   ↓
4. Setiap request kirim token di header
   ↓
5. Backend validate token
   ↓
6. Jika valid, process request
   ↓
7. Return data ke frontend
   ↓
8. Frontend tampilkan data
```

---

## 🔒 Security Features

✅ Password hashing (bcrypt)
✅ JWT token authentication
✅ SQL injection prevention
✅ File upload validation
✅ CORS configuration
✅ Input validation

---

## 📞 Support

Jika ada masalah:

1. **Check Error Log:**
   - Frontend: Browser Console (F12)
   - Backend: `C:\xampp\apache\logs\error.log`

2. **Test API:**
   - Gunakan Postman atau browser
   - Test endpoint satu per satu

3. **Clear Cache:**
   ```javascript
   // Browser console
   localStorage.clear();
   location.reload();
   ```

---

## 🎯 Next Steps (Optional)

### Fitur Tambahan yang Bisa Dikembangkan:

1. **Admin Dashboard**
   - Validasi logbook
   - Manajemen user
   - Laporan lengkap

2. **Notifications**
   - Email notification
   - Push notification
   - Reminder absensi

3. **Export Data**
   - Export ke Excel
   - Export ke PDF
   - Generate laporan

4. **Advanced Features**
   - Face recognition
   - Barcode/QR scan
   - Geofencing check

---

## ✅ Status Project

- ✅ Database Design & Setup
- ✅ Frontend (React) Complete
- ✅ Backend API (PHP) Complete
- ✅ Integration & Testing
- ⏳ Deployment (Optional)

---

**Aplikasi Siap Digunakan! 🎉**

Silakan explore semua fitur dan laporkan jika ada bug atau error!

---

_Last Updated: 21 Januari 2026_
_Version: 1.0.0_
