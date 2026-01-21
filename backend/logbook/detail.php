<?php
/**
 * Get Logbook Detail API
 * GET /logbook/detail.php?id=1
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

$id = $_GET['id'] ?? null;

if (empty($id)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'ID logbook harus diisi'
    ]);
    exit();
}

try {
    // Get logbook detail
    $stmt = $conn->prepare("
        SELECT l.*, u.nama_lengkap, u.nim_nip,
               v.nama_lengkap as validator_name
        FROM logbooks l
        LEFT JOIN users u ON l.user_id = u.id
        LEFT JOIN users v ON l.validated_by = v.id
        WHERE l.id = :id AND l.user_id = :user_id
    ");
    
    $stmt->execute([
        'id' => $id,
        'user_id' => $user_id
    ]);
    
    $logbook = $stmt->fetch();
    
    if (!$logbook) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Logbook tidak ditemukan'
        ]);
        exit();
    }
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $logbook
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
