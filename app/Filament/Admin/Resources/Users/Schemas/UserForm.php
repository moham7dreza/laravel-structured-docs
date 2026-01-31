<?php

namespace App\Filament\Admin\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Tabs;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('User Details')
                    ->tabs([
                        Tabs\Tab::make('Profile')
                            ->schema([
                                Section::make()
                                    ->schema([
                                        TextInput::make('name')
                                            ->required()
                                            ->maxLength(255),
                                        TextInput::make('email')
                                            ->label('Email Address')
                                            ->email()
                                            ->required()
                                            ->unique(ignoreRecord: true)
                                            ->maxLength(255),
                                        TextInput::make('password')
                                            ->password()
                                            ->dehydrated(fn ($state) => filled($state))
                                            ->required(fn (string $context): bool => $context === 'create')
                                            ->maxLength(255),
                                        FileUpload::make('avatar')
                                            ->image()
                                            ->avatar()
                                            ->directory('avatars')
                                            ->imageEditor()
                                            ->columnSpanFull(),
                                    ])
                                    ->columns(2),
                            ]),

                        Tabs\Tab::make('Gamification')
                            ->schema([
                                Section::make('Score & Ranking')
                                    ->schema([
                                        TextInput::make('total_score')
                                            ->numeric()
                                            ->default(0)
                                            ->disabled()
                                            ->helperText('Auto-calculated from user activities'),
                                        TextInput::make('current_rank')
                                            ->numeric()
                                            ->disabled()
                                            ->helperText('Current leaderboard rank'),
                                    ])
                                    ->columns(2),
                            ]),

                        Tabs\Tab::make('Integration')
                            ->schema([
                                Section::make('External Services')
                                    ->schema([
                                        TextInput::make('telegram_chat_id')
                                            ->tel()
                                            ->maxLength(255)
                                            ->helperText('Telegram Chat ID for notifications'),
                                    ]),
                            ]),

                        Tabs\Tab::make('Security')
                            ->schema([
                                Section::make('Email Verification')
                                    ->schema([
                                        DateTimePicker::make('email_verified_at')
                                            ->label('Email Verified At'),
                                    ]),

                                Section::make('Two-Factor Authentication')
                                    ->schema([
                                        Textarea::make('two_factor_secret')
                                            ->disabled()
                                            ->columnSpanFull(),
                                        Textarea::make('two_factor_recovery_codes')
                                            ->disabled()
                                            ->columnSpanFull(),
                                        DateTimePicker::make('two_factor_confirmed_at')
                                            ->disabled(),
                                    ])
                                    ->collapsed(),
                            ]),
                    ])
                    ->columnSpanFull(),
            ]);
    }
}
