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
            // Profile fields
            $table->text('bio')->nullable()->after('email');
            $table->string('location')->nullable()->after('bio');
            $table->string('website')->nullable()->after('location');
            $table->string('twitter')->nullable()->after('website');
            $table->string('github')->nullable()->after('twitter');

            // Email preferences
            $table->boolean('email_notifications')->default(true)->after('github');
            $table->boolean('email_comments')->default(true)->after('email_notifications');
            $table->boolean('email_mentions')->default(true)->after('email_comments');
            $table->boolean('email_followers')->default(true)->after('email_mentions');
            $table->boolean('email_newsletter')->default(true)->after('email_followers');

            // Notification preferences
            $table->string('theme')->default('system')->after('email_newsletter');
            $table->string('language')->default('en')->after('theme');

            // Privacy settings
            $table->boolean('profile_visible')->default(true)->after('language');
            $table->boolean('show_email')->default(false)->after('profile_visible');
            $table->boolean('show_activity')->default(true)->after('show_email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'bio',
                'location',
                'website',
                'twitter',
                'github',
                'email_notifications',
                'email_comments',
                'email_mentions',
                'email_followers',
                'email_newsletter',
                'theme',
                'language',
                'profile_visible',
                'show_email',
                'show_activity',
            ]);
        });
    }
};
