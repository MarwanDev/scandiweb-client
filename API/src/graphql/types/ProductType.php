<?php

use GraphQL\Type\Definition\Type;
use GraphQL\Type\Definition\ObjectType;

class ProductType extends ObjectType
{
    public function __construct()
    {
        parent::__construct([
            'name' => 'Product',
            'fields' => function () {
                return [
                    'id' => Type::nonNull(Type::id()),
                    'name' => Type::string(),
                    'description' => Type::string(),
                    'brand' => Type::string(),
                    'in_stock' => Type::boolean(),
                    'category' => Type::string(),

                    // Gallery images
                    'gallery' => [
                        'type' => Type::listOf(new GalleryType()),
                        'resolve' => function ($product) {
                            global $pdo;
                            $stmt = $pdo->prepare("SELECT image_url FROM galleries WHERE product_id = ?");
                            $stmt->execute([$product['id']]);
                            return $stmt->fetchAll(PDO::FETCH_ASSOC);
                        }
                    ],

                    // Prices
                    'prices' => [
                        'type' => Type::listOf(new PriceType()),
                        'resolve' => function ($product) {
                            global $pdo;
                            $stmt = $pdo->prepare("SELECT amount, currency_label, currency_symbol FROM prices WHERE product_id = ?");
                            $stmt->execute([$product['id']]);
                            return $stmt->fetchAll(PDO::FETCH_ASSOC);
                        }
                    ],

                    // Attributes and their items
                    'attributes' => [
                        'type' => Type::listOf(new AttributeType()),
                        'resolve' => function ($product) {
                            global $pdo;
                            $stmt = $pdo->prepare("SELECT id, name, type FROM attributes WHERE product_id = ?");
                            $stmt->execute([$product['id']]);
                            $attributes = $stmt->fetchAll(PDO::FETCH_ASSOC);

                            foreach ($attributes as &$attr) {
                                $stmtItems = $pdo->prepare("SELECT display_value, value, item_id FROM attribute_items WHERE attribute_id = ? AND product_id = ?");
                                $stmtItems->execute([$attr['id'], $product['id']]);
                                $attr['items'] = $stmtItems->fetchAll(PDO::FETCH_ASSOC);
                            }

                            return $attributes;
                        }
                    ]
                ];
            }
        ]);
    }
}
