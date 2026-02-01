<?php

namespace App\Filament\Admin\Resources\IntegrationSyncLogs\Pages;

use App\Filament\Admin\Resources\IntegrationSyncLogs\IntegrationSyncLogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageIntegrationSyncLogs extends ManageRecords
{
    protected static string $resource = IntegrationSyncLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
