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
        Schema::create('advertising_resource_media', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('advertising_resource_id')->constrained('advertising_resources')->cascadeOnDelete();
            $table->string('file_url', 2048);
            $table->string('file_name', 255)->nullable();
            $table->string('mime_type', 100)->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('media_type', 50)->default('DAY_PHOTO');
            $table->timestamps();

            $table->index(['advertising_resource_id', 'sort_order'], 'adv_res_media_res_sort_idx');
            $table->index(['organization_id', 'advertising_resource_id'], 'org_adv_res_media_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertising_resource_media');
    }
};
