<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ExternalLink extends Model
{
    /** @use HasFactory<\Database\Factories\ExternalLinkFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'type',
        'url',
        'title',
        'is_valid',
        'last_validated_at',
        'meta',
    ];

    protected $casts = [
        'is_valid' => 'boolean',
        'last_validated_at' => 'datetime',
        'meta' => 'array',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
