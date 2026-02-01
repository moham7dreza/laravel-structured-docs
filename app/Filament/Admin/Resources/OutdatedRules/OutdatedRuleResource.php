<?php

namespace App\Filament\Admin\Resources\OutdatedRules;

use App\Filament\Admin\Resources\OutdatedRules\Pages\ManageOutdatedRules;
use App\Models\OutdatedRule;
use BackedEnum;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\KeyValue;
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

class OutdatedRuleResource extends Resource
{
    protected static ?string $model = OutdatedRule::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedShieldExclamation;

    protected static ?string $navigationLabel = 'Outdated Rules';

    protected static ?string $modelLabel = 'Outdated Rule';

    protected static ?string $pluralModelLabel = 'Outdated Rules';

    protected static string|\UnitEnum|null $navigationGroup = 'Configuration';

    protected static ?int $navigationSort = 10;

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Rule Name')
                    ->required()
                    ->maxLength(255)
                    ->placeholder('e.g., Flag documents inactive for 90 days')
                    ->helperText('A descriptive name for this rule')
                    ->columnSpanFull(),

                Textarea::make('description')
                    ->label('Description')
                    ->rows(3)
                    ->placeholder('Explain what this rule does and when it triggers')
                    ->helperText('Optional: Detailed explanation of the rule')
                    ->columnSpanFull(),

                Select::make('condition_type')
                    ->label('Condition Type')
                    ->options([
                        'days_inactive' => 'Days Inactive',
                        'jira_closed' => 'Jira Task Closed',
                        'branch_merged' => 'Branch Merged',
                        'link_broken' => 'Broken Link',
                        'schema_changed' => 'Schema Changed',
                    ])
                    ->required()
                    ->native(false)
                    ->helperText('The type of condition that triggers this rule'),

                KeyValue::make('condition_params')
                    ->label('Condition Parameters')
                    ->keyLabel('Parameter')
                    ->valueLabel('Value')
                    ->addButtonLabel('Add parameter')
                    ->helperText('Key-value pairs for condition configuration (e.g., days: 90)')
                    ->columnSpanFull(),

                TextInput::make('penalty_score')
                    ->label('Penalty Score')
                    ->required()
                    ->numeric()
                    ->default(10)
                    ->minValue(0)
                    ->maxValue(100)
                    ->suffix('points')
                    ->helperText('Score deducted when rule is triggered (0-100)'),

                TextInput::make('priority')
                    ->label('Priority')
                    ->required()
                    ->numeric()
                    ->default(1)
                    ->minValue(0)
                    ->helperText('Higher priority rules are checked first'),

                Toggle::make('is_active')
                    ->label('Active')
                    ->required()
                    ->default(true)
                    ->helperText('Enable or disable this rule'),
            ])
            ->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Rule Name')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('condition_type')
                    ->label('Condition')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'days_inactive' => 'warning',
                        'jira_closed' => 'info',
                        'branch_merged' => 'success',
                        'link_broken' => 'danger',
                        'schema_changed' => 'purple',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => str_replace('_', ' ', ucwords($state, '_')))
                    ->sortable(),

                TextColumn::make('penalty_score')
                    ->label('Penalty')
                    ->numeric()
                    ->sortable()
                    ->suffix(' pts')
                    ->color(fn (int $state): string => match (true) {
                        $state >= 50 => 'danger',
                        $state >= 25 => 'warning',
                        default => 'success',
                    }),

                TextColumn::make('priority')
                    ->label('Priority')
                    ->numeric()
                    ->sortable()
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state >= 5 => 'danger',
                        $state >= 3 => 'warning',
                        default => 'gray',
                    }),

                IconColumn::make('is_active')
                    ->label('Active')
                    ->boolean()
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                \Filament\Tables\Filters\SelectFilter::make('condition_type')
                    ->label('Condition Type')
                    ->options([
                        'days_inactive' => 'Days Inactive',
                        'jira_closed' => 'Jira Task Closed',
                        'branch_merged' => 'Branch Merged',
                        'link_broken' => 'Broken Link',
                        'schema_changed' => 'Schema Changed',
                    ]),

                \Filament\Tables\Filters\TernaryFilter::make('is_active')
                    ->label('Active')
                    ->placeholder('All rules')
                    ->trueLabel('Active only')
                    ->falseLabel('Inactive only'),
            ])
            ->defaultSort('priority', 'desc')
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
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
            'index' => ManageOutdatedRules::route('/'),
        ];
    }
}
