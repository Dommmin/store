<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            CollectionSeeder::class,
            AttributeSeeder::class,
            AttributeValueSeeder::class,
            SizeSeeder::class,
            ProductSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
