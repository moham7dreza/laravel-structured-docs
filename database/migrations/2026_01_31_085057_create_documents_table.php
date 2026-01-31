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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('title', 500);
            $table->string('slug', 500)->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('structure_id')->constrained()->restrictOnDelete();
            $table->foreignId('owner_id')->constrained('users')->restrictOnDelete();
            $table->enum('visibility', ['public', 'private', 'team'])->default('private');
            $table->enum('status', ['draft', 'pending_review', 'published', 'completed', 'stale', 'archived'])->default('draft');
            $table->enum('approval_status', ['not_submitted', 'pending', 'approved', 'rejected'])->default('not_submitted');
            $table->integer('total_score')->default(0);
            $table->decimal('completeness_percentage', 5, 2)->default(0.00)->comment('0-100');
            $table->unsignedInteger('view_count')->default(0);
            $table->unsignedInteger('comment_count')->default(0);
            $table->unsignedInteger('reaction_count')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('first_published_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('stale_detected_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('category_id');
            $table->index('structure_id');
            $table->index('owner_id');
            $table->index('status');
            $table->index('visibility');
            $table->index('total_score');
            $table->index('created_at');
            $table->index('last_activity_at');
            // Note: Use Meilisearch/Algolia for full-text search instead of DB fulltext
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
