<?php

require_once __DIR__ . '/../models/ProductModel.php';

class ProductController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new ProductModel($pdo);
    }

    public function getAll()
    {
        return $this->model->getAllProducts();
    }

    public function getByCategory($categoryId)
    {
        return $this->model->getProductsByCategoryId($categoryId);
    }

    public function getById($productId)
    {
        return $this->model->getProductById($productId);
    }
}
