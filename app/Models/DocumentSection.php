<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentSection extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentSectionFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'structure_section_id',
        'instance_number',
        'is_complete',
        'position',
    ];

    protected $casts = [
        'instance_number' => 'integer',
        'is_complete' => 'boolean',
        'position' => 'integer',
    ];

    /**
     * Get the document this section belongs to.
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * Get the structure section this is based on.
     */
    public function structureSection(): BelongsTo
    {
        return $this->belongsTo(StructureSection::class);
    }

    /**
     * Get the items in this section.
     */
    public function items(): HasMany
    {
        return $this->hasMany(DocumentSectionItem::class);
    }

    /**
     * Get the comments for this section.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'section_item_id');
    }
}
