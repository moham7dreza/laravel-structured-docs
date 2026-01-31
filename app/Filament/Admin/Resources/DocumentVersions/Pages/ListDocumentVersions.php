<?php

namespace App\Filament\Admin\Resources\DocumentVersions\Pages;

use App\Filament\Admin\Resources\DocumentVersions\DocumentVersionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDocumentVersions extends ListRecords
{
    protected static string $resource = DocumentVersionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
