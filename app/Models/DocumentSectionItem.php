<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DocumentSectionItem extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentSectionItemFactory> */
    use HasFactory;

    protected $fillable = [
        'document_section_id',
        'structure_section_item_id',
        'content',
        'is_valid',
        'validation_errors',
        'last_edited_by',
        'last_edited_at',
    ];

    protected $casts = [
        'is_valid' => 'boolean',
        'validation_errors' => 'array',
        'last_edited_at' => 'datetime',
    ];

    /**
     * Get the document section this item belongs to.
     */
    public function documentSection(): BelongsTo
    {
        return $this->belongsTo(DocumentSection::class);
    }

    /**
     * Get the structure section item this is based on.
     */
    public function structureSectionItem(): BelongsTo
    {
        return $this->belongsTo(StructureSectionItem::class);
    }

    /**
     * Get the user who last edited this item.
     */
    public function lastEditor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'last_edited_by');
    }

    /**
     * Get the changes for this item.
     */
    public function changes(): HasMany
    {
        return $this->hasMany(DocumentChange::class, 'section_item_id');
    }

    /**
     * Get the inline comments for this item.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'section_item_id');
    }
}
