<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Structure>
 */
class StructureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => \App\Models\Category::factory(),
            'title' => fake()->randomElement([
                'API Documentation Template',
                'Technical Guide Structure',
                'Tutorial Format',
                'Architecture Document Template',
                'Troubleshooting Guide Format',
            ]),
            'description' => fake()->sentence(10),
            'version' => 1,
            'is_active' => true,
            'is_default' => false,
        ];
    }

    public function withSections(): static
    {
        return $this->has(
            \App\Models\StructureSection::factory()->count(3)->withItems(),
            'sections'
        );
    }

    public function asDefault(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }
}
