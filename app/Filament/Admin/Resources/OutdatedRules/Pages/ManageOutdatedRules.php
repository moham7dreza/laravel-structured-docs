<?php

namespace App\Filament\Admin\Resources\OutdatedRules\Pages;

use App\Filament\Admin\Resources\OutdatedRules\OutdatedRuleResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ManageRecords;

class ManageOutdatedRules extends ManageRecords
{
    protected static string $resource = OutdatedRuleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
