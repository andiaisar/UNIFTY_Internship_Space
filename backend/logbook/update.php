<?php
/**
 * Update Logbook API
 * POST /logbook/update.php
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
    // Get form data
    $id = $_POST['id'] ?? null;
    $tanggal = $_POST['tanggal'] ?? null;
    $aktivitas = $_POST['aktivitas'] ?? null;
    
    // Validate required fields
    if (empty($id) || empty($tanggal) || empty($aktivitas)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'ID, tanggal, dan aktivitas harus diisi'
        ]);
        exit();
    }
    
    // Get existing logbook
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
    
    // Only allow edit if status is Pending
    if ($logbook['status_validasi'] !== 'Pending') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Logbook yang sudah divalidasi tidak dapat diubah'
        ]);
        exit();
    }
    
    // Handle file upload (optional)
    $foto_kegiatan = $logbook['foto_kegiatan'];
    if (isset($_FILES['foto_kegiatan']) && $_FILES['foto_kegiatan']['error'] === UPLOAD_ERR_OK) {
        // Delete old file
        if ($foto_kegiatan) {
            FileUpload::delete($foto_kegiatan);
        }
        // Upload new file
        $foto_kegiatan = FileUpload::upload($_FILES['foto_kegiatan'], 'logbook');
    }
    
    // Update logbook
    $stmt = $conn->prepare("
        UPDATE logbooks 
        SET tanggal = :tanggal, 
            aktivitas = :aktivitas, 
            foto_kegiatan = :foto_kegiatan
        WHERE id = :id AND user_id = :user_id
    ");
    
    $stmt->execute([
        'tanggal' => $tanggal,
        'aktivitas' => $aktivitas,
        'foto_kegiatan' => $foto_kegiatan,
        'id' => $id,
        'user_id' => $user_id
    ]);
    
    // Get updated logbook
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, aktivitas, foto_kegiatan, status_validasi,
               komentar_admin, created_at, updated_at
        FROM logbooks 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $id]);
    $logbook = $stmt->fetch();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Logbook berhasil diupdate',
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
