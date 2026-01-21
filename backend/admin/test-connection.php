<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/database.php';

try {
    // Test database connection
    $testQuery = $conn->query("SELECT COUNT(*) as total_users FROM users WHERE role = 'magang'");
    $result = $testQuery->fetch();
    
    $testQuery2 = $conn->query("SELECT COUNT(*) as total_logbooks FROM logbooks WHERE status_validasi = 'Pending'");
    $result2 = $testQuery2->fetch();
    
    echo json_encode([
        'success' => true,
        'message' => 'Database connection OK',
        'data' => [
            'total_users' => $result['total_users'],
            'pending_logbooks' => $result2['total_logbooks'],
            'jwt_secret_defined' => defined('JWT_SECRET'),
            'db_connected' => true
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
