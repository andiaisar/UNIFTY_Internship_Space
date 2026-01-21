<?php
header('Content-Type: application/json');
require_once '../config/database.php';
require_once '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Verify admin authentication
$headers = getallheaders();
$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak ditemukan']);
    exit;
}

try {
    // Decode JWT token
    
    $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
    
    // Check if user is admin
    if ($decoded->data->role !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Akses ditolak. Hanya admin yang dapat mengakses']);
        exit;
    }
    
    // Get dashboard statistics
    $stats = [];
    
    // Total users (magang only)
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users WHERE role = 'magang'");
    $stats['total_users'] = $stmt->fetch()['total'];
    
    // Active users
    $stmt = $conn->query("SELECT COUNT(*) as total FROM users WHERE role = 'magang' AND status = 'aktif'");
    $stats['active_users'] = $stmt->fetch()['total'];
    
    // Today's attendance count
    $stmt = $conn->query("SELECT COUNT(*) as total FROM attendance WHERE DATE(waktu_masuk) = CURDATE()");
    $stats['today_attendance'] = $stmt->fetch()['total'];
    
    // Pending logbooks
    $stmt = $conn->query("SELECT COUNT(*) as total FROM logbooks WHERE status_validasi = 'Pending'");
    $stats['pending_logbooks'] = $stmt->fetch()['total'];
    
    // This month logbooks
    $stmt = $conn->query("SELECT COUNT(*) as total FROM logbooks WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())");
    $stats['this_month_logbooks'] = $stmt->fetch()['total'];
    
    // Average work hours this month
    $stmt = $conn->query("SELECT AVG(TIMESTAMPDIFF(HOUR, waktu_mulai, waktu_selesai)) as avg_hours 
              FROM logbooks 
              WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())
              AND waktu_mulai IS NOT NULL AND waktu_selesai IS NOT NULL");
    $avg = $stmt->fetch()['avg_hours'];
    $stats['avg_work_hours'] = $avg ? round($avg, 1) : 0;
    
    // Latest registered users (last 5)
    $stmt = $conn->query("SELECT user_id, nama_lengkap, nim_nip, email, status, created_at 
              FROM users 
              WHERE role = 'magang' 
              ORDER BY created_at DESC 
              LIMIT 5");
    $stats['latest_users'] = $stmt->fetchAll();
    
    // Today's attendance details
    $stmt = $conn->query("SELECT a.*, u.nama_lengkap, u.nim_nip 
              FROM attendance a
              JOIN users u ON a.user_id = u.user_id
              WHERE DATE(a.waktu_masuk) = CURDATE()
              ORDER BY a.waktu_masuk DESC");
    $stats['today_attendance_list'] = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $stats
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid: ' . $e->getMessage()]);
}
?>
