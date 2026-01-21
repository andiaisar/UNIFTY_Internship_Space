<?php
/**
 * Upload Profile Photo API
 * POST /user/upload-photo.php
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
    // Validate file
    if (!isset($_FILES['foto_profil']) || $_FILES['foto_profil']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'File foto harus diupload'
        ]);
        exit();
    }
    
    // Get current profile photo
    $stmt = $conn->prepare("SELECT foto_profil FROM users WHERE id = :id");
    $stmt->execute(['id' => $user_id]);
    $user = $stmt->fetch();
    
    // Delete old photo (if not default)
    if ($user['foto_profil'] && $user['foto_profil'] !== 'default-avatar.png') {
        FileUpload::delete($user['foto_profil']);
    }
    
    // Upload new photo
    $foto_profil = FileUpload::upload($_FILES['foto_profil'], 'profile');
    
    // Update database
    $stmt = $conn->prepare("UPDATE users SET foto_profil = :foto_profil WHERE id = :id");
    $stmt->execute([
        'foto_profil' => $foto_profil,
        'id' => $user_id
    ]);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Foto profil berhasil diupdate',
        'data' => [
            'foto_profil' => $foto_profil
        ]
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
