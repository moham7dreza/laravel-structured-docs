<?php

namespace App\Filament\Admin\Resources\Structures\Schemas;

use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class StructureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Select::make('category_id')
                            ->relationship('category', 'name')
                            ->required()
                            ->searchable()
                            ->preload()
                            ->createOptionForm([
                                TextInput::make('name')->required(),
                                TextInput::make('slug')->required(),
                            ]),
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        TextInput::make('version')
                            ->numeric()
                            ->default(1)
                            ->minValue(1)
                            ->required()
                            ->helperText('Schema version number'),
                    ])
                    ->columns(2),

                Section::make('Settings')
                    ->schema([
                        Toggle::make('is_active')
                            ->default(true)
                            ->helperText('Only active structures can be used for new documents'),
                        Toggle::make('is_default')
                            ->default(false)
                            ->helperText('Default structure for this category'),
                    ])
                    ->columns(2),

                Section::make('Structure Sections')
                    ->schema([
                        Repeater::make('sections')
                            ->relationship()
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpan(2),
                                Textarea::make('description')
                                    ->rows(2)
                                    ->columnSpanFull(),
                                Toggle::make('is_required')
                                    ->default(false)
                                    ->helperText('Must be completed before document can be published'),
                                Toggle::make('is_repeatable')
                                    ->default(false)
                                    ->helperText('Section can have multiple instances'),
                                TextInput::make('min_items')
                                    ->numeric()
                                    ->default(0)
                                    ->minValue(0)
                                    ->visible(fn ($get) => $get('is_repeatable')),
                                TextInput::make('max_items')
                                    ->numeric()
                                    ->minValue(1)
                                    ->nullable()
                                    ->visible(fn ($get) => $get('is_repeatable')),
                            ])
                            ->columns(4)
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['title'] ?? null)
                            ->reorderable()
                            ->orderColumn('position')
                            ->addActionLabel('Add Section'),
                    ])
                    ->collapsed(),
            ]);
    }
}
