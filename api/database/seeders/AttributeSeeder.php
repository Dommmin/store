<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Attribute;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $attributes = [
            'color',
            'memory',
            'storage',
            'screen size',
        ];

        foreach ($attributes as $attribute) {
            Attribute::factory()->create([
                'name' => $attribute,
            ]);
        }

    }
}
