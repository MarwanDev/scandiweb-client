<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

require_once __DIR__ . '/../types/CategoryType.php';
require_once __DIR__ . '/../types/Types.php';
require_once __DIR__ . '/../../controllers/CategoryController.php';

class CategoryQuery extends ObjectType
{
    public function __construct($pdo)
    {
        $categoryController = new CategoryController($pdo);

        parent::__construct([
            'name' => 'Query',
            'fields' => [
                'categories' => [
                    'type' => Type::listOf(Types::category()),
                    'resolve' => fn() => $categoryController->getAll()
                ],
            ]
        ]);
    }
}
