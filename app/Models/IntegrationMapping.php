<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IntegrationMapping extends Model
{
    /** @use HasFactory<\Database\Factories\IntegrationMappingFactory> */
    use HasFactory;

    protected $fillable = [
        'local_entity_type',
        'local_entity_id',
        'service',
        'external_entity_type',
        'external_id',
        'external_url',
        'sync_enabled',
        'last_synced_at',
    ];

    protected $casts = [
        'local_entity_id' => 'integer',
        'sync_enabled' => 'boolean',
        'last_synced_at' => 'datetime',
    ];
}
