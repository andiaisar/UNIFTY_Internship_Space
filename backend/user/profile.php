<?php
/**
 * Get User Profile API
 * GET /user/profile.php
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
    // Get user profile
    $stmt = $conn->prepare("
        SELECT id, nama_lengkap, nim_nip, kampus, email, no_telp, 
               foto_profil, role, status, tanggal_mulai, tanggal_selesai, created_at
        FROM users 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $user_id]);
    
    $profile = $stmt->fetch();
    
    if (!$profile) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User tidak ditemukan'
        ]);
        exit();
    }
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $profile
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
