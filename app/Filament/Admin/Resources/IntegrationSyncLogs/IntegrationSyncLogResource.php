<?php

namespace App\Filament\Admin\Resources\IntegrationSyncLogs;

use App\Filament\Admin\Resources\IntegrationSyncLogs\Pages\ManageIntegrationSyncLogs;
use App\Models\IntegrationSyncLog;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class IntegrationSyncLogResource extends Resource
{
    protected static ?string $model = IntegrationSyncLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedArrowPath;

    protected static ?string $navigationLabel = 'Sync Logs';

    protected static ?string $modelLabel = 'Integration Sync Log';

    protected static ?string $pluralModelLabel = 'Integration Sync Logs';

    protected static string|\UnitEnum|null $navigationGroup = 'Integration';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('document_id')
                    ->label('Document')
                    ->relationship('document', 'title')
                    ->required()
                    ->disabled(),

                Select::make('service')
                    ->label('Service')
                    ->options([
                        'confluence' => 'Confluence',
                        'jira' => 'Jira',
                        'gitlab' => 'GitLab',
                    ])
                    ->required()
                    ->disabled(),

                Select::make('sync_type')
                    ->label('Sync Type')
                    ->options([
                        'push' => 'Push',
                        'pull' => 'Pull',
                        'bidirectional' => 'Bidirectional',
                    ])
                    ->required()
                    ->disabled(),

                Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'success' => 'Success',
                        'failed' => 'Failed',
                        'conflict' => 'Conflict',
                    ])
                    ->required()
                    ->disabled(),

                TextInput::make('external_id')
                    ->label('External ID')
                    ->disabled(),

                TextInput::make('sync_duration')
                    ->label('Duration (ms)')
                    ->numeric()
                    ->suffix('ms')
                    ->disabled(),

                Select::make('synced_by')
                    ->label('Synced By')
                    ->relationship('syncedBy', 'name')
                    ->disabled(),

                DateTimePicker::make('synced_at')
                    ->label('Synced At')
                    ->disabled(),

                Textarea::make('error_message')
                    ->label('Error Message')
                    ->rows(3)
                    ->disabled()
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('document.title')
                    ->label('Document')
                    ->searchable()
                    ->sortable()
                    ->limit(40)
                    ->url(fn ($record) => $record->document ? route('filament.admin.resources.documents.view', $record->document) : null),

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

                TextColumn::make('sync_type')
                    ->label('Type')
                    ->badge()
                    ->color('primary')
                    ->formatStateUsing(fn (string $state): string => ucfirst($state)),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'success' => 'success',
                        'failed' => 'danger',
                        'pending' => 'warning',
                        'conflict' => 'purple',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst($state))
                    ->sortable(),

                TextColumn::make('external_id')
                    ->label('External ID')
                    ->searchable()
                    ->copyable()
                    ->placeholder('—'),

                TextColumn::make('sync_duration')
                    ->label('Duration')
                    ->numeric()
                    ->sortable()
                    ->suffix(' ms')
                    ->placeholder('—'),

                TextColumn::make('syncedBy.name')
                    ->label('Synced By')
                    ->searchable()
                    ->placeholder('Auto'),

                TextColumn::make('synced_at')
                    ->label('Synced')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->description(fn ($record) => $record->synced_at?->format('M d, Y g:i A')),

                TextColumn::make('created_at')
                    ->label('Created')
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

                \Filament\Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'success' => 'Success',
                        'failed' => 'Failed',
                        'pending' => 'Pending',
                        'conflict' => 'Conflict',
                    ]),

                \Filament\Tables\Filters\SelectFilter::make('sync_type')
                    ->label('Sync Type')
                    ->options([
                        'push' => 'Push',
                        'pull' => 'Pull',
                        'bidirectional' => 'Bidirectional',
                    ]),
            ])
            ->defaultSort('synced_at', 'desc')
            ->recordActions([
                // View only - logs should not be edited
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make()
                        ->label('Delete Old Logs'),
                ]),
            ])
            ->emptyStateHeading('No sync logs')
            ->emptyStateDescription('Sync logs will appear here after integration syncs occur.')
            ->emptyStateIcon('heroicon-o-arrow-path');
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageIntegrationSyncLogs::route('/'),
        ];
    }
}
