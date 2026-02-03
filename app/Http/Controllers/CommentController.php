<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Document;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a new comment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'document_id' => ['required', 'exists:documents,id'],
            'parent_id' => ['nullable', 'exists:comments,id'],
            'section_item_id' => ['nullable', 'exists:document_section_items,id'],
            'content' => ['required', 'string', 'min:1', 'max:10000'],
        ]);

        $comment = Comment::create([
            'document_id' => $validated['document_id'],
            'parent_id' => $validated['parent_id'] ?? null,
            'section_item_id' => $validated['section_item_id'] ?? null,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        // Extract mentions from content (@username)
        $mentions = $this->extractMentions($validated['content']);

        if (! empty($mentions)) {
            $this->processMentions($comment, $mentions);
        }

        // Increment document comment count
        $comment->document->increment('comment_count');

        // Create notification for document owner (if not self)
        if ($comment->document->owner_id !== $request->user()->id) {
            Notification::create([
                'user_id' => $comment->document->owner_id,
                'type' => $validated['parent_id'] ? 'comment_reply' : 'comment',
                'title' => $validated['parent_id'] ? 'New reply on your document' : 'New comment on your document',
                'message' => $request->user()->name.' commented on "'.$comment->document->title.'"',
                'data' => json_encode([
                    'comment_id' => $comment->id,
                    'document_id' => $comment->document_id,
                    'user_id' => $request->user()->id,
                ]),
            ]);
        }

        // If reply, notify parent comment author
        if ($validated['parent_id']) {
            $parentComment = Comment::find($validated['parent_id']);
            if ($parentComment && $parentComment->user_id !== $request->user()->id) {
                Notification::create([
                    'user_id' => $parentComment->user_id,
                    'type' => 'comment_reply',
                    'title' => 'Someone replied to your comment',
                    'message' => $request->user()->name.' replied to your comment',
                    'data' => json_encode([
                        'comment_id' => $comment->id,
                        'parent_comment_id' => $parentComment->id,
                        'document_id' => $comment->document_id,
                    ]),
                ]);
            }
        }

        // Load relationships for response
        $comment->load(['user', 'replies.user', 'mentions']);

        return back()->with('success', 'Comment posted successfully.');
    }

    /**
     * Update a comment.
     */
    public function update(Request $request, Comment $comment)
    {
        // Authorization
        if ($comment->user_id !== $request->user()->id) {
            abort(403, 'You can only edit your own comments.');
        }

        $validated = $request->validate([
            'content' => ['required', 'string', 'min:1', 'max:10000'],
        ]);

        $comment->update([
            'content' => $validated['content'],
        ]);

        // Update mentions
        $mentions = $this->extractMentions($validated['content']);
        $this->processMentions($comment, $mentions);

        $comment->load(['user', 'replies.user', 'mentions']);

        return back()->with('success', 'Comment updated successfully.');
    }

    /**
     * Delete a comment.
     */
    public function destroy(Request $request, Comment $comment)
    {
        // Authorization: owner or document owner can delete
        if ($comment->user_id !== $request->user()->id &&
            $comment->document->owner_id !== $request->user()->id) {
            abort(403, 'Unauthorized to delete this comment.');
        }

        // Decrement document comment count
        $comment->document->decrement('comment_count');

        $comment->delete();

        return back()->with('success', 'Comment deleted successfully.');
    }

    /**
     * Resolve a comment (for inline comments).
     */
    public function resolve(Request $request, Comment $comment)
    {
        // Only document owner or editors can resolve
        if ($comment->document->owner_id !== $request->user()->id) {
            abort(403, 'Only document owner can resolve comments.');
        }

        $comment->update([
            'is_resolved' => true,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return back()->with('success', 'Comment marked as resolved.');
    }

    /**
     * Unresolve a comment.
     */
    public function unresolve(Request $request, Comment $comment)
    {
        // Only document owner or editors can unresolve
        if ($comment->document->owner_id !== $request->user()->id) {
            abort(403, 'Only document owner can unresolve comments.');
        }

        $comment->update([
            'is_resolved' => false,
            'resolved_by' => null,
            'resolved_at' => null,
        ]);

        return back()->with('success', 'Comment marked as unresolved.');
    }

    /**
     * Extract @mentions from content.
     */
    private function extractMentions(string $content): array
    {
        preg_match_all('/@(\w+)/', $content, $matches);

        return array_unique($matches[1]);
    }

    /**
     * Process mentions and create notifications.
     */
    private function processMentions(Comment $comment, array $usernames): void
    {
        if (empty($usernames)) {
            return;
        }

        // Find users by name
        $users = User::whereIn('name', $usernames)->get();

        $mentionData = [];
        foreach ($users as $user) {
            // Don't mention yourself
            if ($user->id === $comment->user_id) {
                continue;
            }

            $mentionData[$user->id] = [
                'notified_at' => now(),
                'created_at' => now(),
            ];

            // Create notification
            Notification::create([
                'user_id' => $user->id,
                'type' => 'mention',
                'title' => 'You were mentioned in a comment',
                'message' => $comment->user->name.' mentioned you in a comment on "'.$comment->document->title.'"',
                'data' => json_encode([
                    'comment_id' => $comment->id,
                    'document_id' => $comment->document_id,
                    'user_id' => $comment->user_id,
                ]),
            ]);
        }

        // Sync mentions
        if (! empty($mentionData)) {
            $comment->mentions()->sync($mentionData);
        }
    }
}
