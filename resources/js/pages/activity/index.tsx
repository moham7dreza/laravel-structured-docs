import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Activity as ActivityIcon,
    Clock,
    FileText,
    MessageSquare,
    TrendingUp,
    UserCircle,
    Edit,
    Eye,
    Heart,
    GitBranch,
} from 'lucide-react';
import React, { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SharedData } from '@/types';

interface ActivityItem {
    id: number;
    action: string;
    description: string;
    created_at: string;
    created_at_full: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    subject?: {
        type: string;
        id: number;
        title?: string;
        slug?: string;
        url?: string;
        content?: string;
    };
}

interface ActivityFeedProps {
    activities: {
        data: ActivityItem[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total_activities: number;
        today: number;
        this_week: number;
    };
    filter: string;
}

export default function ActivityFeed({ activities, stats, filter }: ActivityFeedProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedFilter, setSelectedFilter] = useState(filter);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getActionIcon = (action: string) => {
        switch (action) {
            case 'created':
                return <FileText className="h-4 w-4 text-green-500" />;
            case 'updated':
                return <Edit className="h-4 w-4 text-blue-500" />;
            case 'viewed':
                return <Eye className="h-4 w-4 text-gray-500" />;
            case 'commented':
                return <MessageSquare className="h-4 w-4 text-purple-500" />;
            case 'liked':
                return <Heart className="h-4 w-4 text-red-500" />;
            case 'reviewed':
                return <GitBranch className="h-4 w-4 text-orange-500" />;
            default:
                return <ActivityIcon className="h-4 w-4 text-muted-foreground" />;
        }
    };

    const handleFilterChange = (newFilter: string) => {
        setSelectedFilter(newFilter);
        router.get(
            '/activity',
            { filter: newFilter },
            { preserveState: true },
        );
    };

    const loadMore = () => {
        if (activities.current_page < activities.last_page) {
            router.get(
                '/activity',
                { filter: selectedFilter, page: activities.current_page + 1 },
                { preserveState: true, preserveScroll: true },
            );
        }
    };

    return (
        <>
            <Head title="Activity Feed" />

            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="text-xl font-bold">
                                📚 Docs
                            </Link>
                            <div className="hidden md:flex items-center gap-4">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/documents"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Documents
                                </Link>
                                <Link
                                    href="/leaderboard"
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Leaderboard
                                </Link>
                                <Link
                                    href="/activity"
                                    className="text-sm font-medium text-foreground"
                                >
                                    Activity
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            {auth.user ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full"
                                    asChild
                                >
                                    <Link href={`/users/${auth.user.id}`}>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                            />
                                            <AvatarFallback className="text-xs bg-brand-500 text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="sr-only">View Profile</span>
                                    </Link>
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" asChild>
                                    <Link href="/login">
                                        <UserCircle className="h-5 w-5" />
                                        <span className="sr-only">Login</span>
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen bg-background text-foreground">
                {/* Hero Section */}
                <div className="border-b bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                                <TrendingUp className="h-5 w-5" />
                                <span className="text-sm font-medium">Recent Activity</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Activity Feed
                            </h1>
                            <p className="text-xl text-brand-100 max-w-2xl mx-auto">
                                Stay updated with the latest actions and contributions from our community
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <ActivityIcon className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {stats.total_activities.toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">Total</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <Clock className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {stats.today.toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">Today</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {stats.this_week.toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">This Week</div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-4xl mx-auto">
                        {/* Filters */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">Recent Activity</h2>
                            <div className="flex gap-2">
                                <Button
                                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleFilterChange('all')}
                                >
                                    All
                                </Button>
                                {auth.user && (
                                    <>
                                        <Button
                                            variant={selectedFilter === 'following' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleFilterChange('following')}
                                        >
                                            Following
                                        </Button>
                                        <Button
                                            variant={selectedFilter === 'my' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleFilterChange('my')}
                                        >
                                            My Activity
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Activity List */}
                        <div className="space-y-4">
                            {activities.data.map((activity) => (
                                <Card key={activity.id} className="p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start gap-4">
                                        {/* User Avatar */}
                                        <Link href={`/users/${activity.user.id}`}>
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={activity.user.avatar} />
                                                <AvatarFallback className="bg-brand-500 text-white text-sm">
                                                    {getInitials(activity.user.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Link>

                                        {/* Activity Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 mb-2">
                                                {getActionIcon(activity.action)}
                                                <div className="flex-1">
                                                    <p className="text-sm">
                                                        <Link
                                                            href={`/users/${activity.user.id}`}
                                                            className="font-semibold hover:underline"
                                                        >
                                                            {activity.user.name}
                                                        </Link>
                                                        <span className="text-muted-foreground mx-1">
                                                            {activity.description}
                                                        </span>
                                                    </p>

                                                    {/* Subject Link */}
                                                    {activity.subject?.type === 'document' && (
                                                        <Link
                                                            href={activity.subject.url || '#'}
                                                            className="text-sm font-medium text-brand-600 hover:underline mt-1 inline-block"
                                                        >
                                                            {activity.subject.title}
                                                        </Link>
                                                    )}

                                                    {/* Timestamp */}
                                                    <p
                                                        className="text-xs text-muted-foreground mt-1"
                                                        title={activity.created_at_full}
                                                    >
                                                        {activity.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Empty State */}
                        {activities.data.length === 0 && (
                            <Card className="p-12 text-center">
                                <ActivityIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-xl font-semibold mb-2">No activity yet</h3>
                                <p className="text-muted-foreground mb-4">
                                    {selectedFilter === 'following'
                                        ? "Follow users to see their activity here."
                                        : selectedFilter === 'my'
                                          ? "Your activity will appear here as you contribute."
                                          : "Activity will appear here as users contribute to the platform."}
                                </p>
                                {selectedFilter !== 'all' && (
                                    <Button onClick={() => handleFilterChange('all')}>
                                        View All Activity
                                    </Button>
                                )}
                            </Card>
                        )}

                        {/* Pagination */}
                        {activities.last_page > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Page {activities.current_page} of {activities.last_page}
                                </p>
                                {activities.current_page < activities.last_page && (
                                    <Button variant="outline" onClick={loadMore}>
                                        Load More
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
