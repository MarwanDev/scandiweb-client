<?php
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class Types
{
    private static $productType;
    private static $categoryType;

    public static function product()
    {
        return self::$productType ?: (self::$productType = new ProductType());
    }

    public static function category()
    {
        return self::$categoryType ?: (self::$categoryType = new CategoryType());
    }

    public static function orderItemInput()
    {
        return new InputObjectType([
            'name' => 'OrderItemInput',
            'fields' => [
                'product_id' => Type::nonNull(Type::string()),
                'amount' => Type::nonNull(Type::int()),
            ],
        ]);
    }
}
