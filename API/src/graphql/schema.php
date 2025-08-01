<?php

require_once '../vendor/autoload.php';
require_once __DIR__ . '/../config/database.php';

require_once 'types/ProductType.php';
require_once 'types/CategoryType.php';
require_once 'types/GalleryType.php';
require_once 'types/PriceType.php';
require_once 'types/AttributeType.php';
require_once 'types/AttributeItemType.php';
require_once 'queries/ProductQuery.php';
require_once 'queries/CategoryQuery.php';
require_once 'queries/RootQuery.php';
require_once 'mutations/OrderMutation.php';

use GraphQL\GraphQL;
use GraphQL\Type\Schema;
use GraphQL\Error\DebugFlag;
use GraphQL\Error\FormattedError;

$schema = new Schema([
    'query' => new RootQuery($pdo),
    'mutation' => new OrderMutation($pdo)
]);

try {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);
    $query = $input['query'] ?? '';
    $variables = $input['variables'] ?? [];

    $result = GraphQL::executeQuery($schema, $query, null, null, $variables);
    $output = $result->toArray(DebugFlag::INCLUDE_DEBUG_MESSAGE | DebugFlag::INCLUDE_TRACE);

} catch (\Exception $e) {
    $output = [
        'errors' => [FormattedError::createFromException($e)]
    ];
}

header('Content-Type: application/json');
echo json_encode($output, JSON_PRETTY_PRINT);
