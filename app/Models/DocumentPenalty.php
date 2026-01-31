<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentPenalty extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentPenaltyFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'rule_id',
        'penalty_score',
        'reason',
        'is_resolved',
        'resolved_by',
        'resolved_at',
        'applied_at',
        'created_at',
    ];

    protected $casts = [
        'penalty_score' => 'integer',
        'is_resolved' => 'boolean',
        'resolved_at' => 'datetime',
        'applied_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function rule(): BelongsTo
    {
        return $this->belongsTo(OutdatedRule::class, 'rule_id');
    }

    public function resolvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
