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
        Schema::create('external_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['jira', 'gitlab_mr', 'gitlab_wiki', 'confluence', 'custom']);
            $table->text('url');
            $table->string('title', 500)->nullable();
            $table->boolean('is_valid')->default(true);
            $table->timestamp('last_validated_at')->nullable();
            $table->json('meta')->nullable()->comment('Additional metadata');
            $table->timestamps();

            $table->index('document_id');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('external_links');
    }
};
