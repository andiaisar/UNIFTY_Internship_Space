<?php
/**
 * Get Attendance History API
 * GET /attendance/history.php?month=1&year=2026
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

$month = $_GET['month'] ?? date('n');
$year = $_GET['year'] ?? date('Y');

try {
    // Get attendance history for specific month/year
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, jam_masuk, jam_keluar, status, 
               foto_bukti, lokasi_lat, lokasi_long, durasi_kerja, keterangan
        FROM attendance 
        WHERE user_id = :user_id 
        AND MONTH(tanggal) = :month 
        AND YEAR(tanggal) = :year
        ORDER BY tanggal DESC
    ");
    
    $stmt->execute([
        'user_id' => $user_id,
        'month' => $month,
        'year' => $year
    ]);
    
    $history = $stmt->fetchAll();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $history
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
