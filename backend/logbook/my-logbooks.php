<?php
/**
 * Get My Logbooks API
 * GET /logbook/my-logbooks.php?month=1&year=2026
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
    // Get logbooks for specific month/year
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, aktivitas, foto_kegiatan, status_validasi,
               komentar_admin, validated_at, created_at
        FROM logbooks 
        WHERE user_id = :user_id 
        AND MONTH(tanggal) = :month 
        AND YEAR(tanggal) = :year
        ORDER BY tanggal DESC, created_at DESC
    ");
    
    $stmt->execute([
        'user_id' => $user_id,
        'month' => $month,
        'year' => $year
    ]);
    
    $logbooks = $stmt->fetchAll();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $logbooks
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
