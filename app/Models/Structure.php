<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Structure extends Model
{
    /** @use HasFactory<\Database\Factories\StructureFactory> */
    use HasFactory;

    protected $fillable = [
        'category_id',
        'title',
        'description',
        'version',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'version' => 'integer',
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Get the category this structure belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the sections for this structure.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(StructureSection::class)->orderBy('position');
    }

    /**
     * Get the documents using this structure.
     */
    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }
}
