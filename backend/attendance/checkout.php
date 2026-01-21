<?php
/**
 * Check-out API
 * POST /attendance/checkout.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';

// Authenticate user
$user = JWT::authenticate();
$user_id = $user['user_id'];

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['attendance_id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Attendance ID harus diisi'
    ]);
    exit();
}

$attendance_id = $data['attendance_id'];

try {
    // Get attendance record
    $stmt = $conn->prepare("
        SELECT id, user_id, jam_keluar 
        FROM attendance 
        WHERE id = :id AND user_id = :user_id
    ");
    $stmt->execute([
        'id' => $attendance_id,
        'user_id' => $user_id
    ]);
    
    $attendance = $stmt->fetch();
    
    if (!$attendance) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Data absensi tidak ditemukan'
        ]);
        exit();
    }
    
    if ($attendance['jam_keluar']) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Anda sudah melakukan check-out'
        ]);
        exit();
    }
    
    // Update jam_keluar
    $stmt = $conn->prepare("
        UPDATE attendance 
        SET jam_keluar = CURTIME()
        WHERE id = :id
    ");
    $stmt->execute(['id' => $attendance_id]);
    
    // Get updated record
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, jam_masuk, jam_keluar, status, 
               foto_bukti, lokasi_lat, lokasi_long, durasi_kerja
        FROM attendance 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $attendance_id]);
    $attendance = $stmt->fetch();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Check-out berhasil',
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
