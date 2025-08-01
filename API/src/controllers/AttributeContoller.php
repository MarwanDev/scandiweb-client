<?php

require_once __DIR__ . '/../models/AttributeModel.php';

class AttributeController
{
    private $model;

    public function __construct($pdo)
    {
        $this->model = new AttributeModel($pdo);
    }

    public function getAttributesByProductId($productId)
    {
        return $this->model->getAttributesByProductId($productId);
    }
}
