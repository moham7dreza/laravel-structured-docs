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
        Schema::create('document_branches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->string('task_id', 100)->comment('Jira task ID');
            $table->string('task_title', 500)->nullable();
            $table->string('branch_name');
            $table->string('repository_url', 500)->nullable();
            $table->timestamp('merged_at')->nullable();
            $table->timestamps();

            $table->index('document_id');
            $table->index('task_id');
            $table->index('branch_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_branches');
    }
};
