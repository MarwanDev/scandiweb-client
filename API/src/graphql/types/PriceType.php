<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class PriceType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Price',
            'fields' => [
                'amount' => Type::string(),
                'currency_label' => Type::string(),
                'currency_symbol' => Type::string(),
            ]
        ]);
    }
}
