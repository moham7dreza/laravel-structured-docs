<?php

namespace App\Filament\Admin\Resources\Categories\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class CategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
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
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Appearance')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('icon')
                                    ->maxLength(100)
                                    ->placeholder('heroicon-o-document-text')
                                    ->helperText('Use Heroicon name (e.g., heroicon-o-document-text)'),
                                ColorPicker::make('color')
                                    ->placeholder('#3B82F6')
                                    ->helperText('Brand color for this category'),
                            ]),
                    ]),

                Section::make('Status')
                    ->schema([
                        Toggle::make('is_active')
                            ->default(true)
                            ->helperText('Inactive categories won\'t be available for new documents'),
                    ]),
            ]);
    }
}
