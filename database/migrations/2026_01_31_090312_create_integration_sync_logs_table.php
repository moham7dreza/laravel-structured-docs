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
        Schema::create('integration_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->enum('service', ['confluence', 'jira', 'gitlab']);
            $table->enum('sync_type', ['push', 'pull', 'bidirectional']);
            $table->enum('status', ['pending', 'success', 'failed', 'conflict']);
            $table->string('external_id')->nullable();
            $table->json('request_payload')->nullable();
            $table->json('response_payload')->nullable();
            $table->text('error_message')->nullable();
            $table->integer('sync_duration')->nullable()->comment('milliseconds');
            $table->foreignId('synced_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('synced_at')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('document_id');
            $table->index('service');
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_sync_logs');
    }
};
