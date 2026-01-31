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
        Schema::table('users', function (Blueprint $table) {
            $table->string('avatar')->nullable()->after('email');
            $table->string('telegram_chat_id')->nullable()->after('avatar');
            $table->integer('total_score')->default(0)->after('telegram_chat_id');
            $table->unsignedInteger('current_rank')->nullable()->after('total_score');

            $table->index('total_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['total_score']);
            $table->dropColumn(['avatar', 'telegram_chat_id', 'total_score', 'current_rank']);
        });
    }
};
