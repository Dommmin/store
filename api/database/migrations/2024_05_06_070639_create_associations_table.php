<?php

declare(strict_types=1);

use App\Models\Attribute;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class() extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('associations', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('product_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->foreignIdFor(Product::class, 'variant_id')
                ->constrained('products')
                ->cascadeOnDelete();
            $table->foreignIdFor(Attribute::class)
                ->constrained()
                ->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['attribute_id', 'variant_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
