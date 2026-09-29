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
        Schema::create('advertising_resources', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('location_id')->constrained('locations')->cascadeOnDelete();

            $table->string('name', 255);
            $table->string('code', 100);

            $table->string('resource_type', 50)->index();
            $table->string('category', 20)->index();

            $table->unsignedSmallInteger('face_number')->default(1);
            $table->string('face_label', 50)->nullable();
            $table->string('direction', 100)->nullable();
            $table->string('traffic_flow', 150)->nullable();

            $table->decimal('width', 8, 2);
            $table->decimal('height', 8, 2);
            $table->string('dimension_unit', 20)->default('FEET');

            $table->string('illumination_type', 50)->default('NON_LIT')->index();
            $table->time('operating_hours_from')->nullable();
            $table->time('operating_hours_to')->nullable();

            // Digital screen attributes (meaningful when category = 'DIGITAL')
            $table->string('resolution', 50)->nullable();
            $table->string('pixel_pitch', 20)->nullable();
            $table->unsignedInteger('slot_duration_seconds')->nullable();
            $table->unsignedBigInteger('daily_impressions_estimate')->nullable();

            // Commercial reference rate card
            $table->decimal('base_price_monthly', 12, 2)->nullable();
            $table->string('currency', 3)->default('INR');

            $table->string('status', 50)->default('ACTIVE')->index();
            $table->text('description')->nullable();
            $table->text('installation_details')->nullable();
            $table->text('notes')->nullable();

            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'code']);
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'location_id']);
            $table->index(['location_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertising_resources');
    }
};
