<?php
/**
 * Delete Logbook API
 * POST /logbook/delete.php
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

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (empty($data['id'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'ID logbook harus diisi'
    ]);
    exit();
}

$id = $data['id'];

try {
    // Get logbook
    $stmt = $conn->prepare("
        SELECT id, user_id, status_validasi, foto_kegiatan
        FROM logbooks 
        WHERE id = :id AND user_id = :user_id
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
    
    // Only allow delete if status is Pending
    if ($logbook['status_validasi'] !== 'Pending') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Logbook yang sudah divalidasi tidak dapat dihapus'
        ]);
        exit();
    }
    
    // Delete file if exists
    if ($logbook['foto_kegiatan']) {
        FileUpload::delete($logbook['foto_kegiatan']);
    }
    
    // Delete logbook
    $stmt = $conn->prepare("DELETE FROM logbooks WHERE id = :id AND user_id = :user_id");
    $stmt->execute([
        'id' => $id,
        'user_id' => $user_id
    ]);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logbook berhasil dihapus'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
