<?php

namespace App\Filament\Admin\Resources\DocumentVersions\Pages;

use App\Filament\Admin\Resources\DocumentVersions\DocumentVersionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateDocumentVersion extends CreateRecord
{
    protected static string $resource = DocumentVersionResource::class;
}
