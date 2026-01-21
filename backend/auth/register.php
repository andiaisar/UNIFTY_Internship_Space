<?php
/**
 * Register API
 * POST /auth/register.php
 */

require_once __DIR__ . '/../config/database.php';

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (empty($data['nama_lengkap']) || empty($data['nim_nip']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Nama lengkap, NIM/NIP, dan password harus diisi'
    ]);
    exit();
}

// Validate password length
if (strlen($data['password']) < 6) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Password minimal 6 karakter'
    ]);
    exit();
}

$nama_lengkap = $data['nama_lengkap'];
$nim_nip = $data['nim_nip'];
$kampus = $data['kampus'] ?? null;
$email = $data['email'] ?? null;
$no_telp = $data['no_telp'] ?? null;
$password = password_hash($data['password'], PASSWORD_BCRYPT);

try {
    // Check if NIM/NIP already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE nim_nip = :nim_nip");
    $stmt->execute(['nim_nip' => $nim_nip]);
    
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'NIM/NIP sudah terdaftar'
        ]);
        exit();
    }
    
    // Check if email already exists (if provided)
    if (!empty($email)) {
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                'success' => false,
                'message' => 'Email sudah terdaftar'
            ]);
            exit();
        }
    }
    
    // Insert new user
    $stmt = $conn->prepare("
        INSERT INTO users (nama_lengkap, nim_nip, kampus, email, no_telp, password, role, status)
        VALUES (:nama_lengkap, :nim_nip, :kampus, :email, :no_telp, :password, 'magang', 'aktif')
    ");
    
    $stmt->execute([
        'nama_lengkap' => $nama_lengkap,
        'nim_nip' => $nim_nip,
        'kampus' => $kampus,
        'email' => $email,
        'no_telp' => $no_telp,
        'password' => $password
    ]);
    
    // Success response
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Registrasi berhasil! Silakan login.'
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
