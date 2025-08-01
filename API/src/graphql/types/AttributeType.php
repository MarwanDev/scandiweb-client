<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

require_once 'AttributeItemType.php';

class AttributeType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Attribute',
            'fields' => [
                'id' => Type::int(),
                'name' => Type::string(),
                'type' => Type::string(),
                'items' => Type::listOf(new AttributeItemType())
            ]
        ]);
    }
}
