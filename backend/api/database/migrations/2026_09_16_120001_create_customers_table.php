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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('code', 50);
            $table->string('customer_type', 30);
            $table->string('company_name', 255)->nullable();
            $table->string('brand_name', 255)->nullable();
            $table->string('contact_person', 255);
            $table->string('email', 255)->nullable();
            $table->string('phone', 50);
            $table->string('alternate_phone', 50)->nullable();
            $table->string('website', 255)->nullable();
            $table->text('billing_address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 100)->nullable();
            $table->string('pincode', 20)->nullable();
            $table->string('country', 100)->default('India');
            $table->string('gstin', 20)->nullable();
            $table->string('pan_number', 20)->nullable();
            $table->unsignedSmallInteger('credit_period_days')->default(30);
            $table->string('status', 30)->default('ACTIVE');
            $table->text('notes')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'code']);
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'customer_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
