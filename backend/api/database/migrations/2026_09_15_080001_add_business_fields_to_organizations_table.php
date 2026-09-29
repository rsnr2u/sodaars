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
        Schema::table('organizations', function (Blueprint $table) {
            $table->string('contact_person', 255)->nullable()->after('name');
            $table->string('district', 100)->nullable()->after('city');
            $table->string('website', 255)->nullable()->after('country');
            $table->text('business_description')->nullable()->after('website');
            $table->string('gstin', 20)->nullable()->after('business_description');
            $table->string('pan', 20)->nullable()->after('gstin');
            $table->string('logo_url', 500)->nullable()->after('pan');
            $table->string('verification_status', 50)->default('PENDING')->index()->after('status');
            $table->timestamp('verified_at')->nullable()->after('verification_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('organizations', function (Blueprint $table) {
            $table->dropColumn([
                'contact_person',
                'district',
                'website',
                'business_description',
                'gstin',
                'pan',
                'logo_url',
                'verification_status',
                'verified_at',
            ]);
        });
    }
};
