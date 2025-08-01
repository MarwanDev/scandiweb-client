<?php

require_once __DIR__ . '/../models/OrderModel.php';

class OrderController
{
    private $orderModel;

    public function __construct($pdo)
    {
        $this->orderModel = new OrderModel($pdo);
    }

    public function createOrder($items)
    {
        return $this->orderModel->createOrder($items);
    }
}
