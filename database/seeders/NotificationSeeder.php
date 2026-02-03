<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Skipping notification seeding.');

            return;
        }

        $this->command->info('Creating notifications for users...');

        foreach ($users->take(10) as $user) {
            // Create 5-15 notifications per user
            $count = rand(5, 15);

            \App\Models\Notification::factory($count)->create([
                'user_id' => $user->id,
            ]);
        }

        $this->command->info('Notifications created successfully!');
    }
}
