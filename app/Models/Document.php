<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'image',
        'category_id',
        'structure_id',
        'owner_id',
        'visibility',
        'status',
        'approval_status',
        'total_score',
        'completeness_percentage',
        'view_count',
        'comment_count',
        'reaction_count',
        'last_activity_at',
        'published_at',
        'first_published_at',
        'completed_at',
        'stale_detected_at',
    ];

    protected $casts = [
        'total_score' => 'integer',
        'completeness_percentage' => 'decimal:2',
        'view_count' => 'integer',
        'comment_count' => 'integer',
        'reaction_count' => 'integer',
        'last_activity_at' => 'datetime',
        'published_at' => 'datetime',
        'first_published_at' => 'datetime',
        'completed_at' => 'datetime',
        'stale_detected_at' => 'datetime',
    ];

    /**
     * Get the category this document belongs to.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the structure this document uses.
     */
    public function structure(): BelongsTo
    {
        return $this->belongsTo(Structure::class);
    }

    /**
     * Get the owner of the document.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Get the tags for this document.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'document_tag')->withTimestamps();
    }

    /**
     * Get the sections for this document.
     */
    public function sections(): HasMany
    {
        return $this->hasMany(DocumentSection::class)->orderBy('position');
    }

    /**
     * Get the editors for this document.
     */
    public function editors(): HasMany
    {
        return $this->hasMany(DocumentEditor::class);
    }

    /**
     * Get the reviewers for this document.
     */
    public function reviewers(): HasMany
    {
        return $this->hasMany(DocumentReviewer::class);
    }

    /**
     * Get the review scores for this document.
     */
    public function reviewScores(): HasMany
    {
        return $this->hasMany(ReviewScore::class);
    }

    /**
     * Get the versions of this document.
     */
    public function versions(): HasMany
    {
        return $this->hasMany(DocumentVersion::class)->orderBy('version', 'desc');
    }

    /**
     * Get the changes for this document.
     */
    public function changes(): HasMany
    {
        return $this->hasMany(DocumentChange::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get the comments for this document.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    /**
     * Get the views for this document.
     */
    public function views(): HasMany
    {
        return $this->hasMany(DocumentView::class);
    }

    /**
     * Get the reactions for this document.
     */
    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class);
    }

    /**
     * Get the watchers for this document.
     */
    public function watchers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'document_watchers')->withTimestamps();
    }

    /**
     * Get the branches for this document.
     */
    public function branches(): HasMany
    {
        return $this->hasMany(DocumentBranch::class);
    }

    /**
     * Get the external links for this document.
     */
    public function externalLinks(): HasMany
    {
        return $this->hasMany(ExternalLink::class);
    }

    /**
     * Get the approval for this document.
     */
    public function approval(): HasOne
    {
        return $this->hasOne(DocumentApproval::class);
    }

    /**
     * Get the penalties for this document.
     */
    public function penalties(): HasMany
    {
        return $this->hasMany(DocumentPenalty::class);
    }

    /**
     * Get documents this document references.
     */
    public function referencedDocuments(): BelongsToMany
    {
        return $this->belongsToMany(
            Document::class,
            'document_references',
            'source_document_id',
            'target_document_id'
        )->withPivot('context')->withTimestamps();
    }

    /**
     * Get documents that reference this document.
     */
    public function referencingDocuments(): BelongsToMany
    {
        return $this->belongsToMany(
            Document::class,
            'document_references',
            'target_document_id',
            'source_document_id'
        )->withPivot('context')->withTimestamps();
    }
}
