<?php

namespace App\Filament\Admin\Resources\Tags\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class TagForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make()
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),
                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->rules(['alpha_dash']),
                        ColorPicker::make('color')
                            ->placeholder('#3B82F6')
                            ->helperText('Optional color for the tag badge'),
                        TextInput::make('usage_count')
                            ->numeric()
                            ->default(0)
                            ->disabled()
                            ->helperText('Auto-calculated based on document usage'),
                    ])
                    ->columns(2),
            ]);
    }
}
