<?php
/**
 * Get Attendance Statistics API
 * GET /attendance/statistics.php
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
    // Get attendance statistics
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as total_absen,
            SUM(CASE WHEN status = 'Hadir' THEN 1 ELSE 0 END) as total_hadir,
            SUM(CASE WHEN status = 'Izin' THEN 1 ELSE 0 END) as total_izin,
            SUM(CASE WHEN status = 'Sakit' THEN 1 ELSE 0 END) as total_sakit,
            SUM(CASE WHEN status = 'Alpha' THEN 1 ELSE 0 END) as total_alpha
        FROM attendance 
        WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user_id]);
    $attendance_stats = $stmt->fetch();
    
    // Get logbook statistics
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as total_logbook,
            SUM(CASE WHEN status_validasi = 'Pending' THEN 1 ELSE 0 END) as logbook_pending,
            SUM(CASE WHEN status_validasi = 'Disetujui' THEN 1 ELSE 0 END) as logbook_approved,
            SUM(CASE WHEN status_validasi = 'Ditolak' THEN 1 ELSE 0 END) as logbook_rejected
        FROM logbooks 
        WHERE user_id = :user_id
    ");
    $stmt->execute(['user_id' => $user_id]);
    $logbook_stats = $stmt->fetch();
    
    // Calculate attendance percentage
    $attendance_percentage = 0;
    if ($attendance_stats['total_absen'] > 0) {
        $attendance_percentage = round(
            ($attendance_stats['total_hadir'] / $attendance_stats['total_absen']) * 100,
            1
        );
    }
    
    // Combine statistics
    $statistics = array_merge($attendance_stats, $logbook_stats);
    $statistics['attendance_percentage'] = $attendance_percentage;
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $statistics
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
