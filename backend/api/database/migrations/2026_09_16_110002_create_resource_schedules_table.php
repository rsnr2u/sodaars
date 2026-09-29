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
        Schema::create('resource_schedules', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->foreignId('advertising_resource_id')->constrained('advertising_resources')->cascadeOnDelete();

            $table->string('title', 255)->nullable();
            $table->string('block_type', 30)->index();
            $table->string('status', 20)->default('CONFIRMED')->index();

            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedSmallInteger('slots_count')->default(1);

            $table->timestamp('hold_expires_at')->nullable()->index();

            $table->string('reference_type', 100)->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->text('notes')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['organization_id', 'start_date', 'end_date'], 'res_sched_org_dates_idx');
            $table->index(['advertising_resource_id', 'start_date', 'end_date'], 'res_sched_res_dates_idx');
            $table->index(['advertising_resource_id', 'status'], 'res_sched_res_status_idx');
            $table->index(['advertising_resource_id', 'block_type'], 'res_sched_res_type_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_schedules');
    }
};
