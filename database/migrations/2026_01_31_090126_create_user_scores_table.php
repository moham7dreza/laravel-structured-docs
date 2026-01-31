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
        Schema::create('user_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->integer('total_score')->default(0);
            $table->integer('docs_written_score')->default(0);
            $table->integer('reviews_score')->default(0);
            $table->integer('engagement_score')->default(0);
            $table->integer('penalty_score')->default(0);
            $table->enum('grade', ['S', 'A', 'B', 'C', 'D', 'F'])->default('F');
            $table->timestamp('updated_at')->nullable();

            $table->index('total_score');
            $table->index('grade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_scores');
    }
};
