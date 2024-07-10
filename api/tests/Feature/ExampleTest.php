<?php

declare(strict_types=1);

it('returns a successful response', function (): void {
    $response = $this->get('/api/v1/products');

    $response->assertStatus(200);
});
