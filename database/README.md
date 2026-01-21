# Database Setup - Sistem Absensi dan Logbook Magang

## Cara Import Database ke phpMyAdmin

### 1. Buka XAMPP Control Panel

- Jalankan XAMPP
- Start Apache dan MySQL

### 2. Buka phpMyAdmin

- Buka browser
- Akses: `http://localhost/phpmyadmin`

### 3. Import Database

1. Klik tab **"SQL"** di menu atas
2. Copy seluruh isi file `absensi_logbook.sql`
3. Paste ke text area SQL
4. Klik tombol **"Go"** atau **"Kirim"**

### 4. Verifikasi

Setelah import berhasil, Anda akan melihat:

- Database: `absensi_logbook`
- 4 Tabel: `users`, `attendance`, `logbooks`, `settings`
- 2 Views: `v_rekap_absensi`, `v_rekap_logbook`

## Struktur Database

### Tabel Users

Menyimpan data pemagang dan admin:

- ID, nama lengkap, NIM/NIP
- Email, nomor telepon
- Password (ter-hash)
- Role (admin/magang)
- Status (aktif/nonaktif)

### Tabel Attendance

Menyimpan data absensi harian:

- Check-in/check-out time
- Status kehadiran (Hadir, Izin, Sakit, Alpha)
- Foto bukti selfie
- Koordinat lokasi
- Durasi kerja (otomatis terhitung)

### Tabel Logbooks

Menyimpan kegiatan harian:

- Aktivitas/deskripsi kegiatan
- Foto dokumentasi
- Status validasi (Pending, Disetujui, Ditolak)
- Feedback dari admin

### Tabel Settings

Pengaturan aplikasi:

- Jam masuk/keluar default
- Toleransi keterlambatan
- Radius lokasi absen

## Akun Default

**Admin:**

- Username: `ADMIN001`
- Password: `admin123`
- Email: `admin@bankmandiri.co.id`

⚠️ **Penting:** Ganti password default setelah login pertama kali!

## Fitur Database

### Views (Laporan)

- `v_rekap_absensi` - Rekap kehadiran per user
- `v_rekap_logbook` - Rekap logbook per user

### Trigger

- Auto-calculate durasi kerja saat check-out

### Stored Procedure

- `get_dashboard_stats(user_id)` - Ambil statistik dashboard

## Catatan Keamanan

1. **Password Hashing**: Password di-hash menggunakan bcrypt di backend
2. **Foreign Key**: Menggunakan CASCADE untuk data integrity
3. **Unique Constraint**: NIM/NIP dan email harus unik
4. **Index**: Index pada kolom yang sering di-query untuk performa optimal

## Query Berguna

```sql
-- Lihat absensi hari ini
SELECT u.nama_lengkap, a.*
FROM attendance a
JOIN users u ON a.user_id = u.id
WHERE a.tanggal = CURDATE();

-- Lihat logbook pending
SELECT u.nama_lengkap, l.*
FROM logbooks l
JOIN users u ON l.user_id = u.id
WHERE l.status_validasi = 'Pending';

-- Rekap kehadiran
SELECT * FROM v_rekap_absensi;
```
