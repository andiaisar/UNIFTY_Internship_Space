# 🔧 Troubleshooting Registrasi

## Problem: Tidak Bisa Registrasi

### ✅ Checklist Debugging

#### 1. Cek XAMPP Running

```
✓ Apache harus HIJAU
✓ MySQL harus HIJAU
```

#### 2. Cek Database Sudah Diimport

- Buka: http://localhost/phpmyadmin
- Cek database `absensi_logbook` ada
- Cek tabel `users` ada

#### 3. Test Backend API Langsung

**Test dengan PowerShell:**

```powershell
$body = @{
    nama_lengkap = "Test User"
    nim_nip = "TEST999"
    password = "test123"
    kampus = "Universitas Test"
    email = "test999@example.com"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost/absensi-logbook-api/auth/register.php" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registrasi berhasil! Silakan login."
}
```

#### 4. Test dengan HTML Test File

Buka file: `test-register.html` yang sudah saya buat

- Klik tombol "Daftar Sekarang"
- Lihat hasil di kotak result
- Lihat console browser (F12) untuk error

#### 5. Cek Browser Console (React App)

1. Buka React app: http://localhost:3000
2. Buka Developer Tools (F12)
3. Ke tab "Console"
4. Coba registrasi
5. Lihat log yang muncul:
   - `Sending registration data: {...}`
   - `Registration response: {...}`
   - Atau error merah jika ada masalah

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Error:** `Access to fetch at 'http://localhost/absensi-logbook-api/auth/register.php' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**

1. Cek file `C:\xampp\htdocs\absensi-logbook-api\config\database.php`:

```php
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

2. Cek file `C:\xampp\htdocs\absensi-logbook-api\.htaccess`:

```apache
Header set Access-Control-Allow-Origin "http://localhost:3000"
Header set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
Header set Access-Control-Allow-Headers "Content-Type, Authorization"
```

3. Restart Apache di XAMPP

---

### Issue 2: 404 Not Found

**Error:** `POST http://localhost/absensi-logbook-api/auth/register.php 404 (Not Found)`

**Solution:**
Backend belum di-copy ke htdocs atau path salah.

```powershell
# Copy backend ke htdocs
robocopy "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\backend" "C:\xampp\htdocs\absensi-logbook-api" /E

# Cek apakah file ada
Test-Path "C:\xampp\htdocs\absensi-logbook-api\auth\register.php"
# Harus return: True
```

---

### Issue 3: Database Connection Error

**Error:** `SQLSTATE[HY000] [1049] Unknown database 'absensi_logbook'`

**Solution:**
Database belum diimport.

1. Buka: http://localhost/phpmyadmin
2. Klik tab "SQL"
3. Copy paste isi file: `database/absensi_logbook.sql`
4. Klik "Go"

---

### Issue 4: NIM/NIP Sudah Terdaftar

**Error:** `{"success":false,"message":"NIM/NIP sudah terdaftar"}`

**Solution:**
Gunakan NIM/NIP yang berbeda atau hapus user dari database:

```sql
-- Buka phpMyAdmin -> absensi_logbook -> SQL tab
DELETE FROM users WHERE nim_nip = 'TEST001';
```

---

### Issue 5: Email Sudah Terdaftar

**Error:** `{"success":false,"message":"Email sudah terdaftar"}`

**Solution:**

- Gunakan email berbeda
- Atau kosongkan field email (tidak wajib)

---

### Issue 6: Password Terlalu Pendek

**Error:** `Password minimal 6 karakter`

**Solution:**
Gunakan password minimal 6 karakter.

---

### Issue 7: Request Timeout

**Error:** `Network Error` atau `timeout of 0ms exceeded`

**Possible Causes:**

1. Apache tidak running
2. Backend path salah
3. Firewall blocking

**Solution:**

1. Cek XAMPP Apache running (hijau)
2. Test di browser: http://localhost/absensi-logbook-api/
3. Disable firewall temporarily untuk test

---

## 🔍 Advanced Debugging

### Check PHP Error Log

```powershell
Get-Content "C:\xampp\apache\logs\error.log" -Tail 50
```

### Check Apache Access Log

```powershell
Get-Content "C:\xampp\apache\logs\access.log" -Tail 50
```

### Test dengan cURL

```powershell
curl.exe -X POST http://localhost/absensi-logbook-api/auth/register.php `
  -H "Content-Type: application/json" `
  -d '{\"nama_lengkap\":\"Test User\",\"nim_nip\":\"TEST888\",\"password\":\"test123\"}'
```

