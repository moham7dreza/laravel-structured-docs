<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Document>
 */
class DocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(fake()->numberBetween(3, 8));

        return [
            'title' => $title,
            'slug' => str($title)->slug(),
            'description' => fake()->paragraph(3),
            'image' => fake()->optional(0.5)->imageUrl(800, 400, 'documentation'),
            'category_id' => \App\Models\Category::factory(),
            'structure_id' => \App\Models\Structure::factory(),
            'owner_id' => \App\Models\User::factory(),
            'visibility' => fake()->randomElement(['public', 'private', 'team']),
            'status' => 'draft',
            'approval_status' => 'not_submitted',
            'total_score' => fake()->numberBetween(0, 100),
            'completeness_percentage' => fake()->randomFloat(2, 0, 100),
            'view_count' => fake()->numberBetween(0, 500),
            'comment_count' => fake()->numberBetween(0, 50),
            'reaction_count' => fake()->numberBetween(0, 100),
            'last_activity_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'published_at' => null,
            'first_published_at' => null,
            'completed_at' => null,
            'stale_detected_at' => null,
        ];
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'approval_status' => 'not_submitted',
            'published_at' => null,
            'completeness_percentage' => fake()->randomFloat(2, 20, 70),
        ]);
    }

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'approval_status' => 'approved',
            'visibility' => 'public',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'first_published_at' => fake()->dateTimeBetween('-6 months', '-3 months'),
            'completeness_percentage' => fake()->randomFloat(2, 80, 100),
            'total_score' => fake()->numberBetween(70, 100),
        ]);
    }

    public function pendingReview(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending_review',
            'approval_status' => 'pending',
            'completeness_percentage' => fake()->randomFloat(2, 85, 100),
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'approval_status' => 'approved',
            'completed_at' => fake()->dateTimeBetween('-3 months', 'now'),
            'published_at' => fake()->dateTimeBetween('-6 months', '-3 months'),
            'completeness_percentage' => 100.00,
            'total_score' => fake()->numberBetween(85, 100),
        ]);
    }

    public function stale(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'stale',
            'stale_detected_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'last_activity_at' => fake()->dateTimeBetween('-3 months', '-1 month'),
            'total_score' => fake()->numberBetween(30, 60),
        ]);
    }

    public function highQuality(): static
    {
        return $this->state(fn (array $attributes) => [
            'total_score' => fake()->numberBetween(85, 100),
            'completeness_percentage' => fake()->randomFloat(2, 90, 100),
            'view_count' => fake()->numberBetween(100, 1000),
            'comment_count' => fake()->numberBetween(10, 50),
            'reaction_count' => fake()->numberBetween(50, 200),
        ]);
    }

    public function withTags(): static
    {
        return $this->hasAttached(
            \App\Models\Tag::factory()->count(fake()->numberBetween(2, 5))
        );
    }
}
