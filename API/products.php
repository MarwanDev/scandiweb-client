<?php
require_once 'config/database.php';

$stmt = $pdo->query("SELECT products.id, products.name, 
description, brand, in_stock, categories.name as `category` FROM products 
JOIN categories on categories.id = products.category_id");
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);

foreach ($products as &$product) {
    $productId = $product['id'];
    $galleryStmt = $pdo->prepare("SELECT image_url FROM galleries WHERE product_id = ?");
    $galleryStmt->execute([$productId]);
    $galleryImages = $galleryStmt->fetchAll(PDO::FETCH_ASSOC);
    $product['gallery'] = $galleryImages;

    $pricesStmt = $pdo->prepare("SELECT amount, currency_label, currency_symbol from prices WHERE product_id = ?");
    $pricesStmt->execute([$productId]);
    $prices = $pricesStmt->fetchAll(PDO::FETCH_ASSOC);
    $product['prices'] = $prices;

    $attributesStmt = $pdo->prepare("SELECT name, type, id from attributes WHERE product_id = ?");
    $attributesStmt->execute([$productId]);
    $attributes = $attributesStmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($attributes as &$attribute) {
        $attributeId = $attribute['id'];
        $attributeItemsStmt = $pdo->prepare("SELECT display_value, `value`, item_id from attribute_items WHERE attribute_id = ? AND product_id = ?");
        $attributeItemsStmt->execute([$attributeId, $productId]);
        $attributeItems = $attributeItemsStmt->fetchAll(PDO::FETCH_ASSOC);
        $attribute['items'] = $attributeItems;
    }
    $product['attributes'] = $attributes;
}

header('Content-Type: application/json');
echo json_encode($products, JSON_PRETTY_PRINT);
