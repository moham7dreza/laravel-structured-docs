<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OutdatedRule extends Model
{
    /** @use HasFactory<\Database\Factories\OutdatedRuleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'condition_type',
        'condition_params',
        'penalty_score',
        'is_active',
        'priority',
    ];

    protected $casts = [
        'condition_params' => 'array',
        'penalty_score' => 'integer',
        'is_active' => 'boolean',
        'priority' => 'integer',
    ];

    public function penalties(): HasMany
    {
        return $this->hasMany(DocumentPenalty::class, 'rule_id');
    }
}
