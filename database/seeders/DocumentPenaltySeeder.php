<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\DocumentPenalty;
use App\Models\OutdatedRule;
use App\Models\User;
use Illuminate\Database\Seeder;

class DocumentPenaltySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Seeding document penalties...');

        // Get existing data
        $documents = Document::all();
        $rules = OutdatedRule::all();
        $users = User::all();

        if ($documents->isEmpty()) {
            $this->command->error('No documents found. Please run the main seeder first.');

            return;
        }

        if ($rules->isEmpty()) {
            $this->command->warn('No outdated rules found. Creating default rules...');
            $this->createDefaultRules();
            $rules = OutdatedRule::all();
        }

        if ($users->isEmpty()) {
            $this->command->error('No users found. Please run the main seeder first.');

            return;
        }

        // Clear existing penalties
        DocumentPenalty::query()->delete();
        $this->command->info('   ✓ Cleared existing penalties');

        // Apply penalties to random documents
        $penaltyCount = 0;
        $documentsTopenalize = $documents->shuffle()->take(min(15, $documents->count()));

        foreach ($documentsTopenalize as $index => $document) {
            $rule = $rules->random();
            $daysAgo = fake()->numberBetween(1, 45);
            $isResolved = $index < 5; // First 5 are resolved

            DocumentPenalty::create([
                'document_id' => $document->id,
                'rule_id' => $rule->id,
                'penalty_score' => $rule->penalty_score,
                'reason' => $this->generateReason($rule->condition_type, $document->title),
                'is_resolved' => $isResolved,
                'resolved_by' => $isResolved ? $users->random()->id : null,
                'resolved_at' => $isResolved ? now()->subDays(fake()->numberBetween(1, $daysAgo - 1)) : null,
                'applied_at' => now()->subDays($daysAgo),
            ]);

            $penaltyCount++;
        }

        $this->command->info("   ✓ Created {$penaltyCount} document penalties");
        $this->command->info("   ✓ Resolved: 5 penalties");
        $this->command->info("   ✓ Unresolved: ".($penaltyCount - 5).' penalties');

        $this->command->table(
            ['Status', 'Count'],
            [
                ['Total Penalties', DocumentPenalty::count()],
                ['Resolved', DocumentPenalty::where('is_resolved', true)->count()],
                ['Unresolved', DocumentPenalty::where('is_resolved', false)->count()],
                ['Average Penalty Score', round(DocumentPenalty::avg('penalty_score'), 1)],
            ]
        );

        $this->command->info('✅ Document penalty seeding complete!');
    }

    private function createDefaultRules(): void
    {
        OutdatedRule::create([
            'name' => 'Inactive for 30 days',
            'description' => 'Document has not been updated in 30 days',
            'condition_type' => 'days_inactive',
            'condition_params' => ['days' => 30],
            'penalty_score' => 10,
            'is_active' => true,
            'priority' => 1,
        ]);

        OutdatedRule::create([
            'name' => 'Inactive for 90 days',
            'description' => 'Document has not been updated in 90 days',
            'condition_type' => 'days_inactive',
            'condition_params' => ['days' => 90],
            'penalty_score' => 25,
            'is_active' => true,
            'priority' => 5,
        ]);

        OutdatedRule::create([
            'name' => 'Jira task closed',
            'description' => 'Associated Jira task is closed but document not updated',
            'condition_type' => 'jira_closed',
            'condition_params' => ['status' => 'Done'],
            'penalty_score' => 15,
            'is_active' => true,
            'priority' => 2,
        ]);

        OutdatedRule::create([
            'name' => 'Broken external link',
            'description' => 'External links return 404 or are unreachable',
            'condition_type' => 'link_broken',
            'condition_params' => ['check_interval' => 'daily'],
            'penalty_score' => 25,
            'is_active' => true,
            'priority' => 3,
        ]);

        OutdatedRule::create([
            'name' => 'Branch merged without update',
            'description' => 'Git branch was merged but document was not updated',
            'condition_type' => 'branch_merged',
            'condition_params' => ['grace_period_days' => 7],
            'penalty_score' => 20,
            'is_active' => true,
            'priority' => 4,
        ]);

        $this->command->info('   ✓ Created '.OutdatedRule::count().' default outdated rules');
    }

    private function generateReason(string $conditionType, string $documentTitle): string
    {
        return match ($conditionType) {
            'days_inactive' => "Document '{$documentTitle}' has not been updated for an extended period. Last modification exceeded the threshold.",
            'jira_closed' => "Associated Jira task for '{$documentTitle}' was closed but the document was not updated accordingly.",
            'link_broken' => "External links in '{$documentTitle}' are broken or unreachable. Please verify and update all external references.",
            'branch_merged' => "Git branch related to '{$documentTitle}' was merged but the document content was not updated.",
            'schema_changed' => "The structure schema for '{$documentTitle}' has changed but the document was not migrated to the new format.",
            default => "Document '{$documentTitle}' violated the rule criteria and requires attention.",
        };
    }
}
