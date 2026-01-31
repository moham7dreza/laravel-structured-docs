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
        Schema::create('structure_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('structure_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_required')->default(false);
            $table->boolean('is_repeatable')->default(false)->comment('Can have multiple instances');
            $table->unsignedInteger('min_items')->default(0);
            $table->unsignedInteger('max_items')->nullable();
            $table->timestamps();

            $table->index('structure_id');
            $table->index('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structure_sections');
    }
};
