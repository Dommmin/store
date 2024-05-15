<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $images = [];

        for ($i = 0; $i < 5; $i++) {
            $images[] = [
                'path' => $this->faker->imageUrl(),
                'url' => $this->faker->imageUrl(),
            ];
        }

        $name = $this->faker->name();

        return [
            'name' => $name,
            'url' => Str::slug($name),
            'model' => $this->faker->sentence(2),
            'short_description' => $this->faker->sentence(10),
            'description' => $this->faker->sentence(50),
            'price' => $this->faker->numberBetween(100, 100000),
            'is_published' => $this->faker->boolean(),
            'images' => $images,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),

            'category_id' => Category::inRandomOrder()->firstOrCreate()->id,
            'brand_id' => Brand::inRandomOrder()->firstOrCreate()->id,
            'collection_id' => $this->faker->boolean() ? Collection::inRandomOrder()->firstOrCreate()->id : null,
        ];
    }
}
