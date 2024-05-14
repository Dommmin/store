<?php

declare(strict_types=1);

use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(Category::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Brand::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignIdFor(Collection::class)
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->string('name');
            $table->string('model');
            $table->string('url')->unique();
            $table->string('short_description');
            $table->text('description')->nullable();
            $table->fullText('description');
            $table->integer('price');
            $table->boolean('is_published')->default(false);
            $table->json('images');
            $table->timestamps();

            $table->index('category_id');
            $table->index('brand_id');
            $table->index('url');
            $table->index('collection_id');
            $table->index('price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
