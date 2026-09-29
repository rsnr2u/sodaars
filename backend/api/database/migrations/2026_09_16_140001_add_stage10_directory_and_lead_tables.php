<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Add public_directory_visible to organizations
        Schema::table('organizations', function (Blueprint $table) {
            $table->boolean('public_directory_visible')->default(true)->after('verification_status');
            $table->index(['status', 'verification_status', 'public_directory_visible'], 'org_public_visibility_idx');
        });

        // 2. Add slug to advertising_resources
        Schema::table('advertising_resources', function (Blueprint $table) {
            $table->string('slug', 255)->nullable()->unique()->after('code');
        });

        // 3. Backfill slugs for existing advertising resources safely
        $existingResources = DB::table('advertising_resources')
            ->join('locations', 'advertising_resources.location_id', '=', 'locations.id')
            ->select('advertising_resources.id', 'advertising_resources.code', 'advertising_resources.resource_type', 'locations.city')
            ->whereNull('advertising_resources.slug')
            ->get();

        $generatedSlugs = [];

        foreach ($existingResources as $resource) {
            $city = ! empty($resource->city) ? $resource->city : 'location';
            $type = ! empty($resource->resource_type) ? strtolower($resource->resource_type) : 'resource';
            $code = ! empty($resource->code) ? strtolower($resource->code) : (string) $resource->id;

            $baseSlug = Str::slug("{$city}-{$type}-{$code}");
            $slug = $baseSlug;
            $counter = 1;

            while (in_array($slug, $generatedSlugs, true) || DB::table('advertising_resources')->where('slug', $slug)->exists()) {
                $counter++;
                $slug = "{$baseSlug}-{$counter}";
            }

            $generatedSlugs[] = $slug;

            DB::table('advertising_resources')
                ->where('id', $resource->id)
                ->update(['slug' => $slug]);
        }

        // 4. Create directory_leads table
        Schema::create('directory_leads', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('advertising_resource_id')->nullable()->constrained('advertising_resources')->nullOnDelete();
            $table->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();

            // Immutable historical snapshots
            $table->string('resource_name_snapshot', 255)->nullable();
            $table->string('resource_code_snapshot', 100)->nullable();
            $table->char('resource_uuid_snapshot', 36)->nullable();
            $table->string('location_name_snapshot', 255)->nullable();
            $table->string('location_area_snapshot', 150)->nullable();
            $table->char('location_uuid_snapshot', 36)->nullable();

            // Visitor contact information
            $table->string('name', 150);
            $table->string('company_name', 150)->nullable();
            $table->string('email', 255);
            $table->string('phone', 50);
            $table->date('campaign_start_date')->nullable();
            $table->date('campaign_end_date')->nullable();
            $table->decimal('estimated_budget', 14, 2)->nullable();
            $table->text('message');

            // Metadata & status
            $table->string('source', 50)->default('PUBLIC_DIRECTORY');
            $table->string('status', 30)->default('NEW')->index();
            $table->text('internal_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'created_at']);
            $table->index(['advertising_resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directory_leads');

        Schema::table('advertising_resources', function (Blueprint $table) {
            $table->dropColumn('slug');
        });

        Schema::table('organizations', function (Blueprint $table) {
            $table->dropIndex('org_public_visibility_idx');
            $table->dropColumn('public_directory_visible');
        });
    }
};
