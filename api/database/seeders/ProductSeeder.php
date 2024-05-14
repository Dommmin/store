<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $total = 1000;

        $consoleOutput = $this->command->getOutput();
        $consoleOutput->progressStart($total);

        for ($i = 0; $i < $total; $i++) {
            $this->createProduct();
            $consoleOutput->progressAdvance();
        }
    }

    protected function createProduct(): void
    {
        Product::factory()->create();
    }
}
