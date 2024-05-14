<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'rating' => $this->faker->numberBetween(1, 5),
            'body' => $this->faker->sentence(50),
            'image' => $this->faker->boolean ? $this->faker->imageUrl() : null,
            'confirmed_purchase' => $this->faker->boolean(),
            'approved' => $this->faker->boolean(),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'product_id' => Product::inRandomOrder()->firstOrCreate()->id,
            'user_id' => User::inRandomOrder()->firstOrCreate()->id,
        ];
    }
}
