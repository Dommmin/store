<?php

use App\Enums\RolesEnum;
use App\Models\Service;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

it('user cannot assign service to employee', function () {
    $user = User::factory()->create();

    $employee = User::factory()->create();
    $employee->assignRole(RolesEnum::Employee->value);

    $service = Service::factory()->create();

    actingAs($user);

    $response = postJson("/api/employees/$employee->slug/services", ['service_id' => $service->id]);
    $response->assertStatus(403);
});

it('manager can assign service to employee', function () {
    $manager = User::factory()->create();
    $manager->assignRole(RolesEnum::Manager->value);

    $employee = User::factory()->create();
    $employee->assignRole(RolesEnum::Employee->value);

    $service = Service::factory()->create();

    actingAs($manager);

    $response = postJson("/api/employees/$employee->slug/services", ['service_id' => $service->id]);
    $response->assertStatus(201);
});
