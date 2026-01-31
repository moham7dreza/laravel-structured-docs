<?php

namespace App\Filament\Admin\Widgets;

use App\Models\Category;
use App\Models\Document;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected function getStats(): array
    {
        return [
            Stat::make('Total Documents', Document::count())
                ->description('All documents in the system')
                ->descriptionIcon('heroicon-o-document-text')
                ->color('success')
                ->chart([7, 3, 4, 5, 6, 3, 5, 3]),
            Stat::make('Published Documents', Document::where('status', 'published')->count())
                ->description('Currently published')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('info'),
            Stat::make('Pending Review', Document::where('approval_status', 'pending')->count())
                ->description('Awaiting approval')
                ->descriptionIcon('heroicon-o-clock')
                ->color('warning'),
            Stat::make('Total Users', User::count())
                ->description('Registered users')
                ->descriptionIcon('heroicon-o-users')
                ->color('primary'),
            Stat::make('Active Categories', Category::where('is_active', true)->count())
                ->description('Available categories')
                ->descriptionIcon('heroicon-o-rectangle-stack')
                ->color('success'),
            Stat::make('Stale Documents', Document::where('status', 'stale')->count())
                ->description('Need updating')
                ->descriptionIcon('heroicon-o-exclamation-triangle')
                ->color('danger'),
        ];
    }
}
