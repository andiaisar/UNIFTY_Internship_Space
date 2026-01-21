<?php
/**
 * Get Today's Attendance API
 * GET /attendance/today.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';

// Authenticate user
$user = JWT::authenticate();
$user_id = $user['user_id'];

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Get today's attendance
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, jam_masuk, jam_keluar, status, 
               foto_bukti, lokasi_lat, lokasi_long, durasi_kerja
        FROM attendance 
        WHERE user_id = :user_id AND tanggal = CURDATE()
    ");
    $stmt->execute(['user_id' => $user_id]);
    
    $attendance = $stmt->fetch();
    
    if (!$attendance) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Belum ada absensi hari ini',
            'data' => null
        ]);
        exit();
    }
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $attendance
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
