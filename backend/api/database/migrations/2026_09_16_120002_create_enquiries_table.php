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
        Schema::create('enquiries', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
            $table->string('enquiry_number', 50);
            $table->foreignId('customer_id')->constrained('customers')->restrictOnDelete();
            $table->string('campaign_title', 255);
            $table->string('status', 30)->default('NEW');
            $table->string('priority', 20)->default('MEDIUM');
            $table->string('source', 30)->default('DIRECT_VISIT');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('estimated_budget', 14, 2)->nullable();
            $table->string('currency', 3)->default('INR');
            $table->foreignId('assigned_to_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('lost_reason', 255)->nullable();
            $table->text('requirements')->nullable();
            $table->text('internal_notes')->nullable();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['organization_id', 'enquiry_number']);
            $table->index(['organization_id', 'status']);
            $table->index(['organization_id', 'customer_id']);
            $table->index(['organization_id', 'assigned_to_user_id'], 'enq_org_assigned_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enquiries');
    }
};
