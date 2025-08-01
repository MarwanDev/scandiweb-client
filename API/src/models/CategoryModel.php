<?php

class CategoryModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAllCategories()
    {
        $stmt = $this->pdo->query("
            SELECT 
                id,
                name
            FROM categories
        ");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
