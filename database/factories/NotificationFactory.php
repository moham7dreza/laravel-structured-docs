<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['comment', 'mention', 'like', 'follow', 'document_updated', 'review_request', 'status_change'];
        $type = $this->faker->randomElement($types);

        return [
            'user_id' => \App\Models\User::factory(),
            'sender_id' => $this->faker->boolean(80) ? \App\Models\User::factory() : null,
            'type' => $type,
            'title' => $this->getTitle($type),
            'message' => $this->getMessage($type),
            'data' => $this->getData($type),
            'read_at' => $this->faker->boolean(60) ? $this->faker->dateTimeBetween('-1 month', 'now') : null,
        ];
    }

    /**
     * Get a title based on notification type.
     */
    private function getTitle(string $type): string
    {
        return match ($type) {
            'comment' => 'New Comment',
            'mention' => 'You were mentioned',
            'like' => 'Someone liked your content',
            'follow' => 'New Follower',
            'document_updated' => 'Document Updated',
            'review_request' => 'Review Request',
            'status_change' => 'Status Changed',
            default => 'Notification',
        };
    }

    /**
     * Get a message based on notification type.
     */
    private function getMessage(string $type): string
    {
        return match ($type) {
            'comment' => $this->faker->name().' commented on your document',
            'mention' => $this->faker->name().' mentioned you in a comment',
            'like' => $this->faker->name().' liked your document',
            'follow' => $this->faker->name().' started following you',
            'document_updated' => 'A document you\'re watching was updated',
            'review_request' => $this->faker->name().' requested your review',
            'status_change' => 'Document status changed to '.$this->faker->randomElement(['published', 'draft', 'archived']),
            default => $this->faker->sentence(),
        };
    }

    /**
     * Get data based on notification type.
     */
    private function getData(string $type): ?array
    {
        if (in_array($type, ['comment', 'document_updated', 'review_request', 'status_change'])) {
            return [
                'document_id' => $this->faker->numberBetween(1, 50),
                'document_slug' => $this->faker->slug(),
            ];
        }

        return null;
    }

    /**
     * Indicate that the notification is unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'read_at' => null,
        ]);
    }

    /**
     * Indicate that the notification is read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'read_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ]);
    }
}
