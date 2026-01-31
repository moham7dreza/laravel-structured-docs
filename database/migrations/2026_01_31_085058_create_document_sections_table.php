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
        Schema::create('document_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('structure_section_id')->constrained()->restrictOnDelete();
            $table->unsignedInteger('instance_number')->default(1)->comment('For repeatable sections');
            $table->boolean('is_complete')->default(false);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('document_id');
            $table->index('structure_section_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_sections');
    }
};
