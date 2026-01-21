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
    
    $decoded = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));
    
    if ($decoded->data->role !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Akses ditolak']);
        exit;
    }
    
    // Get filter parameters
    $status = isset($_GET['status']) ? $_GET['status'] : 'all';
    $search = isset($_GET['search']) ? $_GET['search'] : '';
    
    // Build query
    $query = "SELECT u.user_id, u.nama_lengkap, u.nim_nip, u.email, u.no_telepon, 
              u.status, u.created_at,
              COUNT(DISTINCT a.attendance_id) as total_attendance,
              COUNT(DISTINCT l.logbook_id) as total_logbooks,
              MAX(a.waktu_masuk) as last_attendance
              FROM users u
              LEFT JOIN attendance a ON u.user_id = a.user_id
              LEFT JOIN logbooks l ON u.user_id = l.user_id
              WHERE u.role = 'magang'";
    
    $params = [];
    
    // Add status filter
    if ($status !== 'all') {
        $query .= " AND u.status = ?";
        $params[] = $status;
    }
    
    // Add search filter
    if (!empty($search)) {
        $query .= " AND (u.nama_lengkap LIKE ? OR u.nim_nip LIKE ? OR u.email LIKE ?)";
        $searchParam = "%$search%";
        $params[] = $searchParam;
        $params[] = $searchParam;
        $params[] = $searchParam;
    }
    
    $query .= " GROUP BY u.user_id ORDER BY u.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $users = $stmt->fetchAll();
    
    // Get counts for filters
    $countQuery = "SELECT 
                   COUNT(*) as total,
                   SUM(CASE WHEN status = 'aktif' THEN 1 ELSE 0 END) as aktif,
                   SUM(CASE WHEN status = 'nonaktif' THEN 1 ELSE 0 END) as nonaktif
                   FROM users WHERE role = 'magang'";
    $counts = $conn->query($countQuery)->fetch();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $users,
        'counts' => $counts
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid: ' . $e->getMessage()]);
}
?>
