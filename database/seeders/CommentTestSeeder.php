<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Document;
use App\Models\DocumentSectionItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating test comments...');

        // Get a published document
        $document = Document::where('status', 'published')->first();

        if (!$document) {
            $this->command->error('No published documents found. Please create a document first.');
            return;
        }

        // Get some users (minimum 3 for testing mentions)
        $users = User::limit(5)->get();

        if ($users->count() < 2) {
            $this->command->error('Need at least 2 users. Please run UserSeeder first.');
            return;
        }

        $this->command->info("Adding comments to document: {$document->title}");

        // Create main comments
        $comment1 = Comment::create([
            'document_id' => $document->id,
            'user_id' => $users[0]->id,
            'content' => '<p>Great documentation! This really helped me understand the concepts better. 👍</p>',
        ]);

        $comment2 = Comment::create([
            'document_id' => $document->id,
            'user_id' => $users[1]->id,
            'content' => '<p>I have a question about the implementation. Could someone explain the <strong>advanced features</strong> section in more detail?</p>',
        ]);

        $comment3 = Comment::create([
            'document_id' => $document->id,
            'user_id' => $users[0]->id,
            'content' => '<p>Found a typo in the second paragraph. Should be "their" instead of "there".</p>',
        ]);

        // Create replies to comments
        Comment::create([
            'document_id' => $document->id,
            'parent_id' => $comment1->id,
            'user_id' => $users[1]->id,
            'content' => '<p>I agree! The examples are particularly helpful.</p>',
        ]);

        Comment::create([
            'document_id' => $document->id,
            'parent_id' => $comment2->id,
            'user_id' => $users->count() > 2 ? $users[2]->id : $users[0]->id,
            'content' => '<p>Sure! The advanced features section covers:</p><ul><li>Feature A - does X</li><li>Feature B - does Y</li><li>Feature C - does Z</li></ul>',
        ]);

        Comment::create([
            'document_id' => $document->id,
            'parent_id' => $comment2->id,
            'user_id' => $users[0]->id,
            'content' => '<p>You can also check out the <a href="/documents/related-doc">related documentation</a> for more examples.</p>',
        ]);

        // Create a comment with mentions
        $mentionText = count($users) > 2
            ? "<p>@{$users[1]->name} and @{$users[2]->name} - What do you think about this approach?</p>"
            : "<p>@{$users[1]->name} - What do you think about this approach?</p>";

        $commentWithMention = Comment::create([
            'document_id' => $document->id,
            'user_id' => $users[0]->id,
            'content' => $mentionText,
        ]);

        // Attach mentions
        $mentionedUsers = $users->slice(1, 2);
        foreach ($mentionedUsers as $user) {
            $commentWithMention->mentions()->attach($user->id, [
                'created_at' => now(),
                'notified_at' => now(),
            ]);
        }

        // Create inline comments (if section items exist)
        $sectionItem = DocumentSectionItem::where('document_section_id', $document->sections->first()?->id)->first();

        if ($sectionItem) {
            $inlineComment = Comment::create([
                'document_id' => $document->id,
                'section_item_id' => $sectionItem->id,
                'user_id' => $users[1]->id,
                'content' => '<p>This section needs more clarification about the parameters.</p>',
            ]);

            // Reply to inline comment
            Comment::create([
                'document_id' => $document->id,
                'parent_id' => $inlineComment->id,
                'section_item_id' => $sectionItem->id,
                'user_id' => $document->owner_id,
                'content' => '<p>Good point! I\'ll update this section with more details.</p>',
            ]);

            // Resolve the inline comment
            $inlineComment->update([
                'is_resolved' => true,
                'resolved_by' => $document->owner_id,
                'resolved_at' => now(),
            ]);

            $this->command->info('Created inline comment on section item.');
        }

        // Update document comment count
        $document->update(['comment_count' => $document->comments()->count()]);

        $this->command->info('✅ Test comments created successfully!');
        $this->command->info("📄 Document: {$document->title}");
        $this->command->info("💬 Total comments: {$document->comment_count}");
        $this->command->info("🔗 View at: /documents/{$document->slug}");
    }
}
