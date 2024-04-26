<?php

use App\Models\Service;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\postJson;

it('creates an appointment', function () {
    $user = User::factory()->create();
    $employee = User::factory()->create();

    $service = Service::factory()->create([
        'duration' => 30
    ]);

    actingAs($user);

    $starts_at_date = '2025-01-01';
    $starts_at_time = '10:00:00';

    $data = [
        'service' => $service->id,
        'employee' => $employee->id,
        'starts_at_date' => $starts_at_date,
        'starts_at_time' => $starts_at_time,
    ];

    $response = postJson("/api/appointments/$service->slug/$employee->slug", $data);
    $response->assertSuccessful();

    assertDatabaseHas('appointments', [
        'starts_at_date' => $starts_at_date,
        'starts_at_time' => $starts_at_time,
        'service_id' => $service->id,
        'employee_id' => $employee->id,
        'client_id' => $user->id
    ]);
});
