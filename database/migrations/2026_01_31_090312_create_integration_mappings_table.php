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
        Schema::create('integration_mappings', function (Blueprint $table) {
            $table->id();
            $table->string('local_entity_type', 100)->comment('document, user, category');
            $table->unsignedBigInteger('local_entity_id');
            $table->enum('service', ['confluence', 'jira', 'gitlab']);
            $table->string('external_entity_type', 100)->comment('page, issue, merge_request');
            $table->string('external_id');
            $table->text('external_url')->nullable();
            $table->boolean('sync_enabled')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->unique(['local_entity_type', 'local_entity_id', 'service', 'external_entity_type'], 'unique_mapping');
            $table->index(['local_entity_type', 'local_entity_id']);
            $table->index(['service', 'external_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('integration_mappings');
    }
};
