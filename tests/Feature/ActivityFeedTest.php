<?php

use App\Models\Activity;
use App\Models\Document;
use App\Models\User;

beforeEach(function () {
    // Create some users
    $this->users = User::factory()->count(3)->create();

    // Create activities for different users
    foreach ($this->users as $user) {
        Activity::factory()->count(5)->create([
            'user_id' => $user->id,
        ]);
    }
});

test('activity feed page displays correctly', function () {
    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('activity/index')
        ->has('activities')
        ->has('stats')
        ->where('filter', 'all')
    );
});

test('activity feed shows all activities by default', function () {
    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('activities.data', 15) // 3 users * 5 activities each
    );
});

test('activity feed filters by following users', function () {
    $user = User::factory()->create();
    $followedUser = $this->users->first();

    // User follows another user
    $user->following()->attach($followedUser->id);

    $response = $this
        ->actingAs($user)
        ->get(route('activity.index', ['filter' => 'following']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('filter', 'following')
        ->has('activities.data', 5) // Only activities from followed user
    );
});

test('activity feed filters by my activities', function () {
    $user = $this->users->first();

    $response = $this
        ->actingAs($user)
        ->get(route('activity.index', ['filter' => 'my']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('filter', 'my')
        ->has('activities.data', 5) // Only user's own activities
    );
});

test('activity feed shows statistics', function () {
    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('stats.total_activities')
        ->has('stats.today')
        ->has('stats.this_week')
    );
});

test('activity feed paginates results', function () {
    // Create many more activities
    Activity::factory()->count(50)->create();

    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('activities.data', 20) // 20 per page
        ->where('activities.per_page', 20)
    );
});

test('activity feed loads next page', function () {
    // Create many more activities
    Activity::factory()->count(50)->create();

    $response = $this->get(route('activity.index', ['page' => 2]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('activities.current_page', 2)
        ->has('activities.data')
    );
});

test('activity feed shows user information', function () {
    $activity = Activity::first();

    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('activities.data.0.user.id', $activity->user_id)
        ->where('activities.data.0.user.name', $activity->user->name)
    );
});

test('activity feed shows document subject', function () {
    $document = Document::factory()->create();
    $user = User::factory()->create();

    $activity = Activity::factory()->create([
        'user_id' => $user->id,
        'subject_type' => Document::class,
        'subject_id' => $document->id,
        'action' => 'created',
        'description' => 'created a document',
    ]);

    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('activities.data.0.subject.type', 'document')
        ->where('activities.data.0.subject.title', $document->title)
        ->where('activities.data.0.subject.slug', $document->slug)
    );
});

test('guest users can view all activities', function () {
    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('activities')
    );
});

test('guest users cannot filter by following', function () {
    $response = $this->get(route('activity.index', ['filter' => 'following']));

    $response->assertOk();
    // Should show all activities since user is not authenticated
    $response->assertInertia(fn ($page) => $page
        ->has('activities.data', 15)
    );
});

test('activity feed shows formatted timestamps', function () {
    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('activities.data.0.created_at')
        ->has('activities.data.0.created_at_full')
    );
});

test('activity feed orders by newest first', function () {
    // Create an activity now
    $newestActivity = Activity::factory()->create([
        'user_id' => $this->users->first()->id,
        'created_at' => now(),
    ]);

    $response = $this->get(route('activity.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('activities.data.0.id', $newestActivity->id)
    );
});
