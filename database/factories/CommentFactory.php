<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'document_id' => \App\Models\Document::factory(),
            'parent_id' => null,
            'section_item_id' => null,
            'user_id' => \App\Models\User::factory(),
            'content' => fake()->paragraph(fake()->numberBetween(1, 4)),
            'is_resolved' => fake()->boolean(30),
            'resolved_by' => null,
            'resolved_at' => null,
        ];
    }

    public function reply(): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => \App\Models\Comment::factory(),
        ]);
    }

    public function inline(): static
    {
        return $this->state(fn (array $attributes) => [
            'section_item_id' => \App\Models\DocumentSectionItem::factory(),
        ]);
    }

    public function resolved(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_resolved' => true,
            'resolved_by' => \App\Models\User::factory(),
            'resolved_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}
