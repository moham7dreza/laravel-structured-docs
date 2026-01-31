<?php

namespace App\Filament\Admin\Resources\Comments\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class CommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('document_id')
                    ->relationship('document', 'title')
                    ->required(),
                Select::make('parent_id')
                    ->relationship('parent', 'id'),
                Select::make('section_item_id')
                    ->relationship('sectionItem', 'id'),
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Textarea::make('content')
                    ->required()
                    ->columnSpanFull(),
                Toggle::make('is_resolved')
                    ->required(),
                TextInput::make('resolved_by')
                    ->numeric(),
                DateTimePicker::make('resolved_at'),
            ]);
    }
}
