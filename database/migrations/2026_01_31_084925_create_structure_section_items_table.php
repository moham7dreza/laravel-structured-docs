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
        Schema::create('structure_section_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('section_id')->constrained('structure_sections')->cascadeOnDelete();
            $table->string('label');
            $table->text('description')->nullable();
            $table->enum('type', [
                'text',
                'textarea',
                'rich_text',
                'number',
                'date',
                'select',
                'multiselect',
                'checkbox',
                'radio',
                'file',
                'image',
                'link',
                'reference',
                'code',
                'checklist',
            ]);
            $table->boolean('is_required')->default(false);
            $table->json('validation_rules')->nullable()->comment('Validation rules as JSON object');
            $table->string('placeholder')->nullable();
            $table->text('default_value')->nullable();
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();

            $table->index('section_id');
            $table->index('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('structure_section_items');
    }
};
