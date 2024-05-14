<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $product = Product::firstOrCreate()->id;

        User::each(function ($user) use ($product): void {
            Review::factory()->create([
                'product_id' => $product,
                'user_id' => $user->id,
            ]);
        });
    }
}
