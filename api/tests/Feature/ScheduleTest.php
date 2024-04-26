<?php

use App\Enums\RolesEnum;
use App\Models\Service;
use App\Models\User;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\postJson;

function getScheduleData($employeeId, $serviceId): array
{
    return [
        'employee_id' => $employeeId,
        'service_id' => $serviceId,
        'monday_starts_at' => '09:00:00',
        'monday_ends_at' => '17:00:00',
        'tuesday_starts_at' => '09:00:00',
        'tuesday_ends_at' => '17:00:00',
        'wednesday_starts_at' => '09:00:00',
        'wednesday_ends_at' => '17:00:00',
        'thursday_starts_at' => '09:00:00',
        'thursday_ends_at' => '17:00:00',
        'friday_starts_at' => '09:00:00',
        'friday_ends_at' => '17:00:00',
        'saturday_starts_at' => '09:00:00',
        'saturday_ends_at' => '17:00:00',
        'sunday_starts_at' => '09:00:00',
        'sunday_ends_at' => '17:00:00',
    ];
}

it('user cannot create a schedule for an employee', function () {
    $employee = User::factory()->create();
    $employee->assignRole(RolesEnum::Employee->value);

    $user = User::factory()->create();
    $service = Service::factory()->create();

    $schedules = getScheduleData($employee->id, $service->id);

    actingAs($user);

    $response = postJson("/api/employees/$employee->slug/schedule", $schedules);
    $response->assertStatus(403);
});

it('admin can create a schedule for an employee', function () {
    $employee = User::factory()->create();
    $employee->assignRole(RolesEnum::Employee->value);

    $admin = User::factory()->create();
    $admin->assignRole(RolesEnum::Admin->value);

    $service = Service::factory()->create();

    $schedules = getScheduleData($employee->id, $service->id);

    actingAs($admin);

    $response = postJson("/api/employees/$employee->slug/schedule", $schedules);
    $response->assertStatus(201);
});

it('admin cannot create a schedule for an user that is not an employee', function () {
    $user = User::factory()->create();

    $admin = User::factory()->create();
    $admin->assignRole(RolesEnum::Admin->value);

    $service = Service::factory()->create();

    $schedules = getScheduleData($user->id, $service->id);

    actingAs($admin);

    $response = postJson("/api/employees/$user->slug/schedule", $schedules);
    $response->assertStatus(403);
});
