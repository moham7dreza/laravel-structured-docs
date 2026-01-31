<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentChange extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentChangeFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'document_id',
        'section_item_id',
        'user_id',
        'change_type',
        'old_content',
        'new_content',
        'diff',
        'line_number',
        'created_at',
    ];

    protected $casts = [
        'line_number' => 'integer',
        'created_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    public function sectionItem(): BelongsTo
    {
        return $this->belongsTo(DocumentSectionItem::class, 'section_item_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
