<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuickTestSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Quick test seeding...');

        // Create admin user
        $this->command->info('👤 Creating admin user...');
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'avatar' => null,
            'total_score' => 1000,
            'current_rank' => 1,
        ]);

        // Create regular users
        $this->command->info('👥 Creating 5 users...');
        $users = User::factory(5)->create();

        // Create categories
        $this->command->info('📁 Creating categories...');
        $categories = Category::factory(3)->active()->create();

        // Create tags
        $this->command->info('🏷️  Creating tags...');
        $tags = Tag::factory(5)->create();

        $this->command->info('✅ Quick test seeding completed!');
        $this->command->newLine();
        $this->command->table(
            ['Entity', 'Count'],
            [
                ['Users', User::count()],
                ['Categories', Category::count()],
                ['Tags', Tag::count()],
            ]
        );
    }
}
