<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserScore extends Model
{
    /** @use HasFactory<\Database\Factories\UserScoreFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'total_score',
        'docs_written_score',
        'reviews_score',
        'engagement_score',
        'penalty_score',
        'grade',
        'updated_at',
    ];

    protected $casts = [
        'total_score' => 'integer',
        'docs_written_score' => 'integer',
        'reviews_score' => 'integer',
        'engagement_score' => 'integer',
        'penalty_score' => 'integer',
        'updated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
