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
        Schema::create('leaderboard_caches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('rank');
            $table->integer('total_score')->default(0);
            $table->unsignedInteger('docs_written')->default(0);
            $table->unsignedInteger('docs_reviewed')->default(0);
            $table->unsignedInteger('docs_completed')->default(0);
            $table->unsignedInteger('penalties_received')->default(0);
            $table->enum('grade', ['S', 'A', 'B', 'C', 'D', 'F'])->default('F');
            $table->unsignedInteger('previous_rank')->nullable();
            $table->integer('rank_change')->nullable()->comment('Positive = up, negative = down');
            $table->timestamp('last_calculated_at')->nullable();

            $table->index('rank');
            $table->index('total_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderboard_caches');
    }
};
