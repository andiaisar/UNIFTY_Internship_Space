# 🔌 Backend API - Sistem Absensi & Logbook

Backend API untuk sistem absensi dan logbook magang, dibangun dengan **PHP** dan **MySQL**.

## 📋 Fitur API

### 🔐 Authentication

- Login dengan JWT token
- Register user baru
- Token validation & expiration

### ✅ Attendance (Absensi)

- Check-in dengan foto & GPS
- Check-out otomatis calculate durasi
- Get absensi hari ini
- Riwayat absensi
- Statistik kehadiran

### 📝 Logbook

- Create logbook dengan foto
- Read logbook by month/year
- Update logbook (pending only)
- Delete logbook (pending only)

### 👤 User Profile

- Get profile data
- Update profile
- Upload foto profil

## 🚀 Cara Setup & Menjalankan

### 1. Copy Backend ke Folder XAMPP

```bash
# Copy folder backend ke htdocs
C:\xampp\htdocs\absensi-logbook-api\
```

**ATAU** buat symbolic link:

```bash
# Windows (Run as Administrator)
mklink /D "C:\xampp\htdocs\absensi-logbook-api" "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\backend"
```

### 2. Import Database

1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Import file: `database/absensi_logbook.sql`
3. Database `absensi_logbook` akan terbuat otomatis

### 3. Konfigurasi Database (Opsional)

Edit `config/database.php` jika perlu:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'absensi_logbook');
```

### 4. Test API

Buka browser: `http://localhost/absensi-logbook-api/`

Jika berhasil, akan muncul JSON list endpoints.

### 5. Jalankan Frontend

```bash
cd frontend
npm run dev
```

Frontend akan connect ke API otomatis!

## 📡 API Endpoints

### Base URL

```
http://localhost/absensi-logbook-api/
```

### Auth Endpoints

#### Login

```http
POST /auth/login.php
Content-Type: application/json

{
  "nim_nip": "ADMIN001",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "nama_lengkap": "Administrator",
    "nim_nip": "ADMIN001",
    "role": "admin",
    ...
  }
}
```

#### Register

```http
POST /auth/register.php
Content-Type: application/json

{
  "nama_lengkap": "John Doe",
  "nim_nip": "12345678",
  "kampus": "Universitas Hasanuddin",
  "email": "john@example.com",
  "no_telp": "08123456789",
  "password": "password123"
}
```

### Attendance Endpoints

**SEMUA MEMERLUKAN TOKEN di Header:**

```
Authorization: Bearer <token>
```

#### Check-in

```http
POST /attendance/checkin.php
Content-Type: multipart/form-data

foto_bukti: <file>
lokasi_lat: -5.135397
lokasi_long: 119.423790
```

#### Check-out

```http
POST /attendance/checkout.php
Content-Type: application/json

{
  "attendance_id": 1
}
```

#### Get Today's Attendance

```http
GET /attendance/today.php
```

#### Get History

```http
GET /attendance/history.php?month=1&year=2026
```

#### Get Statistics

```http
GET /attendance/statistics.php
```

### Logbook Endpoints

#### Create Logbook

```http
POST /logbook/create.php
Content-Type: multipart/form-data

tanggal: 2026-01-21
aktivitas: Deskripsi kegiatan...
foto_kegiatan: <file> (optional)
```

#### Get My Logbooks

```http
GET /logbook/my-logbooks.php?month=1&year=2026
```

#### Get Detail

```http
GET /logbook/detail.php?id=1
```

#### Update Logbook

```http
POST /logbook/update.php
Content-Type: multipart/form-data

id: 1
tanggal: 2026-01-21
aktivitas: Updated...
foto_kegiatan: <file> (optional)
```

#### Delete Logbook

```http
POST /logbook/delete.php
Content-Type: application/json

{
  "id": 1
}
```

### User Endpoints

#### Get Profile

```http
GET /user/profile.php
```

#### Update Profile

```http
POST /user/update.php
Content-Type: application/json

{
  "nama_lengkap": "Updated Name",
  "kampus": "Updated University",
  "email": "updated@email.com",
  "no_telp": "08123456789"
}
```

#### Upload Photo

```http
POST /user/upload-photo.php
Content-Type: multipart/form-data

foto_profil: <file>
```

## 🔐 Authentication

API menggunakan **JWT (JSON Web Token)**.

### Cara Pakai:

1. Login untuk dapatkan token
2. Simpan token di localStorage (frontend sudah handle)
3. Kirim token di header setiap request:

```
Authorization: Bearer <token>
```

### Token Expiration:

- Default: 24 jam
- Setelah expired, user harus login ulang

## 📁 Struktur Backend

```
backend/
├── config/
│   └── database.php          # Database config & connection
│
├── helpers/
│   ├── jwt.php              # JWT helper functions
│   └── FileUpload.php       # File upload handler
│
├── auth/
│   ├── login.php            # Login endpoint
│   └── register.php         # Register endpoint
│
├── attendance/
│   ├── checkin.php          # Check-in
│   ├── checkout.php         # Check-out
│   ├── today.php            # Today's attendance
│   ├── history.php          # Attendance history
│   └── statistics.php       # Attendance stats
│
├── logbook/
│   ├── create.php           # Create logbook
│   ├── my-logbooks.php      # Get user's logbooks
│   ├── detail.php           # Get logbook detail
│   ├── update.php           # Update logbook
│   └── delete.php           # Delete logbook
│
├── user/
│   ├── profile.php          # Get profile
│   ├── update.php           # Update profile
│   └── upload-photo.php     # Upload photo
│
├── uploads/                 # Uploaded files
│   ├── attendance/          # Attendance photos
│   ├── logbook/             # Logbook photos
│   └── profile/             # Profile photos
│
├── .htaccess               # Apache config & CORS
├── index.php               # API root
└── README.md               # Documentation
```

## 🔧 Teknologi

- **PHP 7.4+** - Server-side language
- **MySQL/MariaDB** - Database
- **PDO** - Database connection (secure)
- **JWT** - Authentication
- **Apache** - Web server (XAMPP)

## 🛡️ Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT token authentication
- ✅ SQL injection prevention (prepared statements)
- ✅ File upload validation (type & size)
- ✅ CORS configuration
- ✅ Input validation & sanitization

## 📝 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message"
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🐛 Troubleshooting

### CORS Error

Pastikan di `config/database.php`:

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
```

### File Upload Error

- Cek permission folder `uploads/`
- Cek `php.ini`: `upload_max_filesize` & `post_max_size`
- Default max: 5MB

### Database Connection Failed

- Cek MySQL running di XAMPP
- Cek credentials di `config/database.php`
- Cek database sudah diimport

### JWT Token Invalid

- Token expired (24 jam)
- Token tidak dikirim di header
- Secret key berbeda

## 🧪 Testing

### Test dengan Postman/Insomnia:

1. **Login:**
   - POST `http://localhost/absensi-logbook-api/auth/login.php`
   - Body: `{"nim_nip": "ADMIN001", "password": "admin123"}`

2. **Copy token dari response**

3. **Test endpoint lain:**
   - Tambahkan header: `Authorization: Bearer <token>`

### Test dengan Frontend:

```bash
cd frontend
npm run dev
# Buka http://localhost:3000
```

## 📞 Support

Jika ada error:

1. Cek error log: `xampp/apache/logs/error.log`
2. Enable error display di `config/database.php`
3. Test endpoint di Postman
4. Cek database connection

---

**API Ready! 🚀**

Sekarang frontend bisa connect ke backend dan data akan tersimpan di database MySQL!
