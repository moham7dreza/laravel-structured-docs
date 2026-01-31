<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StructureSectionItem extends Model
{
    /** @use HasFactory<\Database\Factories\StructureSectionItemFactory> */
    use HasFactory;

    protected $fillable = [
        'section_id',
        'label',
        'description',
        'type',
        'is_required',
        'validation_rules',
        'placeholder',
        'default_value',
        'position',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'validation_rules' => 'array',
        'position' => 'integer',
    ];

    /**
     * Get the section this item belongs to.
     */
    public function section(): BelongsTo
    {
        return $this->belongsTo(StructureSection::class, 'section_id');
    }

    /**
     * Get the document section items using this structure item.
     */
    public function documentSectionItems(): HasMany
    {
        return $this->hasMany(DocumentSectionItem::class);
    }
}
