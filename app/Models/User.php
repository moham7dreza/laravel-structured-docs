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

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

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
        ];
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
}
