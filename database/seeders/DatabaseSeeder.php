<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Document;
use App\Models\DocumentBranch;
use App\Models\DocumentEditor;
use App\Models\DocumentPenalty;
use App\Models\DocumentReviewer;
use App\Models\DocumentSection;
use App\Models\DocumentSectionItem;
use App\Models\DocumentView;
use App\Models\ExternalLink;
use App\Models\LeaderboardCache;
use App\Models\OutdatedRule;
use App\Models\Reaction;
use App\Models\ReviewScore;
use App\Models\ScoreLog;
use App\Models\Structure;
use App\Models\StructureSection;
use App\Models\StructureSectionItem;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserScore;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('🌱 Starting database seeding...');

        // Create admin user
        $this->command->info('👤 Creating users...');
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'total_score' => 1000,
            'current_rank' => 1,
        ]);

        // Create regular users
        $users = User::factory(15)->create();
        $allUsers = $users->push($admin);

        // Create categories
        $this->command->info('📁 Creating categories...');
        $categories = Category::factory(8)->active()->create();

        // Create tags
        $this->command->info('🏷️  Creating tags...');
        $tags = Tag::factory(20)->create();

        // Create structures with sections and items
        $this->command->info('🏗️  Creating document structures...');
        $structures = collect();
        foreach ($categories->take(5) as $category) {
            $structure = Structure::factory()
                ->for($category)
                ->create();

            // Create sections for each structure
            $sections = StructureSection::factory(fake()->numberBetween(3, 6))
                ->for($structure)
                ->create()
                ->each(function ($section, $index) {
                    $section->update(['position' => $index]);

                    // Create items for each section
                    StructureSectionItem::factory(fake()->numberBetween(2, 5))
                        ->for($section, 'section')
                        ->create()
                        ->each(function ($item, $itemIndex) {
                            $item->update(['position' => $itemIndex]);
                        });
                });

            $structures->push($structure);
        }

        // Create documents with various states
        $this->command->info('📝 Creating documents...');
        $documents = collect();

        // Published documents (30)
        $publishedDocs = Document::factory(30)
            ->published()
            ->recycle($allUsers)
            ->recycle($categories)
            ->recycle($structures)
            ->create()
            ->each(function ($doc) use ($tags) {
                $doc->tags()->attach($tags->random(fake()->numberBetween(2, 5)));
            });
        $documents = $documents->merge($publishedDocs);

        // Draft documents (15)
        $draftDocs = Document::factory(15)
            ->draft()
            ->recycle($allUsers)
            ->recycle($categories)
            ->recycle($structures)
            ->create()
            ->each(function ($doc) use ($tags) {
                $doc->tags()->attach($tags->random(fake()->numberBetween(1, 3)));
            });
        $documents = $documents->merge($draftDocs);

        // Pending review documents (10)
        $pendingDocs = Document::factory(10)
            ->pendingReview()
            ->recycle($allUsers)
            ->recycle($categories)
            ->recycle($structures)
            ->create()
            ->each(function ($doc) use ($tags) {
                $doc->tags()->attach($tags->random(fake()->numberBetween(2, 4)));
            });
        $documents = $documents->merge($pendingDocs);

        // Completed documents (10)
        $completedDocs = Document::factory(10)
            ->completed()
            ->recycle($allUsers)
            ->recycle($categories)
            ->recycle($structures)
            ->create()
            ->each(function ($doc) use ($tags) {
                $doc->tags()->attach($tags->random(fake()->numberBetween(3, 5)));
            });
        $documents = $documents->merge($completedDocs);

        // Stale documents (5)
        $staleDocs = Document::factory(5)
            ->stale()
            ->recycle($allUsers)
            ->recycle($categories)
            ->recycle($structures)
            ->create()
            ->each(function ($doc) use ($tags) {
                $doc->tags()->attach($tags->random(fake()->numberBetween(1, 3)));
            });
        $documents = $documents->merge($staleDocs);

        // Create document sections and items
        $this->command->info('📄 Creating document sections...');
        foreach ($documents as $document) {
            $structureSections = $document->structure->sections;

            foreach ($structureSections as $structureSection) {
                $docSection = DocumentSection::create([
                    'document_id' => $document->id,
                    'structure_section_id' => $structureSection->id,
                    'instance_number' => 1,
                    'is_complete' => fake()->boolean(70),
                    'position' => $structureSection->position,
                ]);

                // Create items for each section
                foreach ($structureSection->items as $structureItem) {
                    DocumentSectionItem::create([
                        'document_section_id' => $docSection->id,
                        'structure_section_item_id' => $structureItem->id,
                        'content' => $this->generateContent($structureItem->type),
                        'is_valid' => fake()->boolean(90),
                        'last_edited_by' => $allUsers->random()->id,
                        'last_edited_at' => fake()->dateTimeBetween('-1 month', 'now'),
                    ]);
                }
            }
        }

        // Create document editors
        $this->command->info('✏️  Assigning editors...');
        foreach ($documents->random(30) as $document) {
            $editorCount = fake()->numberBetween(1, 3);
            $selectedUsers = $allUsers->except($document->owner_id)->random($editorCount);

            foreach ($selectedUsers as $user) {
                DocumentEditor::create([
                    'document_id' => $document->id,
                    'user_id' => $user->id,
                    'access_type' => fake()->randomElement(['full', 'limited']),
                    'can_manage_editors' => fake()->boolean(20),
                    'invited_by' => $document->owner_id,
                    'notified_at' => fake()->dateTimeBetween('-1 month', 'now'),
                ]);
            }
        }

        // Create document reviewers and review scores
        $this->command->info('👥 Assigning reviewers...');
        foreach ($documents->whereIn('status', ['published', 'pending_review', 'completed'])->take(40) as $document) {
            $reviewerCount = fake()->numberBetween(2, 4);
            $selectedReviewers = $allUsers->except($document->owner_id)->random($reviewerCount);

            foreach ($selectedReviewers as $reviewer) {
                DocumentReviewer::create([
                    'document_id' => $document->id,
                    'user_id' => $reviewer->id,
                    'invited_by' => $document->owner_id,
                    'status' => fake()->randomElement(['pending', 'accepted']),
                    'notified_at' => fake()->dateTimeBetween('-1 month', 'now'),
                    'responded_at' => fake()->optional(0.7)->dateTimeBetween('-1 month', 'now'),
                ]);

                // Add review scores
                if (fake()->boolean(70)) {
                    ReviewScore::create([
                        'document_id' => $document->id,
                        'reviewer_id' => $reviewer->id,
                        'score' => fake()->numberBetween(60, 100),
                        'reason' => fake()->optional(0.6)->sentence(10),
                        'is_admin_score' => $reviewer->id === $admin->id,
                        'notified_at' => fake()->dateTimeBetween('-1 month', 'now'),
                    ]);
                }
            }
        }

        // Create comments
        $this->command->info('💬 Creating comments...');
        foreach ($documents->random(50) as $document) {
            Comment::factory(fake()->numberBetween(2, 8))
                ->for($document)
                ->recycle($allUsers)
                ->create();
        }

        // Create document views
        $this->command->info('👀 Creating document views...');
        foreach ($documents as $document) {
            $viewCount = $document->view_count;
            for ($i = 0; $i < min($viewCount, 20); $i++) {
                DocumentView::create([
                    'document_id' => $document->id,
                    'user_id' => $allUsers->random()->id,
                    'ip_address' => fake()->ipv4(),
                    'user_agent' => fake()->userAgent(),
                    'time_spent' => fake()->numberBetween(10, 600),
                    'created_at' => fake()->dateTimeBetween('-6 months', 'now'),
                ]);
            }
        }

        // Create reactions
        $this->command->info('❤️  Creating reactions...');
        foreach ($documents->random(60) as $document) {
            $reactionCount = fake()->numberBetween(1, 10);
            $selectedUsers = $allUsers->random(min($reactionCount, $allUsers->count()));

            foreach ($selectedUsers as $user) {
                Reaction::create([
                    'document_id' => $document->id,
                    'user_id' => $user->id,
                    'type' => fake()->randomElement(['like', 'helpful', 'love', 'celebrate']),
                ]);
            }
        }

        // Create document branches
        $this->command->info('🌿 Creating branches...');
        foreach ($documents->random(40) as $document) {
            DocumentBranch::create([
                'document_id' => $document->id,
                'task_id' => 'PROJ-'.fake()->numberBetween(1000, 9999),
                'task_title' => fake()->sentence(6),
                'branch_name' => 'feature/'.fake()->slug(3),
                'repository_url' => 'https://gitlab.com/company/repo',
                'merged_at' => fake()->optional(0.7)->dateTimeBetween('-3 months', 'now'),
            ]);
        }

        // Create external links
        $this->command->info('🔗 Creating external links...');
        foreach ($documents->random(35) as $document) {
            ExternalLink::create([
                'document_id' => $document->id,
                'type' => fake()->randomElement(['jira', 'gitlab_mr', 'confluence']),
                'url' => fake()->url(),
                'title' => fake()->sentence(4),
                'is_valid' => fake()->boolean(90),
                'last_validated_at' => fake()->dateTimeBetween('-1 week', 'now'),
            ]);
        }

        // Create outdated rules
        $this->command->info('⚠️  Creating outdated rules...');
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

        // Apply penalties to some documents
        $this->command->info('⚠️  Applying document penalties...');
        $rules = OutdatedRule::all();
        $penaltyCount = 0;

        // Apply penalties to draft and stale documents
        $documentsTopenalize = $documents->shuffle()->take(12);

        foreach ($documentsTopenalize as $index => $document) {
            $rule = $rules->random();
            $daysAgo = fake()->numberBetween(1, 30);

            DocumentPenalty::create([
                'document_id' => $document->id,
                'rule_id' => $rule->id,
                'penalty_score' => $rule->penalty_score,
                'reason' => "Document violated rule: {$rule->name}",
                'is_resolved' => $index < 4, // First 4 are resolved
                'resolved_by' => $index < 4 ? $allUsers->random()->id : null,
                'resolved_at' => $index < 4 ? now()->subDays(fake()->numberBetween(1, 5)) : null,
                'applied_at' => now()->subDays($daysAgo),
            ]);

            $penaltyCount++;
        }

        $this->command->info("   ✓ Applied {$penaltyCount} penalties to documents");

        // Create user scores
        $this->command->info('🎮 Creating gamification data...');
        foreach ($allUsers as $user) {
            $docsWritten = $user->ownedDocuments()->count();
            $docsWrittenScore = $docsWritten * 10;

            UserScore::create([
                'user_id' => $user->id,
                'total_score' => $user->total_score ?: fake()->numberBetween(0, 1000),
                'docs_written_score' => $docsWrittenScore,
                'reviews_score' => fake()->numberBetween(0, 300),
                'engagement_score' => fake()->numberBetween(0, 200),
                'penalty_score' => fake()->numberBetween(0, 50),
                'grade' => fake()->randomElement(['S', 'A', 'B', 'C', 'D', 'F']),
                'updated_at' => now(),
            ]);

            // Create score logs
            for ($i = 0; $i < fake()->numberBetween(5, 15); $i++) {
                ScoreLog::create([
                    'user_id' => $user->id,
                    'document_id' => $documents->random()->id,
                    'type' => fake()->randomElement(['doc_created', 'doc_published', 'review_given', 'view_received']),
                    'score' => fake()->numberBetween(5, 50),
                    'reason' => fake()->optional(0.6)->sentence(),
                    'created_at' => fake()->dateTimeBetween('-3 months', 'now'),
                ]);
            }
        }

        // Create leaderboard cache
        $this->command->info('🏆 Creating leaderboard...');
        $rankedUsers = $allUsers->sortByDesc('total_score')->values();
        foreach ($rankedUsers as $index => $user) {
            LeaderboardCache::create([
                'user_id' => $user->id,
                'rank' => $index + 1,
                'total_score' => $user->total_score,
                'docs_written' => $user->ownedDocuments()->count(),
                'docs_reviewed' => fake()->numberBetween(0, 30),
                'docs_completed' => fake()->numberBetween(0, 20),
                'penalties_received' => fake()->numberBetween(0, 5),
                'grade' => $user->userScore->grade ?? 'F',
                'previous_rank' => fake()->optional(0.7)->numberBetween(1, 100),
                'rank_change' => fake()->numberBetween(-10, 10),
                'last_calculated_at' => now(),
            ]);
        }

        // Create activities
        $this->command->info('📊 Creating activities...');
        foreach ($allUsers->random(10) as $user) {
            for ($i = 0; $i < fake()->numberBetween(5, 20); $i++) {
                Activity::create([
                    'user_id' => $user->id,
                    'subject_type' => Document::class,
                    'subject_id' => $documents->random()->id,
                    'action' => fake()->randomElement(['created', 'updated', 'published', 'commented']),
                    'description' => fake()->sentence(),
                    'created_at' => fake()->dateTimeBetween('-1 month', 'now'),
                ]);
            }
        }

        $this->command->info('✅ Database seeding completed successfully!');
        $this->command->newLine();
        $this->command->table(
            ['Entity', 'Count'],
            [
                ['Users', User::count()],
                ['Categories', Category::count()],
                ['Tags', Tag::count()],
                ['Structures', Structure::count()],
                ['Documents', Document::count()],
                ['Outdated Rules', OutdatedRule::count()],
                ['Document Penalties', \App\Models\DocumentPenalty::count()],
                ['Comments', Comment::count()],
                ['Reactions', Reaction::count()],
                ['Activities', Activity::count()],
            ]
        );
    }

    private function generateContent(string $type): string
    {
        return match ($type) {
            'text' => fake()->sentence(),
            'textarea' => fake()->paragraph(3),
            'rich_text' => fake()->paragraphs(5, true),
            'number' => (string) fake()->numberBetween(1, 1000),
            'date' => fake()->date(),
            'link' => fake()->url(),
            'code' => '```php\n'.fake()->text(200).'\n```',
            default => fake()->text(100),
        };
    }
}
