<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StructureSection>
 */
class StructureSectionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $position = 0;

        return [
            'structure_id' => \App\Models\Structure::factory(),
            'title' => fake()->randomElement([
                'Introduction',
                'Overview',
                'Prerequisites',
                'Installation',
                'Configuration',
                'Usage',
                'Examples',
                'API Reference',
                'Troubleshooting',
                'Conclusion',
            ]),
            'description' => fake()->sentence(8),
            'position' => $position++,
            'is_required' => fake()->boolean(70),
            'is_repeatable' => fake()->boolean(20),
            'min_items' => 0,
            'max_items' => fake()->optional(0.3)->numberBetween(1, 5),
        ];
    }

    public function withItems(): static
    {
        return $this->has(
            \App\Models\StructureSectionItem::factory()->count(fake()->numberBetween(2, 5)),
            'items'
        );
    }

    public function required(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_required' => true,
        ]);
    }
}
