<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaderboardCache extends Model
{
    /** @use HasFactory<\Database\Factories\LeaderboardCacheFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'rank',
        'total_score',
        'docs_written',
        'docs_reviewed',
        'docs_completed',
        'penalties_received',
        'grade',
        'previous_rank',
        'rank_change',
        'last_calculated_at',
    ];

    protected $casts = [
        'rank' => 'integer',
        'total_score' => 'integer',
        'docs_written' => 'integer',
        'docs_reviewed' => 'integer',
        'docs_completed' => 'integer',
        'penalties_received' => 'integer',
        'previous_rank' => 'integer',
        'rank_change' => 'integer',
        'last_calculated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
