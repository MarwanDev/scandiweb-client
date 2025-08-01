<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class CategoryType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Category',
            'fields' => function () {
                return [
                    'id' => Type::nonNull(Type::id()),
                    'name' => Type::string(),
                ];
            }
        ]);
    }
}
