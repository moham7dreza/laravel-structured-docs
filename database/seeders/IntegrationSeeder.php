<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\IntegrationMapping;
use App\Models\IntegrationSyncLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class IntegrationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Seeding integration data...');

        // Get existing data
        $documents = Document::all();
        $users = User::all();

        if ($documents->isEmpty()) {
            $this->command->error('No documents found. Please run the main seeder first.');

            return;
        }

        if ($users->isEmpty()) {
            $this->command->error('No users found. Please run the main seeder first.');

            return;
        }

        // Clear existing integration data
        IntegrationSyncLog::query()->delete();
        IntegrationMapping::query()->delete();
        $this->command->info('   ✓ Cleared existing integration data');

        // Create integration mappings
        $mappingCount = 0;
        $services = ['confluence', 'jira', 'gitlab'];
        $documentsToMap = $documents->shuffle()->take(min(12, $documents->count()));

        $mappings = [];
        foreach ($documentsToMap as $index => $document) {
            $service = $services[$index % 3];

            $mapping = IntegrationMapping::create([
                'local_entity_type' => 'document',
                'local_entity_id' => $document->id,
                'service' => $service,
                'external_entity_type' => $this->getExternalEntityType($service),
                'external_id' => $this->generateExternalId($service, $index),
                'external_url' => $this->generateExternalUrl($service, $index),
                'sync_enabled' => $index < 10, // First 10 have sync enabled
                'last_synced_at' => $index < 8 ? now()->subDays(fake()->numberBetween(1, 7)) : null,
            ]);

            $mappings[] = $mapping;
            $mappingCount++;
        }

        $this->command->info("   ✓ Created {$mappingCount} integration mappings");

        // Create sync logs for mappings that have been synced
        $logCount = 0;
        $syncStatuses = ['success', 'success', 'success', 'failed', 'conflict'];
        $syncTypes = ['push', 'pull', 'bidirectional'];

        foreach ($mappings as $mapping) {
            if ($mapping->last_synced_at) {
                // Create 1-3 sync logs per mapping
                $numLogs = fake()->numberBetween(1, 3);

                for ($i = 0; $i < $numLogs; $i++) {
                    $status = fake()->randomElement($syncStatuses);
                    $duration = $status === 'success' ? fake()->numberBetween(100, 1500) : fake()->numberBetween(2000, 5000);
                    $daysAgo = fake()->numberBetween($i * 2, $i * 2 + 5);

                    IntegrationSyncLog::create([
                        'document_id' => $mapping->local_entity_id, // Use document_id instead of mapping_id
                        'service' => $mapping->service,
                        'sync_type' => fake()->randomElement($syncTypes),
                        'status' => $status,
                        'external_id' => $mapping->external_id,
                        'request_payload' => json_encode($this->generateRequestPayload($mapping->service)),
                        'response_payload' => $status === 'success' ? json_encode($this->generateResponsePayload($mapping->service)) : null,
                        'error_message' => $status === 'failed' ? $this->generateErrorMessage($mapping->service) : null,
                        'sync_duration' => $duration,
                        'synced_by' => fake()->boolean(70) ? $users->random()->id : null,
                        'synced_at' => now()->subDays($daysAgo)->subHours(fake()->numberBetween(0, 23)),
                    ]);

                    $logCount++;
                }
            }
        }

        $this->command->info("   ✓ Created {$logCount} sync logs");

        // Display statistics
        $this->command->table(
            ['Metric', 'Count'],
            [
                ['Total Mappings', IntegrationMapping::count()],
                ['Confluence Mappings', IntegrationMapping::where('service', 'confluence')->count()],
                ['Jira Mappings', IntegrationMapping::where('service', 'jira')->count()],
                ['GitLab Mappings', IntegrationMapping::where('service', 'gitlab')->count()],
                ['Sync Enabled', IntegrationMapping::where('sync_enabled', true)->count()],
                ['Total Sync Logs', IntegrationSyncLog::count()],
                ['Successful Syncs', IntegrationSyncLog::where('status', 'success')->count()],
                ['Failed Syncs', IntegrationSyncLog::where('status', 'failed')->count()],
                ['Average Sync Duration', round(IntegrationSyncLog::avg('sync_duration'), 0).' ms'],
            ]
        );

        $this->command->info('✅ Integration seeding complete!');
    }

    private function getExternalEntityType(string $service): string
    {
        return match ($service) {
            'confluence' => 'page',
            'jira' => 'issue',
            'gitlab' => 'merge_request',
            default => 'unknown',
        };
    }

    private function generateExternalId(string $service, int $index): string
    {
        return match ($service) {
            'confluence' => 'PAGE-'.str_pad((string) ($index + 100), 3, '0', STR_PAD_LEFT),
            'jira' => 'PROJ-'.($index + 100),
            'gitlab' => 'MR-'.($index + 100),
            default => 'EXT-'.$index,
        };
    }

    private function generateExternalUrl(string $service, int $index): string
    {
        $externalId = $this->generateExternalId($service, $index);

        return match ($service) {
            'confluence' => 'https://company.atlassian.net/wiki/spaces/DOCS/pages/'.$externalId,
            'jira' => 'https://company.atlassian.net/browse/'.$externalId,
            'gitlab' => 'https://gitlab.company.com/project/merge_requests/'.($index + 100),
            default => 'https://external-system.com/entity/'.$index,
        };
    }

    private function generateRequestPayload(string $service): array
    {
        return match ($service) {
            'confluence' => [
                'type' => 'page',
                'title' => fake()->sentence(5),
                'space' => ['key' => 'DOCS'],
                'body' => [
                    'storage' => [
                        'value' => fake()->paragraph(),
                        'representation' => 'storage',
                    ],
                ],
            ],
            'jira' => [
                'fields' => [
                    'project' => ['key' => 'PROJ'],
                    'summary' => fake()->sentence(6),
                    'description' => fake()->paragraph(),
                    'issuetype' => ['name' => 'Task'],
                ],
            ],
            'gitlab' => [
                'title' => fake()->sentence(6),
                'description' => fake()->paragraph(),
                'source_branch' => 'feature/'.fake()->word(),
                'target_branch' => 'main',
            ],
            default => ['data' => 'unknown'],
        };
    }

    private function generateResponsePayload(string $service): array
    {
        return match ($service) {
            'confluence' => [
                'id' => fake()->numberBetween(100000, 999999),
                'type' => 'page',
                'status' => 'current',
                'version' => ['number' => fake()->numberBetween(1, 10)],
            ],
            'jira' => [
                'id' => fake()->numberBetween(10000, 99999),
                'key' => 'PROJ-'.fake()->numberBetween(100, 999),
                'self' => 'https://company.atlassian.net/rest/api/2/issue/'.fake()->numberBetween(10000, 99999),
            ],
            'gitlab' => [
                'id' => fake()->numberBetween(100, 999),
                'iid' => fake()->numberBetween(100, 999),
                'state' => 'opened',
                'web_url' => 'https://gitlab.company.com/project/merge_requests/'.fake()->numberBetween(100, 999),
            ],
            default => ['status' => 'ok'],
        };
    }

    private function generateErrorMessage(string $service): string
    {
        $errors = [
            'confluence' => [
                'Connection timeout to Confluence API',
                'Authentication failed: Invalid API token',
                'Page already exists with this title',
                'Rate limit exceeded: Too many requests',
                'Confluence space not found',
            ],
            'jira' => [
                'Unable to create issue: Project not found',
                'Authentication failed: Invalid credentials',
                'Rate limit exceeded for API endpoint',
                'Jira instance is unavailable',
                'Invalid issue type for project',
            ],
            'gitlab' => [
                'Repository not found or access denied',
                'Source branch does not exist',
                'Merge request already exists',
                'GitLab API connection timeout',
                'Invalid authentication token',
            ],
        ];

        return fake()->randomElement($errors[$service] ?? ['Unknown error occurred']);
    }
}
