<?php

namespace App\Filament\Admin\Resources\Structures\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class StructuresTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->description),
                TextColumn::make('category.name')
                    ->searchable()
                    ->sortable()
                    ->badge()
                    ->color(fn ($record) => $record->category?->color ?? 'gray'),
                TextColumn::make('version')
                    ->numeric()
                    ->sortable()
                    ->badge()
                    ->color('success'),
                TextColumn::make('sections_count')
                    ->counts('sections')
                    ->sortable()
                    ->label('Sections'),
                IconColumn::make('is_active')
                    ->boolean()
                    ->sortable()
                    ->label('Active'),
                IconColumn::make('is_default')
                    ->boolean()
                    ->sortable()
                    ->label('Default'),
                TextColumn::make('documents_count')
                    ->counts('documents')
                    ->sortable()
                    ->label('Documents'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload(),
                TernaryFilter::make('is_active')
                    ->label('Active')
                    ->placeholder('All structures')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only'),
                TernaryFilter::make('is_default')
                    ->label('Default')
                    ->placeholder('All structures')
                    ->trueLabel('Default only')
                    ->falseLabel('Non-default only'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
