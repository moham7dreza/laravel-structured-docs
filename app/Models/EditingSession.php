<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EditingSession extends Model
{
    /** @use HasFactory<\Database\Factories\EditingSessionFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'user_id',
        'section_id',
        'session_token',
        'cursor_position',
        'is_active',
        'last_activity_at',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'cursor_position' => 'array',
        'is_active' => 'boolean',
        'last_activity_at' => 'datetime',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(DocumentSection::class, 'section_id');
    }
}
