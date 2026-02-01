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
        Schema::create('document_editor_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_editor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('structure_section_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['document_editor_id', 'structure_section_id'], 'editor_section_unique');
            $table->index('document_editor_id');
            $table->index('structure_section_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_editor_sections');
    }
};
