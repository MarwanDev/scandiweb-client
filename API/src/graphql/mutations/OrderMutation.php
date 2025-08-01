<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

require_once __DIR__ . '/../types/OrderType.php';
require_once __DIR__ . '/../types/Types.php';
require_once __DIR__ . '/../../controllers/OrderController.php';

class OrderMutation extends ObjectType
{
    public function __construct($pdo)
    {
        $orderController = new OrderController($pdo);

        parent::__construct([
            'name' => 'Mutation',
            'fields' => [
                'createOrder' => [
                    'type' => Type::int(),
                    'args' => [
                        'items' => Type::listOf(Types::orderItemInput())
                    ],
                    'resolve' => function ($root, $args) use ($orderController) {
                        return $orderController->createOrder($args['items']);
                    }
                ]
            ]
        ]);
    }
}
