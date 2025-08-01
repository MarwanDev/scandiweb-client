<?php

class OrderModel
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function createOrder($items)
    {
        $this->pdo->beginTransaction();

        try {
            $stmt = $this->pdo->prepare("INSERT INTO orders (timestamp) VALUES (CURRENT_TIMESTAMP)");
            $stmt->execute();
            $orderId = $this->pdo->lastInsertId();

            $stmtItem = $this->pdo->prepare(
                "INSERT INTO order_items (product_id, amount, order_id) VALUES (:product_id, :amount, :order_id)"
            );

            foreach ($items as $item) {
                $stmtItem->execute([
                    ':product_id' => $item['product_id'],
                    ':amount' => $item['amount'],
                    ':order_id' => $orderId
                ]);
            }

            $this->pdo->commit();
            return $orderId;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }
}
