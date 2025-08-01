<?php

require_once __DIR__ . '/../models/CategoryModel.php';

class CategoryController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new CategoryModel($pdo);
    }

    public function getAll()
    {
        return $this->model->getAllCategories();
    }
}
