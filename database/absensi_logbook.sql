-- =====================================================
-- DATABASE ABSENSI DAN LOGBOOK MAGANG
-- =====================================================

-- Buat database
CREATE DATABASE IF NOT EXISTS absensi_logbook;

USE absensi_logbook;

-- =====================================================
-- 1. TABEL USERS (Data Pemagang)
-- =====================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    nim_nip VARCHAR(50) NOT NULL UNIQUE,
    kampus VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    no_telp VARCHAR(20),
    password VARCHAR(255) NOT NULL, -- Password akan di-hash menggunakan bcrypt
    foto_profil VARCHAR(255) DEFAULT 'default-avatar.png',
    role ENUM('admin', 'magang') DEFAULT 'magang',
    status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nim_nip (nim_nip),
    INDEX idx_role (role)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 2. TABEL ATTENDANCE (Check-in/Check-out)
-- =====================================================
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanggal DATE NOT NULL,
    jam_masuk TIME,
    jam_keluar TIME,
    status ENUM(
        'Hadir',
        'Izin',
        'Sakit',
        'Alpha'
    ) DEFAULT 'Hadir',
    keterangan TEXT,
    foto_bukti VARCHAR(255), -- Path file foto selfie saat absen
    lokasi_lat VARCHAR(50), -- Koordinat Latitude
    lokasi_long VARCHAR(50), -- Koordinat Longitude
    durasi_kerja INT, -- Durasi dalam menit (dihitung otomatis)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_tanggal (user_id, tanggal),
    INDEX idx_tanggal (tanggal),
    UNIQUE KEY unique_user_date (user_id, tanggal) -- Satu user hanya bisa absen sekali per hari
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 3. TABEL LOGBOOKS (Kegiatan Harian)
-- =====================================================
CREATE TABLE logbooks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    tanggal DATE NOT NULL,
    aktivitas TEXT NOT NULL,
    foto_kegiatan VARCHAR(255),
    status_validasi ENUM(
        'Pending',
        'Disetujui',
        'Ditolak'
    ) DEFAULT 'Pending',
    komentar_admin TEXT, -- Feedback dari admin/supervisor
    validated_by INT, -- ID admin yang memvalidasi
    validated_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (validated_by) REFERENCES users (id) ON DELETE SET NULL,
    INDEX idx_user_tanggal (user_id, tanggal),
    INDEX idx_status (status_validasi)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- 4. TABEL PENGATURAN (Settings Aplikasi)
-- =====================================================
CREATE TABLE settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- =====================================================
-- DATA AWAL (SEED DATA)
-- =====================================================

-- Insert pengaturan default
INSERT INTO
    settings (
        setting_key,
        setting_value,
        description
    )
VALUES (
        'jam_masuk_default',
        '08:00',
        'Jam masuk kantor default'
    ),
    (
        'jam_keluar_default',
        '17:00',
        'Jam keluar kantor default'
    ),
    (
        'toleransi_keterlambatan',
        '15',
        'Toleransi keterlambatan dalam menit'
    ),
    (
        'radius_lokasi',
        '100',
        'Radius lokasi absen dalam meter'
    );

-- Insert admin default (password: admin123 - nanti akan di-hash di backend)
INSERT INTO
    users (
        nama_lengkap,
        nim_nip,
        kampus,
        email,
        password,
        role,
        status
    )
VALUES (
        'Administrator',
        'ADMIN001',
        'Bank Mandiri',
        'admin@bankmandiri.co.id',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'admin',
        'aktif'
    );

-- =====================================================
-- VIEW UNTUK LAPORAN
-- =====================================================

-- View untuk rekap absensi per user
CREATE VIEW v_rekap_absensi AS
SELECT
    u.id AS user_id,
    u.nama_lengkap,
    u.nim_nip,
    u.kampus,
    COUNT(a.id) AS total_absen,
    SUM(
        CASE
            WHEN a.status = 'Hadir' THEN 1
            ELSE 0
        END
    ) AS total_hadir,
    SUM(
        CASE
            WHEN a.status = 'Izin' THEN 1
            ELSE 0
        END
    ) AS total_izin,
    SUM(
        CASE
            WHEN a.status = 'Sakit' THEN 1
            ELSE 0
        END
    ) AS total_sakit,
    SUM(
        CASE
            WHEN a.status = 'Alpha' THEN 1
            ELSE 0
        END
    ) AS total_alpha
FROM users u
    LEFT JOIN attendance a ON u.id = a.user_id
WHERE
    u.role = 'magang'
GROUP BY
    u.id,
    u.nama_lengkap,
    u.nim_nip,
    u.kampus;

-- View untuk rekap logbook per user
CREATE VIEW v_rekap_logbook AS
SELECT
    u.id AS user_id,
    u.nama_lengkap,
    u.nim_nip,
    COUNT(l.id) AS total_logbook,
    SUM(
        CASE
            WHEN l.status_validasi = 'Pending' THEN 1
            ELSE 0
        END
    ) AS pending,
    SUM(
        CASE
            WHEN l.status_validasi = 'Disetujui' THEN 1
            ELSE 0
        END
    ) AS disetujui,
    SUM(
        CASE
            WHEN l.status_validasi = 'Ditolak' THEN 1
            ELSE 0
        END
    ) AS ditolak
FROM users u
    LEFT JOIN logbooks l ON u.id = l.user_id
WHERE
    u.role = 'magang'
GROUP BY
    u.id,
    u.nama_lengkap,
    u.nim_nip;

-- =====================================================
-- TRIGGER
-- =====================================================

-- Trigger untuk menghitung durasi kerja otomatis
DELIMITER / /

CREATE TRIGGER calculate_work_duration 
BEFORE UPDATE ON attendance
FOR EACH ROW
BEGIN
    IF NEW.jam_keluar IS NOT NULL AND NEW.jam_masuk IS NOT NULL THEN
        SET NEW.durasi_kerja = TIMESTAMPDIFF(MINUTE, 
            CONCAT(NEW.tanggal, ' ', NEW.jam_masuk), 
            CONCAT(NEW.tanggal, ' ', NEW.jam_keluar)
        );
    END IF;
END//

DELIMITER;

-- =====================================================
-- STORED PROCEDURE
-- =====================================================

-- Procedure untuk mendapatkan statistik dashboard
DELIMITER / /

CREATE PROCEDURE get_dashboard_stats(IN p_user_id INT)
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM attendance WHERE user_id = p_user_id) AS total_absen,
        (SELECT COUNT(*) FROM attendance WHERE user_id = p_user_id AND status = 'Hadir') AS total_hadir,
        (SELECT COUNT(*) FROM logbooks WHERE user_id = p_user_id) AS total_logbook,
        (SELECT COUNT(*) FROM logbooks WHERE user_id = p_user_id AND status_validasi = 'Disetujui') AS logbook_approved;
END//

DELIMITER;

-- =====================================================
-- QUERY CONTOH PENGGUNAAN
-- =====================================================

-- Lihat semua user magang
-- SELECT * FROM users WHERE role = 'magang';

-- Lihat absensi hari ini
-- SELECT u.nama_lengkap, a.*
-- FROM attendance a
-- JOIN users u ON a.user_id = u.id
-- WHERE a.tanggal = CURDATE();

-- Lihat logbook yang pending
-- SELECT u.nama_lengkap, l.*
-- FROM logbooks l
-- JOIN users u ON l.user_id = u.id
-- WHERE l.status_validasi = 'Pending';

-- Rekap kehadiran per user
-- SELECT * FROM v_rekap_absensi;

-- Rekap logbook per user
-- SELECT * FROM v_rekap_logbook;