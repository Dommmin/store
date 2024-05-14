<?php

declare(strict_types=1);

use App\Models\User;
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
        Schema::create('orders', function (Blueprint $table): void {
            $table->id();
            $table->uuid();
            $table->string('stripe_checkout_session_id');
            $table->foreignIdFor(User::class)->constrained();
            $table->integer('total')->default(0);
            $table->string('currency')->default('pln');
            $table->string('status')->default('pending');
            $table->string('notes')->nullable();
            $table->json('billing_address');
            $table->json('shipping_address');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
