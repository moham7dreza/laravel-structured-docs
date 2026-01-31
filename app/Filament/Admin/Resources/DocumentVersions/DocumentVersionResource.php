<?php

namespace App\Filament\Admin\Resources\DocumentVersions;

use App\Filament\Admin\Resources\DocumentVersions\Pages\CreateDocumentVersion;
use App\Filament\Admin\Resources\DocumentVersions\Pages\EditDocumentVersion;
use App\Filament\Admin\Resources\DocumentVersions\Pages\ListDocumentVersions;
use App\Filament\Admin\Resources\DocumentVersions\Schemas\DocumentVersionForm;
use App\Filament\Admin\Resources\DocumentVersions\Tables\DocumentVersionsTable;
use App\Models\DocumentVersion;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class DocumentVersionResource extends Resource
{
    protected static ?string $model = DocumentVersion::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-clock';

    protected static string|UnitEnum|null $navigationGroup = 'Documents';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return DocumentVersionForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DocumentVersionsTable::configure($table);
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
            'index' => ListDocumentVersions::route('/'),
            'create' => CreateDocumentVersion::route('/create'),
            'edit' => EditDocumentVersion::route('/{record}/edit'),
        ];
    }
}
