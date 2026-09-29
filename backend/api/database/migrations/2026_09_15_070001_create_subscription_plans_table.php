<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->unsignedInteger('min_resources')->default(1);
            $table->unsignedInteger('max_resources')->nullable();
            $table->decimal('monthly_price', 12, 2);
            $table->decimal('annual_price', 12, 2)->nullable();
            $table->string('currency', 3)->default('INR');
            $table->json('features')->nullable();
            $table->string('status', 50)->default('ACTIVE')->index();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