### Enable PHP Error Display

Edit `C:\xampp\php\php.ini`:

```ini
display_errors = On
error_reporting = E_ALL
```

Restart Apache.

---

## ✅ Step-by-Step Test Flow

### 1. Test Backend Only (Tanpa Frontend)

**A. Test dengan PowerShell:**

```powershell
$body = @{
    nama_lengkap = "John Doe"
    nim_nip = "MAG" + (Get-Random -Maximum 9999)
    password = "password123"
    kampus = "Universitas Hasanuddin"
    email = "john" + (Get-Random -Maximum 999) + "@example.com"
    no_telp = "081234567890"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost/absensi-logbook-api/auth/register.php" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing

Write-Host "Status Code: $($response.StatusCode)"
Write-Host "Response: $($response.Content)"
```

**Expected Output:**

```
Status Code: 201
Response: {"success":true,"message":"Registrasi berhasil! Silakan login."}
```

✅ **Jika berhasil:** Backend OK, masalah di frontend
❌ **Jika gagal:** Ada masalah di backend/database

---

### 2. Test Frontend to Backend

**A. Buka Browser Console (F12)**

**B. Jalankan di Console:**

```javascript
// Test API endpoint
fetch("http://localhost/absensi-logbook-api/auth/register.php", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nama_lengkap: "Test Frontend",
    nim_nip: "FRONT" + Math.floor(Math.random() * 9999),
    password: "test123",
    kampus: "Test Kampus",
    email: "test" + Math.floor(Math.random() * 999) + "@test.com",
  }),
})
  .then((res) => res.json())
  .then((data) => console.log("Success:", data))
  .catch((err) => console.error("Error:", err));
```

**Expected Output:**

```javascript
Success: {success: true, message: "Registrasi berhasil! Silakan login."}
```

✅ **Jika berhasil:** CORS OK, masalah mungkin di React code
❌ **Jika CORS error:** Cek CORS headers di backend

---

### 3. Test React App

**A. Pastikan npm dev server running:**

```powershell
cd "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\frontend"
npm run dev
```

**B. Buka: http://localhost:3000/register**

**C. Isi form dan submit**

**D. Lihat Console (F12) untuk log:**

```
Sending registration data: {nama_lengkap: "...", nim_nip: "...", ...}
Registration response: {success: true, message: "..."}
```

---

## 📊 Decision Tree

```
Tidak bisa registrasi
    │
    ├─ Test dengan PowerShell gagal?
    │   ├─ Yes → Cek Apache/MySQL running
    │   │         Cek database sudah diimport
    │   │         Cek PHP error log
    │   │
    │   └─ No → Backend OK
    │
    ├─ Test dengan Browser Console gagal?
    │   ├─ Yes (CORS error) → Fix CORS headers
    │   │                      Restart Apache
    │   │
    │   ├─ Yes (404) → Backend tidak di htdocs
    │   │               Copy backend ke htdocs
    │   │
    │   └─ No → Frontend connection OK
    │
    └─ React app masih gagal?
        └─ Cek console log
           Cek network tab (F12)
           Cek response error detail
```

---

## 🎯 Quick Fix Commands

### 1. Reset Everything

```powershell
# Stop XAMPP
# Kemudian:

# Copy backend terbaru
robocopy "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\backend" "C:\xampp\htdocs\absensi-logbook-api" /E /MIR

# Restart Apache di XAMPP Control Panel

# Test backend
$body = @{nama_lengkap="Test";nim_nip="TEST123";password="test123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost/absensi-logbook-api/auth/register.php" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### 2. Clear Browser Cache

```javascript
// Di browser console
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 3. Reinstall Frontend Dependencies

```powershell
cd "E:\MATKUL UNHAS\SEMESTER 6\MAGANG\BankMandiri\frontend"
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json
npm install
npm run dev
```

---

## 📞 Getting Help

Jika masih error setelah semua langkah di atas:

1. **Screenshot error message** (console browser & network tab)
2. **Copy error log** dari `C:\xampp\apache\logs\error.log`
3. **Share hasil test** dari PowerShell command
4. **Jelaskan step** yang sudah dicoba

---

## ✅ Success Indicators

Registrasi berhasil jika:

✅ Status code: 201
✅ Response: `{"success":true,"message":"Registrasi berhasil! Silakan login."}`
✅ Toast notification hijau muncul
✅ Redirect ke halaman login
✅ Data user masuk ke database (cek di phpMyAdmin)

---

**Last Updated:** 21 Januari 2026
