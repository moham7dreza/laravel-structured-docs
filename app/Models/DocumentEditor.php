<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class DocumentEditor extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentEditorFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'user_id',
        'access_type',
        'can_manage_editors',
        'invited_by',
        'notified_at',
    ];

    protected $casts = [
        'can_manage_editors' => 'boolean',
        'notified_at' => 'datetime',
    ];

    /**
     * Get the document.
     */
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    /**
     * Get the user who is the editor.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user who invited this editor.
     */
    public function invitedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Get the sections this editor can access.
     */
    public function sections(): BelongsToMany
    {
        return $this->belongsToMany(
            StructureSection::class,
            'document_editor_sections',
            'document_editor_id',
            'structure_section_id'
        )->withTimestamps();
    }
}
