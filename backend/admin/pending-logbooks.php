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
    
    // Get filter parameter
    $status_filter = isset($_GET['status']) ? $_GET['status'] : 'Pending';
    
    // Build query
    $query = "SELECT l.*, u.nama_lengkap, u.nim_nip 
              FROM logbooks l
              JOIN users u ON l.user_id = u.user_id
              WHERE 1=1";
    
    $params = [];
    if ($status_filter !== 'all') {
        $query .= " AND l.status_validasi = ?";
        $params[] = $status_filter;
    }
    
    $query .= " ORDER BY l.tanggal DESC, l.created_at DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $logbooks = $stmt->fetchAll();
    
    // Get counts
    $countQuery = "SELECT 
                   COUNT(*) as total,
                   SUM(CASE WHEN status_validasi = 'Pending' THEN 1 ELSE 0 END) as pending,
                   SUM(CASE WHEN status_validasi = 'Disetujui' THEN 1 ELSE 0 END) as disetujui,
                   SUM(CASE WHEN status_validasi = 'Ditolak' THEN 1 ELSE 0 END) as ditolak
                   FROM logbooks";
    $counts = $conn->query($countQuery)->fetch();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $logbooks,
        'counts' => $counts
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid: ' . $e->getMessage()]);
}
?>
