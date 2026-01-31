<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentBranch extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentBranchFactory> */
    use HasFactory;

    protected $fillable = [
        'document_id',
        'task_id',
        'task_title',
        'branch_name',
        'repository_url',
        'merged_at',
    ];

    protected $casts = [
        'merged_at' => 'datetime',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}
