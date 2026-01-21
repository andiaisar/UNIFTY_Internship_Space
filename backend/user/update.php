<?php
/**
 * Update User Profile API
 * POST /user/update.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';

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

// Validate required fields
if (empty($data['nama_lengkap'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Nama lengkap harus diisi'
    ]);
    exit();
}

$nama_lengkap = $data['nama_lengkap'];
$kampus = $data['kampus'] ?? null;
$email = $data['email'] ?? null;
$no_telp = $data['no_telp'] ?? null;

try {
    // Check if email already used by other user
    if (!empty($email)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email AND id != :id");
        $stmt->execute([
            'email' => $email,
            'id' => $user_id
        ]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'Email sudah digunakan oleh user lain'
            ]);
            exit();
        }
    }
    
    // Update profile
    $stmt = $conn->prepare("
        UPDATE users 
        SET nama_lengkap = :nama_lengkap,
            kampus = :kampus,
            email = :email,
            no_telp = :no_telp
        WHERE id = :id
    ");
    
    $stmt->execute([
        'nama_lengkap' => $nama_lengkap,
        'kampus' => $kampus,
        'email' => $email,
        'no_telp' => $no_telp,
        'id' => $user_id
    ]);
    
    // Get updated profile
    $stmt = $conn->prepare("
        SELECT id, nama_lengkap, nim_nip, kampus, email, no_telp, 
               foto_profil, role, status, created_at
        FROM users 
        WHERE id = :id
    ");
    $stmt->execute(['id' => $user_id]);
    $profile = $stmt->fetch();
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Profil berhasil diupdate',
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
