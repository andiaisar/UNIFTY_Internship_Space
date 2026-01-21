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
    
    if (!isset($data->logbook_id) || !isset($data->status)) {
        http_response_code(400);
        echo json_encode(['error' => 'Data tidak lengkap']);
        exit;
    }
    
    $logbook_id = $data->logbook_id;
    $status = $data->status;
    $catatan = isset($data->catatan) ? $data->catatan : null;
    $admin_id = $decoded->data->user_id;
    
    // Validate status
    if (!in_array($status, ['Disetujui', 'Ditolak'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Status tidak valid']);
        exit;
    }
    
    // Update logbook
    $query = "UPDATE logbooks 
              SET status_validasi = ?, 
                  catatan_validasi = ?, 
                  validated_at = NOW(),
                  validated_by = ?
              WHERE logbook_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->execute([$status, $catatan, $admin_id, $logbook_id]);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Logbook berhasil divalidasi'
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Logbook tidak ditemukan']);
    }
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Token tidak valid: ' . $e->getMessage()]);
}
?>
