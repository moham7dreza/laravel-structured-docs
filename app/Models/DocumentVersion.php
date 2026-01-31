<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentVersion extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentVersionFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'version',
        'snapshot',
        'created_by',
        'change_summary',
        'is_major',
        'created_at',
    ];

    protected $casts = [
        'version' => 'integer',
        'snapshot' => 'array',
        'is_major' => 'boolean',
        'created_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
