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
        Schema::create('document_changes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('section_item_id')->nullable()->constrained('document_section_items')->nullOnDelete();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->enum('change_type', ['create', 'update', 'delete']);
            $table->longText('old_content')->nullable();
            $table->longText('new_content')->nullable();
            $table->text('diff')->nullable()->comment('Unified diff format');
            $table->integer('line_number')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('document_id');
            $table->index('section_item_id');
            $table->index('user_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_changes');
    }
};
