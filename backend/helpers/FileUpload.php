<?php
/**
 * File Upload Helper
 * Untuk handle upload file (foto)
 */

class FileUpload {
    
    /**
     * Upload file with validation
     */
    public static function upload($file, $directory = 'attendance') {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error');
        }
        
        // Validate file type
        $fileType = $file['type'];
        if (!in_array($fileType, ALLOWED_IMAGE_TYPES)) {
            throw new Exception('Invalid file type. Only JPG, JPEG, PNG allowed');
        }
        
        // Validate file size
        if ($file['size'] > MAX_FILE_SIZE) {
            throw new Exception('File size too large. Maximum 5MB');
        }
        
        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = uniqid() . '_' . time() . '.' . $extension;
        
        // Upload directory
        $uploadDir = UPLOAD_DIR . $directory . '/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        $destination = $uploadDir . $filename;
        
        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new Exception('Failed to move uploaded file');
        }
        
        // Return relative path
        return 'uploads/' . $directory . '/' . $filename;
    }
    
    /**
     * Delete file
     */
    public static function delete($filepath) {
        if (empty($filepath)) {
            return true;
        }
        
        $fullPath = __DIR__ . '/../' . $filepath;
        
        if (file_exists($fullPath)) {
            return unlink($fullPath);
        }
        
        return true;
    }
    
    /**
     * Validate image
     */
    public static function validateImage($file) {
        if (!isset($file) || $file['error'] !== UPLOAD_ERR_OK) {
            return false;
        }
        
        $fileType = $file['type'];
        return in_array($fileType, ALLOWED_IMAGE_TYPES);
    }
}
?>
