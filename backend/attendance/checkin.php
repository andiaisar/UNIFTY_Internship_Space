<?php
/**
 * Check-in API
 * POST /attendance/checkin.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';
require_once __DIR__ . '/../helpers/FileUpload.php';

// Authenticate user
$user = JWT::authenticate();
$user_id = $user['user_id'];

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

try {
    // Check if already checked in today
    $stmt = $conn->prepare("
        SELECT id FROM attendance 
        WHERE user_id = :user_id AND tanggal = CURDATE()
    ");
    $stmt->execute(['user_id' => $user_id]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Anda sudah melakukan check-in hari ini'
        ]);
        exit();
    }
    
    // Get form data
    $lokasi_lat = $_POST['lokasi_lat'] ?? null;
    $lokasi_long = $_POST['lokasi_long'] ?? null;
    
    // Handle file upload
    $foto_bukti = null;
    if (isset($_FILES['foto_bukti'])) {
        $foto_bukti = FileUpload::upload($_FILES['foto_bukti'], 'attendance');
    }
    
    // Insert attendance record
    $stmt = $conn->prepare("
        INSERT INTO attendance (user_id, tanggal, jam_masuk, status, foto_bukti, lokasi_lat, lokasi_long)
        VALUES (:user_id, CURDATE(), CURTIME(), 'Hadir', :foto_bukti, :lokasi_lat, :lokasi_long)
    ");
    
    $stmt->execute([
        'user_id' => $user_id,
        'foto_bukti' => $foto_bukti,
        'lokasi_lat' => $lokasi_lat,
        'lokasi_long' => $lokasi_long
    ]);
    
    $attendance_id = $conn->lastInsertId();
    
    // Get the created attendance record
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, jam_masuk, jam_keluar, status, 
               foto_bukti, lokasi_lat, lokasi_long
        FROM attendance 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $attendance_id]);
    $attendance = $stmt->fetch();
    
    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Check-in berhasil',
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
