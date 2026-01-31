<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LeaderboardCache>
 */
class LeaderboardCacheFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $totalScore = fake()->numberBetween(0, 1000);
        $previousRank = fake()->optional(0.7)->numberBetween(1, 100);
        $rank = fake()->numberBetween(1, 100);

        return [
            'user_id' => \App\Models\User::factory(),
            'rank' => $rank,
            'total_score' => $totalScore,
            'docs_written' => fake()->numberBetween(0, 50),
            'docs_reviewed' => fake()->numberBetween(0, 30),
            'docs_completed' => fake()->numberBetween(0, 20),
            'penalties_received' => fake()->numberBetween(0, 10),
            'grade' => $this->calculateGrade($totalScore),
            'previous_rank' => $previousRank,
            'rank_change' => $previousRank ? $previousRank - $rank : 0,
            'last_calculated_at' => fake()->dateTimeBetween('-1 day', 'now'),
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
