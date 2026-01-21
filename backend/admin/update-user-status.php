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
    
    // Get POST data
    $data = json_decode(file_get_contents("php://input"));
    
    if (!isset($data->user_id) || !isset($data->status)) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
        exit;
    }
    
    $user_id = $data->user_id;
    $status = $data->status;
    
    // Validate status
    if (!in_array($status, ['aktif', 'nonaktif'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Status tidak valid']);
        exit;
    }
    
    // Update user status
    $query = "UPDATE users SET status = ? WHERE user_id = ? AND role = 'magang'";
    $stmt = $conn->prepare($query);
    $stmt->execute([$status, $user_id]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Status user berhasil diupdate'
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User tidak ditemukan']);
    }
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid: ' . $e->getMessage()]);
}
?>
