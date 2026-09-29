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
        // 1. Enhance location_media table
        Schema::table('location_media', function (Blueprint $table) {
            $table->string('original_filename', 255)->nullable()->after('file_name');
            $table->string('storage_disk', 50)->default('public')->after('original_filename');
            $table->string('storage_path', 1024)->nullable()->after('storage_disk');
            $table->string('original_path', 1024)->nullable()->after('storage_path');
            $table->string('thumbnail_path', 1024)->nullable()->after('original_path');
            $table->unsignedInteger('width')->nullable()->after('thumbnail_path');
            $table->unsignedInteger('height')->nullable()->after('width');
            $table->string('alt_text', 255)->nullable()->after('height');
            $table->string('caption', 500)->nullable()->after('alt_text');
            $table->boolean('is_primary')->default(false)->after('caption');
            $table->string('media_type', 50)->default('SITE_PHOTO')->after('is_primary');
            $table->softDeletes()->after('updated_at');

            $table->index(['location_id', 'is_primary'], 'loc_media_loc_primary_idx');
            $table->index(['organization_id', 'deleted_at'], 'loc_media_org_deleted_idx');
        });

        // 2. Enhance advertising_resource_media table
        Schema::table('advertising_resource_media', function (Blueprint $table) {
            $table->string('original_filename', 255)->nullable()->after('file_name');
            $table->string('storage_disk', 50)->default('public')->after('original_filename');
            $table->string('storage_path', 1024)->nullable()->after('storage_disk');
            $table->string('original_path', 1024)->nullable()->after('storage_path');
            $table->string('thumbnail_path', 1024)->nullable()->after('original_path');
            $table->unsignedInteger('width')->nullable()->after('thumbnail_path');
            $table->unsignedInteger('height')->nullable()->after('width');
            $table->string('alt_text', 255)->nullable()->after('height');
            $table->string('caption', 500)->nullable()->after('alt_text');
            $table->boolean('is_primary')->default(false)->after('caption');
            $table->softDeletes()->after('updated_at');

            $table->index(['advertising_resource_id', 'is_primary'], 'adv_res_media_res_primary_idx');
            $table->index(['organization_id', 'deleted_at'], 'adv_res_media_org_deleted_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advertising_resource_media', function (Blueprint $table) {
            $table->dropIndex('adv_res_media_res_primary_idx');
            $table->dropIndex('adv_res_media_org_deleted_idx');
            $table->dropSoftDeletes();
            $table->dropColumn([
                'original_filename',
                'storage_disk',
                'storage_path',
                'original_path',
                'thumbnail_path',
                'width',
                'height',
                'alt_text',
                'caption',
                'is_primary',
            ]);
        });

        Schema::table('location_media', function (Blueprint $table) {
            $table->dropIndex('loc_media_loc_primary_idx');
            $table->dropIndex('loc_media_org_deleted_idx');
            $table->dropSoftDeletes();
            $table->dropColumn([
                'original_filename',
                'storage_disk',
                'storage_path',
                'original_path',
                'thumbnail_path',
                'width',
                'height',
                'alt_text',
                'caption',
                'is_primary',
                'media_type',
            ]);
        });
    }
};
