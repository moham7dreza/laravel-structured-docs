<?php

namespace App\Filament\Admin\Resources\DocumentPenalties;

use App\Filament\Admin\Resources\DocumentPenalties\Pages\ManageDocumentPenalties;
use App\Models\DocumentPenalty;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class DocumentPenaltyResource extends Resource
{
    protected static ?string $model = DocumentPenalty::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedExclamationTriangle;

    protected static ?string $navigationLabel = 'Document Penalties';

    protected static ?string $modelLabel = 'Document Penalty';

    protected static ?string $pluralModelLabel = 'Document Penalties';

    protected static string|\UnitEnum|null $navigationGroup = 'Monitoring';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('document_id')
                    ->label('Document')
                    ->relationship('document', 'title')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->disabled()
                    ->helperText('The document this penalty was applied to'),

                Select::make('rule_id')
                    ->label('Outdated Rule')
                    ->relationship('rule', 'name')
                    ->required()
                    ->searchable()
                    ->preload()
                    ->disabled()
                    ->helperText('The rule that triggered this penalty'),

                TextInput::make('penalty_score')
                    ->label('Penalty Score')
                    ->required()
                    ->numeric()
                    ->disabled()
                    ->suffix('points')
                    ->helperText('Score deducted from document'),

                DateTimePicker::make('applied_at')
                    ->label('Applied At')
                    ->disabled()
                    ->helperText('When this penalty was applied'),

                Textarea::make('reason')
                    ->label('Reason')
                    ->rows(3)
                    ->disabled()
                    ->helperText('Why this penalty was applied')
                    ->columnSpanFull(),

                Toggle::make('is_resolved')
                    ->label('Resolved')
                    ->helperText('Mark as resolved if issue is fixed'),

                Select::make('resolved_by')
                    ->label('Resolved By')
                    ->relationship('resolver', 'name')
                    ->searchable()
                    ->preload()
                    ->visible(fn ($get) => $get('is_resolved'))
                    ->helperText('User who resolved this penalty'),

                DateTimePicker::make('resolved_at')
                    ->label('Resolved At')
                    ->visible(fn ($get) => $get('is_resolved'))
                    ->helperText('When this penalty was resolved'),
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
                    ->limit(50)
                    ->weight('bold')
                    ->url(fn ($record) => $record->document ? route('filament.admin.resources.documents.view', $record->document) : null)
                    ->color('primary'),

                TextColumn::make('rule.name')
                    ->label('Rule Triggered')
                    ->searchable()
                    ->sortable()
                    ->limit(40),

                TextColumn::make('penalty_score')
                    ->label('Penalty')
                    ->numeric()
                    ->sortable()
                    ->suffix(' pts')
                    ->color(fn (int $state): string => match (true) {
                        $state >= 50 => 'danger',
                        $state >= 25 => 'warning',
                        default => 'gray',
                    })
                    ->weight('bold'),

                TextColumn::make('applied_at')
                    ->label('Applied')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->description(fn ($record) => $record->applied_at?->format('M d, Y g:i A')),

                IconColumn::make('is_resolved')
                    ->label('Resolved')
                    ->boolean()
                    ->sortable()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),

                TextColumn::make('resolver.name')
                    ->label('Resolved By')
                    ->searchable()
                    ->sortable()
                    ->placeholder('—')
                    ->toggleable(),

                TextColumn::make('resolved_at')
                    ->label('Resolved')
                    ->dateTime()
                    ->sortable()
                    ->since()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                \Filament\Tables\Filters\SelectFilter::make('document_id')
                    ->label('Document')
                    ->relationship('document', 'title')
                    ->searchable()
                    ->preload(),

                \Filament\Tables\Filters\SelectFilter::make('rule_id')
                    ->label('Rule')
                    ->relationship('rule', 'name')
                    ->searchable()
                    ->preload(),

                \Filament\Tables\Filters\TernaryFilter::make('is_resolved')
                    ->label('Resolution Status')
                    ->placeholder('All penalties')
                    ->trueLabel('Resolved only')
                    ->falseLabel('Unresolved only'),
            ])
            ->defaultSort('applied_at', 'desc')
            ->recordActions([
                EditAction::make()
                    ->label('Resolve'),
                DeleteAction::make()
                    ->label('Remove'),
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
            'index' => ManageDocumentPenalties::route('/'),
        ];
    }
}
