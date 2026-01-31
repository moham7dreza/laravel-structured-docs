<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Technical Documentation',
            'API References',
            'User Guides',
            'Architecture & Design',
            'Database Documentation',
            'DevOps & Infrastructure',
            'Security Guidelines',
            'Best Practices',
            'Troubleshooting',
            'Release Notes',
        ]);

        return [
            'name' => $name,
            'slug' => str($name)->slug(),
            'description' => fake()->sentence(12),
            'icon' => fake()->randomElement([
                'heroicon-o-book-open',
                'heroicon-o-wrench-screwdriver',
                'heroicon-o-document-text',
                'heroicon-o-cube-transparent',
                'heroicon-o-circle-stack',
                'heroicon-o-rocket-launch',
                'heroicon-o-lock-closed',
                'heroicon-o-sparkles',
                'heroicon-o-magnifying-glass',
                'heroicon-o-clipboard-document-list',
            ]),
            'color' => fake()->hexColor(),
            'is_active' => fake()->boolean(90),
        ];
    }

    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
