<?php

namespace App\Filament\Admin\Resources\IntegrationMappings\Pages;

use App\Filament\Admin\Resources\IntegrationMappings\IntegrationMappingResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageIntegrationMappings extends ManageRecords
{
    protected static string $resource = IntegrationMappingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
