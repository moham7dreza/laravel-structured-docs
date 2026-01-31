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
        Schema::create('document_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_section_id')->constrained()->cascadeOnDelete();
            $table->foreignId('structure_section_item_id')->constrained()->restrictOnDelete();
            $table->longText('content')->nullable()->comment('Can store JSON for complex types');
            $table->boolean('is_valid')->default(true);
            $table->json('validation_errors')->nullable();
            $table->foreignId('last_edited_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('last_edited_at')->nullable();
            $table->timestamps();

            $table->index('document_section_id');
            $table->index('structure_section_item_id');
            $table->index('last_edited_by');
            // Note: Use Meilisearch/Algolia for content search
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_section_items');
    }
};
