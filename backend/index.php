<?php
/**
 * API Index - Root endpoint
 */

header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Absensi & Logbook API',
    'version' => '1.0.0',
    'endpoints' => [
        'auth' => [
            'POST /auth/login.php' => 'Login user',
            'POST /auth/register.php' => 'Register new user'
        ],
        'attendance' => [
            'GET /attendance/today.php' => 'Get today attendance',
            'GET /attendance/history.php' => 'Get attendance history',
            'GET /attendance/statistics.php' => 'Get attendance statistics',
            'POST /attendance/checkin.php' => 'Check-in',
            'POST /attendance/checkout.php' => 'Check-out'
        ],
        'logbook' => [
            'GET /logbook/my-logbooks.php' => 'Get user logbooks',
            'GET /logbook/detail.php' => 'Get logbook detail',
            'POST /logbook/create.php' => 'Create new logbook',
            'POST /logbook/update.php' => 'Update logbook',
            'POST /logbook/delete.php' => 'Delete logbook'
        ],
        'user' => [
            'GET /user/profile.php' => 'Get user profile',
            'POST /user/update.php' => 'Update user profile',
            'POST /user/upload-photo.php' => 'Upload profile photo'
        ]
    ]
]);
?>
