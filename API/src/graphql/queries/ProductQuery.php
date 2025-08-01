<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

require_once __DIR__ . '/../types/ProductType.php';
require_once __DIR__ . '/../types/Types.php';
require_once __DIR__ . '/../../controllers/ProductController.php';

class ProductQuery extends ObjectType
{
    public function __construct($pdo)
    {
        $productController = new ProductController($pdo);

        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'products' => [
                    'type' => Type::listOf(Types::product()),
                    'resolve' => fn() => $productController->getAll()
                ],
                'productsByCategory' => [
                    'type' => Type::listOf(Types::product()),
                    'args' => [
                        'categoryId' => Type::nonNull(Type::id())
                    ],
                    'resolve' => fn($root, $args) => $productController->getByCategory($args['categoryId'])
                ],
                'product' => [
                    'type' => Types::product(),
                    'args' => [
                        'id' => Type::nonNull(Type::string())
                    ],
                    'resolve' => fn($root, $args) => $productController->getById($args['id'])
                ]
            ]
        ]);
    }
}
