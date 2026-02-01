<?php

namespace App\Filament\Admin\Resources\Categories\Schemas;

use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Select;
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
                                Select::make('icon')
                                    ->options([
                                        'heroicon-o-book-open' => 'Book Open',
                                        'heroicon-o-document-text' => 'Document Text',
                                        'heroicon-o-academic-cap' => 'Academic Cap',
                                        'heroicon-o-beaker' => 'Beaker',
                                        'heroicon-o-briefcase' => 'Briefcase',
                                        'heroicon-o-chart-bar' => 'Chart Bar',
                                        'heroicon-o-circle-stack' => 'Circle Stack',
                                        'heroicon-o-clipboard-document-list' => 'Clipboard Document List',
                                        'heroicon-o-code-bracket' => 'Code Bracket',
                                        'heroicon-o-cog' => 'Cog',
                                        'heroicon-o-cube-transparent' => 'Cube Transparent',
                                        'heroicon-o-cube' => 'Cube',
                                        'heroicon-o-folder' => 'Folder',
                                        'heroicon-o-globe-alt' => 'Globe',
                                        'heroicon-o-home' => 'Home',
                                        'heroicon-o-light-bulb' => 'Light Bulb',
                                        'heroicon-o-lock-closed' => 'Lock Closed',
                                        'heroicon-o-magnifying-glass' => 'Magnifying Glass',
                                        'heroicon-o-newspaper' => 'Newspaper',
                                        'heroicon-o-puzzle-piece' => 'Puzzle Piece',
                                        'heroicon-o-rocket-launch' => 'Rocket Launch',
                                        'heroicon-o-server' => 'Server',
                                        'heroicon-o-sparkles' => 'Sparkles',
                                        'heroicon-o-squares-plus' => 'Squares Plus',
                                        'heroicon-o-star' => 'Star',
                                        'heroicon-o-tag' => 'Tag',
                                        'heroicon-o-wrench-screwdriver' => 'Wrench Screwdriver',
                                    ])
                                    ->searchable()
                                    ->required()
                                    ->default('heroicon-o-document-text')
                                    ->helperText('Select an icon for this category'),
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
