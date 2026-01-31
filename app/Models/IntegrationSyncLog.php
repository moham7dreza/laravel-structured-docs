<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class IntegrationSyncLog extends Model
{
    /** @use HasFactory<\Database\Factories\IntegrationSyncLogFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'service',
        'sync_type',
        'status',
        'external_id',
        'request_payload',
        'response_payload',
        'error_message',
        'sync_duration',
        'synced_by',
        'synced_at',
        'created_at',
    ];

    protected $casts = [
        'request_payload' => 'array',
        'response_payload' => 'array',
        'sync_duration' => 'integer',
        'synced_at' => 'datetime',
        'created_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function syncedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'synced_by');
    }
}
