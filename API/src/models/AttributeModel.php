<?php

class AttributeModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAttributesByProductId($productId)
    {
        $stmt = $this->pdo->prepare("
            SELECT 
                name,
                type
            FROM attributes
            WHERE products.id = ?
        ");
        $stmt->execute([$productId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
