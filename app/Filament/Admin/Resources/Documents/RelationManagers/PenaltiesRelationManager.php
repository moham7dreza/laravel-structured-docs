<?php

namespace App\Filament\Admin\Resources\Documents\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PenaltiesRelationManager extends RelationManager
{
    protected static string $relationship = 'penalties';

    protected static ?string $title = 'Applied Penalties';

    protected static string|\BackedEnum|null $icon = 'heroicon-o-exclamation-triangle';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('rule_id')
                    ->label('Rule')
                    ->relationship('rule', 'name')
                    ->required()
                    ->disabled(),

                TextInput::make('penalty_score')
                    ->label('Penalty Score')
                    ->numeric()
                    ->required()
                    ->disabled()
                    ->suffix('points'),

                DateTimePicker::make('applied_at')
                    ->label('Applied At')
                    ->disabled(),

                Textarea::make('reason')
                    ->label('Reason')
                    ->disabled()
                    ->columnSpanFull(),

                Toggle::make('is_resolved')
                    ->label('Mark as Resolved'),

                Select::make('resolved_by')
                    ->label('Resolved By')
                    ->relationship('resolver', 'name')
                    ->visible(fn ($get) => $get('is_resolved')),

                DateTimePicker::make('resolved_at')
                    ->label('Resolved At')
                    ->visible(fn ($get) => $get('is_resolved')),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('rule.name')
            ->columns([
                TextColumn::make('rule.name')
                    ->label('Rule')
                    ->searchable()
                    ->weight('bold'),

                TextColumn::make('penalty_score')
                    ->label('Penalty')
                    ->numeric()
                    ->sortable()
                    ->suffix(' pts')
                    ->color(fn (int $state): string => match (true) {
                        $state >= 50 => 'danger',
                        $state >= 25 => 'warning',
                        default => 'gray',
                    }),

                TextColumn::make('applied_at')
                    ->label('Applied')
                    ->dateTime()
                    ->sortable()
                    ->since(),

                IconColumn::make('is_resolved')
                    ->label('Resolved')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('resolver.name')
                    ->label('Resolved By')
                    ->placeholder('—'),
            ])
            ->filters([
                \Filament\Tables\Filters\TernaryFilter::make('is_resolved')
                    ->label('Status')
                    ->placeholder('All')
                    ->trueLabel('Resolved')
                    ->falseLabel('Unresolved'),
            ])
            ->defaultSort('applied_at', 'desc')
            ->headerActions([
                // No create action - penalties are auto-applied
            ])
            ->recordActions([
                // Allow editing only to resolve penalties
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No penalties applied')
            ->emptyStateDescription('This document has no penalties from outdated rules.')
            ->emptyStateIcon('heroicon-o-check-circle');
    }
}
