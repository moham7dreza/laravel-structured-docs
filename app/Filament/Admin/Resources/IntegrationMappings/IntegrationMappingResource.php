<?php

namespace App\Filament\Admin\Resources\IntegrationMappings;

use App\Filament\Admin\Resources\IntegrationMappings\Pages\ManageIntegrationMappings;
use App\Models\IntegrationMapping;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class IntegrationMappingResource extends Resource
{
    protected static ?string $model = IntegrationMapping::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowsRightLeft;

    protected static ?string $navigationLabel = 'Integration Mappings';

    protected static ?string $modelLabel = 'Integration Mapping';

    protected static ?string $pluralModelLabel = 'Integration Mappings';

    protected static string|\UnitEnum|null $navigationGroup = 'Integration';

    protected static ?int $navigationSort = 10;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('local_entity_type')
                    ->label('Local Entity Type')
                    ->options([
                        'document' => 'Document',
                        'user' => 'User',
                        'category' => 'Category',
                    ])
                    ->required()
                    ->native(false)
                    ->helperText('Type of local entity being mapped'),

                TextInput::make('local_entity_id')
                    ->label('Local Entity ID')
                    ->required()
                    ->numeric()
                    ->helperText('ID of the local entity'),

                Select::make('service')
                    ->label('External Service')
                    ->options([
                        'confluence' => 'Confluence',
                        'jira' => 'Jira',
                        'gitlab' => 'GitLab',
                    ])
                    ->required()
                    ->native(false)
                    ->helperText('External service to integrate with'),

                TextInput::make('external_entity_type')
                    ->label('External Entity Type')
                    ->required()
                    ->placeholder('e.g., page, issue, merge_request')
                    ->helperText('Type of entity in the external service'),

                TextInput::make('external_id')
                    ->label('External ID')
                    ->required()
                    ->placeholder('e.g., PAGE-123, ISSUE-456')
                    ->helperText('ID in the external system')
                    ->columnSpanFull(),

                TextInput::make('external_url')
                    ->label('External URL')
                    ->url()
                    ->placeholder('https://...')
                    ->helperText('Full URL to the external resource')
                    ->columnSpanFull(),

                Toggle::make('sync_enabled')
                    ->label('Sync Enabled')
                    ->default(true)
                    ->helperText('Enable automatic synchronization'),

                DateTimePicker::make('last_synced_at')
                    ->label('Last Synced')
                    ->disabled()
                    ->helperText('When the last sync occurred'),
            ])
            ->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('local_entity_type')
                    ->label('Local Type')
                    ->badge()
                    ->color('primary')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('local_entity_id')
                    ->label('Local ID')
                    ->numeric()
                    ->sortable(),

                TextColumn::make('service')
                    ->label('Service')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'confluence' => 'info',
                        'jira' => 'warning',
                        'gitlab' => 'danger',
                        default => 'gray',
                    })
                    ->searchable()
                    ->sortable(),

                TextColumn::make('external_entity_type')
                    ->label('External Type')
                    ->searchable(),

                TextColumn::make('external_id')
                    ->label('External ID')
                    ->searchable()
                    ->copyable()
                    ->copyMessage('Copied!')
                    ->weight('bold'),

                IconColumn::make('sync_enabled')
                    ->label('Sync')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('last_synced_at')
                    ->label('Last Sync')
                    ->dateTime()
                    ->since()
                    ->sortable()
                    ->placeholder('Never'),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                \Filament\Tables\Filters\SelectFilter::make('service')
                    ->label('Service')
                    ->options([
                        'confluence' => 'Confluence',
                        'jira' => 'Jira',
                        'gitlab' => 'GitLab',
                    ]),

                \Filament\Tables\Filters\SelectFilter::make('local_entity_type')
                    ->label('Local Entity Type')
                    ->options([
                        'document' => 'Document',
                        'user' => 'User',
                        'category' => 'Category',
                    ]),

                \Filament\Tables\Filters\TernaryFilter::make('sync_enabled')
                    ->label('Sync Status')
                    ->placeholder('All mappings')
                    ->trueLabel('Enabled')
                    ->falseLabel('Disabled'),
            ])
            ->defaultSort('last_synced_at', 'desc')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageIntegrationMappings::route('/'),
        ];
    }
}
