<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StructureSectionItem>
 */
class StructureSectionItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $position = 0;

        $type = fake()->randomElement([
            'text', 'textarea', 'rich_text', 'number', 'date',
            'select', 'checkbox', 'file', 'link', 'code',
        ]);

        return [
            'section_id' => \App\Models\StructureSection::factory(),
            'label' => fake()->words(3, true),
            'description' => fake()->sentence(8),
            'type' => $type,
            'is_required' => fake()->boolean(60),
            'validation_rules' => $this->getValidationRules($type),
            'placeholder' => fake()->optional(0.7)->sentence(3),
            'default_value' => fake()->optional(0.3)->word(),
            'position' => $position++,
        ];
    }

    private function getValidationRules(string $type): ?array
    {
        return match ($type) {
            'text' => ['min' => 3, 'max' => 255],
            'textarea' => ['min' => 10, 'max' => 1000],
            'rich_text' => ['min' => 50, 'max' => 5000],
            'number' => ['min' => 0, 'max' => 999999],
            'select' => ['options' => ['Option 1', 'Option 2', 'Option 3']],
            'file' => ['max_size' => 5120, 'allowed_types' => ['pdf', 'docx']],
            default => null,
        };
    }
}
