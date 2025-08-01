<?php

class ProductModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllProducts()
    {
        $stmt = $this->pdo->query("
            SELECT 
                products.id,
                products.name,
                products.description,
                products.brand,
                products.in_stock,
                categories.name AS category
            FROM products
            JOIN categories ON categories.id = products.category_id
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductsByCategoryId($categoryId)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                products.id,
                products.name,
                products.description,
                products.brand,
                products.in_stock,
                categories.name AS category
            FROM products
            JOIN categories ON categories.id = products.category_id
            WHERE categories.id = ?
        ");
        $stmt->execute([$categoryId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getProductById($productId)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                products.id,
                products.name,
                products.description,
                products.brand,
                products.in_stock,
                categories.name AS category
            FROM products
            JOIN categories ON categories.id = products.category_id
            WHERE products.id = ?
            LIMIT 1
        ");
        $stmt->execute([$productId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
