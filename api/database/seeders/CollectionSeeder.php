<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $collections = ['summer', 'winter', 'autumn', 'spring'];

        Collection::factory()->create();

        foreach ($collections as $collection) {
            Collection::factory()->create(['name' => $collection]);
        }
    }
}
