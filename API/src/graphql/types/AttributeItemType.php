<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class AttributeItemType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'AttributeItem',
            'fields' => [
                'display_value' => Type::string(),
                'value' => Type::string(),
                'item_id' => Type::string(),
            ]
        ]);
    }
}
