<?php

namespace App\Filament\Admin\Resources\DocumentPenalties\Pages;

use App\Filament\Admin\Resources\DocumentPenalties\DocumentPenaltyResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageDocumentPenalties extends ManageRecords
{
    protected static string $resource = DocumentPenaltyResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
