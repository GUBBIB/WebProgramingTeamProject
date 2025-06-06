<?php declare(strict_types=1);

/**
 * @license Apache 2.0
 */

namespace OpenApi\Attributes;

use OpenApi\Generator;
use OpenApi\Annotations as OA;

#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::IS_REPEATABLE)]
class Server extends OA\Server
{
    /**
     * @param ServerVariable[]         $variables
     * @param array<string,mixed>|null $x
     * @param Attachable[]|null        $attachables
     */
    public function __construct(
        ?string $url = null,
        ?string $description = null,
        ?array $variables = null,
        // annotation
        ?array $x = null,
        ?array $attachables = null
    ) {
        parent::__construct([
                'url' => $url ?? Generator::UNDEFINED,
                'description' => $description ?? Generator::UNDEFINED,
                'x' => $x ?? Generator::UNDEFINED,
                'attachables' => $attachables ?? Generator::UNDEFINED,
                'value' => $this->combine($variables),
            ]);
    }
}
