<?php

namespace App\Filament\Admin\Widgets;

use App\Models\User;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LeaderboardWidget extends TableWidget
{
    protected static ?int $sort = 2;

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                User::query()
                    ->orderBy('total_score', 'desc')
                    ->limit(10)
            )
            ->columns([
                TextColumn::make('current_rank')
                    ->label('Rank')
                    ->badge()
                    ->color(fn ($state) => match (true) {
                        $state === 1 => 'warning',
                        $state === 2 => 'gray',
                        $state === 3 => 'orange',
                        default => 'primary',
                    })
                    ->icon(fn ($state) => match (true) {
                        $state === 1 => 'heroicon-o-trophy',
                        $state === 2 => 'heroicon-o-star',
                        $state === 3 => 'heroicon-o-sparkles',
                        default => null,
                    }),
                ImageColumn::make('avatar')
                    ->circular()
                    ->defaultImageUrl(fn ($record) => 'https://ui-avatars.com/api/?name='.urlencode($record->name).'&color=7F9CF5&background=EBF4FF'),
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),
                TextColumn::make('total_score')
                    ->label('Score')
                    ->numeric()
                    ->sortable()
                    ->badge()
                    ->color('success'),
                TextColumn::make('documents_count')
                    ->counts('documents')
                    ->label('Documents')
                    ->badge()
                    ->color('info'),
            ])
            ->heading('🏆 Top Contributors')
            ->description('Users with the highest contribution scores');
    }
}
