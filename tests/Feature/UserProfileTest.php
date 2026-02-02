<?php

use App\Models\Document;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'total_score' => 150,
        'current_rank' => 5,
    ]);
});

test('user profile page is displayed', function () {
    $response = $this->get(route('users.show', $this->user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('users/show')
        ->has('user')
        ->where('user.name', 'John Doe')
        ->where('user.total_score', 150)
    );
});

test('user profile shows public documents', function () {
    // Create published documents
    Document::factory()->count(3)->create([
        'owner_id' => $this->user->id,
        'status' => 'published',
    ]);

    // Create draft document (should not be shown)
    Document::factory()->create([
        'owner_id' => $this->user->id,
        'status' => 'draft',
    ]);

    $response = $this->get(route('users.show', $this->user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('documents.data', 3)
    );
});

test('authenticated user can follow another user', function () {
    $currentUser = User::factory()->create();
    $targetUser = User::factory()->create();

    $response = $this
        ->actingAs($currentUser)
        ->post(route('users.follow', $targetUser));

    $response->assertRedirect();
    expect($currentUser->following()->where('following_id', $targetUser->id)->exists())->toBeTrue();
});

test('authenticated user can unfollow a user', function () {
    $currentUser = User::factory()->create();
    $targetUser = User::factory()->create();

    // First follow
    $currentUser->following()->attach($targetUser->id);

    $response = $this
        ->actingAs($currentUser)
        ->delete(route('users.unfollow', $targetUser));

    $response->assertRedirect();
    expect($currentUser->following()->where('following_id', $targetUser->id)->exists())->toBeFalse();
});

test('user cannot follow themselves', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('users.follow', $user));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('guest users cannot follow', function () {
    $user = User::factory()->create();

    $response = $this->post(route('users.follow', $user));

    $response->assertRedirect(route('login'));
});

test('profile shows correct follower and following counts', function () {
    $follower1 = User::factory()->create();
    $follower2 = User::factory()->create();
    $following1 = User::factory()->create();

    // Users following this profile
    $this->user->followers()->attach([$follower1->id, $follower2->id]);

    // Users this profile is following
    $this->user->following()->attach($following1->id);

    $response = $this->get(route('users.show', $this->user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('user.followers_count', 2)
        ->where('user.following_count', 1)
    );
});

test('own profile shows email address', function () {
    $response = $this
        ->actingAs($this->user)
        ->get(route('users.show', $this->user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('isOwnProfile', true)
        ->where('user.email', 'john@example.com')
    );
});

test('other users profile does not show email address', function () {
    $otherUser = User::factory()->create();

    $response = $this
        ->actingAs($otherUser)
        ->get(route('users.show', $this->user));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('isOwnProfile', false)
        ->where('user.email', null)
    );
});
