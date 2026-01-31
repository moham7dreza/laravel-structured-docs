<?php

namespace App\Filament\Admin\Resources\Structures;

use App\Filament\Admin\Resources\Structures\Pages\CreateStructure;
use App\Filament\Admin\Resources\Structures\Pages\EditStructure;
use App\Filament\Admin\Resources\Structures\Pages\ListStructures;
use App\Filament\Admin\Resources\Structures\Schemas\StructureForm;
use App\Filament\Admin\Resources\Structures\Tables\StructuresTable;
use App\Models\Structure;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class StructureResource extends Resource
{
    protected static ?string $model = Structure::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCubeTransparent;

    protected static string|UnitEnum|null $navigationGroup = 'Schema Management';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return StructureForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return StructuresTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListStructures::route('/'),
            'create' => CreateStructure::route('/create'),
            'edit' => EditStructure::route('/{record}/edit'),
        ];
    }
}
