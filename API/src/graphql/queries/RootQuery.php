<?php

use GraphQL\Type\Definition\ObjectType;

require_once __DIR__ . '/ProductQuery.php';
require_once __DIR__ . '/CategoryQuery.php';

class RootQuery extends ObjectType
{
    public function __construct($pdo)
    {
        $productQuery = new ProductQuery($pdo);
        $categoryQuery = new CategoryQuery($pdo);

        parent::__construct([
            'name' => 'Query',
            'fields' => array_merge(
                $productQuery->config['fields'],
                $categoryQuery->config['fields']
            )
        ]);
    }
}
