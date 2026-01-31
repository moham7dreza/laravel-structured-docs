<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StructureSection extends Model
{
    /** @use HasFactory<\Database\Factories\StructureSectionFactory> */
    use HasFactory;

    protected $fillable = [
        'structure_id',
        'title',
        'description',
        'position',
        'is_required',
        'is_repeatable',
        'min_items',
        'max_items',
    ];

    protected $casts = [
        'position' => 'integer',
        'is_required' => 'boolean',
        'is_repeatable' => 'boolean',
        'min_items' => 'integer',
        'max_items' => 'integer',
    ];

    /**
     * Get the structure this section belongs to.
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(Structure::class);
    }

    /**
     * Get the items in this section.
     */
    public function items(): HasMany
    {
        return $this->hasMany(StructureSectionItem::class, 'section_id')->orderBy('position');
    }

    /**
     * Get the document sections using this structure section.
     */
    public function documentSections(): HasMany
    {
        return $this->hasMany(DocumentSection::class);
    }
}
