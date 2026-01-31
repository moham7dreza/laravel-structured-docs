<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserScore>
 */
class UserScoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $docsWritten = fake()->numberBetween(0, 500);
        $reviews = fake()->numberBetween(0, 300);
        $engagement = fake()->numberBetween(0, 200);
        $penalty = fake()->numberBetween(0, 100);

        $totalScore = $docsWritten + $reviews + $engagement - $penalty;

        return [
            'user_id' => \App\Models\User::factory(),
            'total_score' => max(0, $totalScore),
            'docs_written_score' => $docsWritten,
            'reviews_score' => $reviews,
            'engagement_score' => $engagement,
            'penalty_score' => $penalty,
            'grade' => $this->calculateGrade($totalScore),
            'updated_at' => now(),
        ];
    }

    private function calculateGrade(int $score): string
    {
        return match (true) {
            $score >= 900 => 'S',
            $score >= 700 => 'A',
            $score >= 500 => 'B',
            $score >= 300 => 'C',
            $score >= 100 => 'D',
            default => 'F',
        };
    }
}
