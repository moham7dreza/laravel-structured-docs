<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->randomElement([
            'Laravel', 'PHP', 'JavaScript', 'Vue.js', 'React', 'API', 'Database',
            'Security', 'Performance', 'Testing', 'DevOps', 'Docker', 'AWS',
            'Frontend', 'Backend', 'Mobile', 'Authentication', 'Authorization',
            'Caching', 'Queue', 'Notifications', 'Email', 'Payments', 'Search',
        ]);

        return [
            'name' => $name,
            'slug' => str($name)->slug(),
            'usage_count' => fake()->numberBetween(0, 100),
        ];
    }

    public function popular(): static
    {
        return $this->state(fn (array $attributes) => [
            'usage_count' => fake()->numberBetween(50, 200),
        ]);
    }
}
