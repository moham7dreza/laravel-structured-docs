<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewScore extends Model
{
    /** @use HasFactory<\Database\Factories\ReviewScoreFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'reviewer_id',
        'score',
        'reason',
        'is_admin_score',
        'notified_at',
    ];

    protected $casts = [
        'score' => 'integer',
        'is_admin_score' => 'boolean',
        'notified_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}
