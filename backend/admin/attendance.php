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
    $date = isset($_GET['date']) ? $_GET['date'] : date('Y-m-d');
    $user_id = isset($_GET['user_id']) ? $_GET['user_id'] : null;
    
    // Build query
    $query = "SELECT a.*, u.nama_lengkap, u.nim_nip,
              TIMEDIFF(a.waktu_keluar, a.waktu_masuk) as durasi
              FROM attendance a
              JOIN users u ON a.user_id = u.user_id
              WHERE DATE(a.waktu_masuk) = ?";
    
    $params = [$date];
    if ($user_id) {
        $query .= " AND a.user_id = ?";
        $params[] = intval($user_id);
    }
    
    $query .= " ORDER BY a.waktu_masuk DESC";
    
    $stmt = $conn->prepare($query);
    $stmt->execute($params);
    $attendance = $stmt->fetchAll();
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $attendance,
        'date' => $date
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid: ' . $e->getMessage()]);
}
?>
