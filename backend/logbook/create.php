<?php
/**
 * Create Logbook API
 * POST /logbook/create.php
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
    $tanggal = $_POST['tanggal'] ?? date('Y-m-d');
    $aktivitas = $_POST['aktivitas'] ?? null;
    
    // Validate required fields
    if (empty($aktivitas)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Aktivitas harus diisi'
        ]);
        exit();
    }
    
    // Handle file upload (optional)
    $foto_kegiatan = null;
    if (isset($_FILES['foto_kegiatan']) && $_FILES['foto_kegiatan']['error'] === UPLOAD_ERR_OK) {
        $foto_kegiatan = FileUpload::upload($_FILES['foto_kegiatan'], 'logbook');
    }
    
    // Insert logbook
    $stmt = $conn->prepare("
        INSERT INTO logbooks (user_id, tanggal, aktivitas, foto_kegiatan, status_validasi)
        VALUES (:user_id, :tanggal, :aktivitas, :foto_kegiatan, 'Pending')
    ");
    
    $stmt->execute([
        'user_id' => $user_id,
        'tanggal' => $tanggal,
        'aktivitas' => $aktivitas,
        'foto_kegiatan' => $foto_kegiatan
    ]);
    
    $logbook_id = $conn->lastInsertId();
    
    // Get the created logbook
    $stmt = $conn->prepare("
        SELECT id, user_id, tanggal, aktivitas, foto_kegiatan, status_validasi,
               komentar_admin, created_at
        FROM logbooks 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $logbook_id]);
    $logbook = $stmt->fetch();
    
    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Logbook berhasil ditambahkan',
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
