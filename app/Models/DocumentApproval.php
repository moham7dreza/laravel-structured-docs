<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentApproval extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentApprovalFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'submitted_by',
        'status',
        'required_score',
        'actual_score',
        'required_reviewers',
        'actual_reviewers',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'required_score' => 'integer',
        'actual_score' => 'integer',
        'required_reviewers' => 'integer',
        'actual_reviewers' => 'integer',
        'approved_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function submittedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
