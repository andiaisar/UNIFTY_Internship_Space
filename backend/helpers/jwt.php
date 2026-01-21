<?php
/**
 * JWT Helper Functions
 * Untuk generate dan validate JWT token
 */

require_once __DIR__ . '/../config/database.php';

class JWT {
    
    /**
     * Generate JWT Token
     */
    public static function generate($user_id, $nim_nip, $role = 'magang') {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        $payload = json_encode([
            'user_id' => $user_id,
            'nim_nip' => $nim_nip,
            'role' => $role,
            'iat' => time(),
            'exp' => time() + JWT_EXPIRATION
        ]);
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);
        
        $signature = hash_hmac(
            'sha256',
            $base64UrlHeader . "." . $base64UrlPayload,
            JWT_SECRET,
            true
        );
        
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
    
    /**
     * Validate JWT Token
     */
    public static function validate($token) {
        if (!$token) {
            return false;
        }
        
        $tokenParts = explode('.', $token);
        if (count($tokenParts) !== 3) {
            return false;
        }
        
        list($header, $payload, $signature) = $tokenParts;
        
        $base64UrlHeader = $header;
        $base64UrlPayload = $payload;
        
        $signatureProvided = $signature;
        $signatureCalculated = self::base64UrlEncode(
            hash_hmac(
                'sha256',
                $base64UrlHeader . "." . $base64UrlPayload,
                JWT_SECRET,
                true
            )
        );
        
        if ($signatureProvided !== $signatureCalculated) {
            return false;
        }
        
        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);
        
        if (!isset($payload['exp']) || time() > $payload['exp']) {
            return false;
        }
        
        return $payload;
    }
    
    /**
     * Get token from Authorization header
     */
    public static function getTokenFromHeader() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    /**
     * Verify authentication and return user data
     */
    public static function authenticate() {
        $token = self::getTokenFromHeader();
        
        if (!$token) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'No token provided'
            ]);
            exit();
        }
        
        $payload = self::validate($token);
        
        if (!$payload) {
            http_response_code(401);
            echo json_encode([
                'success' => false,
                'message' => 'Invalid or expired token'
            ]);
            exit();
        }
        
        return $payload;
    }
    
    /**
     * Base64 URL Encode
     */
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    /**
     * Base64 URL Decode
     */
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
?>
