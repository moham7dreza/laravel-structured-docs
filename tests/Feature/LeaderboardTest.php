<?php

use App\Models\User;

beforeEach(function () {
    // Create users with different scores
    User::factory()->create([
        'name' => 'Top User',
        'total_score' => 1500,
        'current_rank' => 1,
    ]);

    User::factory()->create([
        'name' => 'Second User',
        'total_score' => 800,
        'current_rank' => 2,
    ]);

    User::factory()->create([
        'name' => 'Third User',
        'total_score' => 600,
        'current_rank' => 3,
    ]);

    User::factory()->count(10)->create([
        'total_score' => fake()->numberBetween(50, 500),
    ]);
});

test('leaderboard page displays correctly', function () {
    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('leaderboard/index')
        ->has('users')
        ->has('stats')
    );
});

test('leaderboard shows users ordered by score', function () {
    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('users.0.name', 'Top User')
        ->where('users.0.total_score', 1500)
        ->where('users.0.position', 1)
        ->where('users.1.name', 'Second User')
        ->where('users.1.position', 2)
    );
});

test('leaderboard calculates grades correctly', function () {
    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('users.0.grade', 'S') // 1500 score = S grade
        ->where('users.1.grade', 'A') // 800 score = A grade
        ->where('users.2.grade', 'B') // 600 score = B grade
    );
});

test('leaderboard shows statistics', function () {
    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('stats.total_users')
        ->has('stats.total_score')
        ->has('stats.average_score')
        ->has('stats.highest_score')
        ->where('stats.highest_score', 1500)
    );
});

test('authenticated user sees their position', function () {
    $user = User::factory()->create([
        'name' => 'Current User',
        'total_score' => 400,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('currentUser')
        ->where('currentUser.name', 'Current User')
        ->where('currentUser.total_score', 400)
        ->has('currentUser.position')
    );
});

test('guest users do not see current user data', function () {
    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('currentUser', null)
    );
});

test('leaderboard filters by timeframe', function () {
    $response = $this->get(route('leaderboard.index', ['timeframe' => 'week']));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('timeframe', 'week')
    );
});

test('leaderboard shows score breakdown', function () {
    $user = User::factory()
        ->hasUserScore([
            'documents_created' => 10,
            'documents_reviewed' => 5,
            'helpful_votes' => 20,
            'comments_made' => 15,
        ])
        ->create(['total_score' => 500]);

    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('users', fn ($users) => $users
            ->each(fn ($user) => $user
                ->has('score_breakdown.documents_created')
                ->has('score_breakdown.documents_reviewed')
                ->has('score_breakdown.helpful_votes')
                ->has('score_breakdown.comments_made')
            )
        )
    );
});

test('leaderboard only shows users with score above zero', function () {
    // Create user with zero score
    User::factory()->create([
        'name' => 'Zero Score User',
        'total_score' => 0,
    ]);

    $response = $this->get(route('leaderboard.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('users', fn ($users) => $users
            ->each(fn ($user) => $user
                ->where('total_score', '>', 0)
            )
        )
    );
});
