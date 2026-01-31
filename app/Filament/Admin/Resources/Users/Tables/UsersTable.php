<?php

namespace App\Filament\Admin\Resources\Users\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('avatar')
                    ->circular()
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name='.urlencode($record->name).'&color=7F9CF5&background=EBF4FF'),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->description(fn ($record) => $record->email),
                TextColumn::make('email')
                    ->label('Email Address')
                    ->searchable()
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('email_verified_at')
                    ->label('Verified')
                    ->boolean()
                    ->sortable()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle'),
                TextColumn::make('total_score')
                    ->numeric()
                    ->sortable()
                    ->label('Score')
                    ->badge()
                    ->color('success'),
                TextColumn::make('current_rank')
                    ->numeric()
                    ->sortable()
                    ->label('Rank')
                    ->badge()
                    ->color(fn ($state) => $state <= 3 ? 'warning' : 'gray'),
                TextColumn::make('documents_count')
                    ->counts('documents')
                    ->sortable()
                    ->label('Documents'),
                TextColumn::make('telegram_chat_id')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('two_factor_confirmed_at')
                    ->label('2FA')
                    ->boolean()
                    ->sortable()
                    ->toggleable(),
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
                TernaryFilter::make('email_verified_at')
                    ->label('Email Verified')
                    ->placeholder('All users')
                    ->trueLabel('Verified only')
                    ->falseLabel('Unverified only'),
                TernaryFilter::make('two_factor_confirmed_at')
                    ->label('Two-Factor Auth')
                    ->placeholder('All users')
                    ->trueLabel('2FA enabled')
                    ->falseLabel('2FA disabled'),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('total_score', 'desc');
    }
}
