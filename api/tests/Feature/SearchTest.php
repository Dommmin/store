<?php

declare(strict_types=1);

it('returns a list of posts', function (): void {
    $response = $this->get('/api/search');

    $response->assertStatus(200);
});
