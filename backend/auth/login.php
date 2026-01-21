<?php
/**
 * Login API
 * POST /auth/login.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/jwt.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (empty($data['nim_nip']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'NIM/NIP dan password harus diisi'
    ]);
    exit();
}

$nim_nip = $data['nim_nip'];
$password = $data['password'];

try {
    // Get user from database
    $stmt = $conn->prepare("
        SELECT id, nama_lengkap, nim_nip, kampus, email, no_telp, 
               password, foto_profil, role, status
        FROM users 
        WHERE nim_nip = :nim_nip
    ");
    
    $stmt->execute(['nim_nip' => $nim_nip]);
    $user = $stmt->fetch();
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'NIM/NIP atau password salah'
        ]);
        exit();
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'NIM/NIP atau password salah'
        ]);
        exit();
    }
    
    // Check if user is active
    if ($user['status'] !== 'aktif') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'message' => 'Akun Anda tidak aktif. Hubungi administrator.'
        ]);
        exit();
    }
    
    // Generate JWT token
    $token = JWT::generate($user['id'], $user['nim_nip'], $user['role']);
    
    // Remove password from response
    unset($user['password']);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login berhasil',
        'token' => $token,
        'user' => $user
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
