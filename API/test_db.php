<?php
require_once 'db.php';

try {
    $stmt = $pdo->query("SELECT 1");
    echo "✅ DB connected successfully!";
} catch (PDOException $e) {
    echo "❌ DB connection failed: " . $e->getMessage();
}
