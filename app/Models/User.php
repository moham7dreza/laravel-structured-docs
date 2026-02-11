<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Rappasoft\LaravelAuthenticationLog\Traits\AuthenticationLoggable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class User extends Authenticatable
{
    use AuthenticationLoggable;

    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    use LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'telegram_chat_id',
        'total_score',
        'current_rank',
        // Profile fields
        'bio',
        'location',
        'website',
        'twitter',
        'github',
        // Email preferences
        'email_notifications',
        'email_comments',
        'email_mentions',
        'email_followers',
        'email_newsletter',
        // Preferences
        'theme',
        'language',
        // Privacy settings
        'profile_visible',
        'show_email',
        'show_activity',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'total_score' => 'integer',
            'current_rank' => 'integer',
            // Boolean settings
            'email_notifications' => 'boolean',
            'email_comments' => 'boolean',
            'email_mentions' => 'boolean',
            'email_followers' => 'boolean',
            'email_newsletter' => 'boolean',
            'profile_visible' => 'boolean',
            'show_email' => 'boolean',
            'show_activity' => 'boolean',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll();
    }

    /**
     * Get the documents owned by this user.
     */
    public function ownedDocuments(): HasMany
    {
        return $this->hasMany(Document::class, 'owner_id');
    }

    /**
     * Get the documents owned by this user (alias for ownedDocuments).
     * This is used by Filament for counting relationships.
     */
    public function documents(): HasMany
    {
        return $this->ownedDocuments();
    }

    /**
     * Get documents this user is editing.
     */
    public function editingDocuments(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_editors')->withPivot(['access_type', 'can_manage_editors'])->withTimestamps();
    }

    /**
     * Get documents this user is reviewing.
     */
    public function reviewingDocuments(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_reviewers')->withPivot(['status'])->withTimestamps();
    }

    /**
     * Get documents this user is watching.
     */
    public function watchingDocuments(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_watchers')->withTimestamps();
    }

    /**
     * Get users following this user.
     */
    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_followers', 'following_id', 'follower_id')
            ->withTimestamps();
    }

    /**
     * Get users this user is following.
     */
    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_followers', 'follower_id', 'following_id')
            ->withTimestamps();
    }

    /**
     * Get the user's score breakdown.
     */
    public function userScore(): HasOne
    {
        return $this->hasOne(UserScore::class);
    }

    /**
     * Get the user's score logs.
     */
    public function scoreLogs(): HasMany
    {
        return $this->hasMany(ScoreLog::class);
    }

    /**
     * Get the user's leaderboard entry.
     */
    public function leaderboardEntry(): HasOne
    {
        return $this->hasOne(LeaderboardCache::class);
    }

    /**
     * Get the user's activities.
     */
    public function activities(): HasMany
    {
        return $this->hasMany(Activity::class);
    }

    /**
     * Get the user's comments.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the user's reactions.
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    /**
     * Get the user's document views.
     */
    public function documentViews(): HasMany
    {
        return $this->hasMany(DocumentView::class);
    }

    /**
     * Get documents this user has watched/bookmarked.
     */
    public function documentWatchers(): BelongsToMany
    {
        return $this->belongsToMany(Document::class, 'document_watchers')
            ->withTimestamps();
    }

    /**
     * Get the user's notifications.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    /**
     * Get notifications sent by this user.
     */
    public function sentNotifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'sender_id');
    }
}
