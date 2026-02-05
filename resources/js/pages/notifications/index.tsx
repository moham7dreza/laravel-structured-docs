import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BellOff,
    Check,
    CheckCheck,
    FileText,
    MessageSquare,
    UserCircle,
    UserPlus,
    Heart,
    GitBranch,
    AlertCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SharedData } from '@/types';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    data?: any;
    read_at?: string;
    created_at: string;
    created_at_human: string;
    sender?: {
        id: number;
        name: string;
        avatar?: string;
    };
}

interface NotificationsPageProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: {
        total: number;
        unread: number;
        read: number;
    };
    filter: string;
}

export default function NotificationsPage({ notifications, stats, filter }: NotificationsPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedFilter, setSelectedFilter] = useState(filter);
    const [isScrolled, setIsScrolled] = useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'comment':
                return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case 'mention':
                return <MessageSquare className="w-5 h-5 text-purple-500" />;
            case 'like':
                return <Heart className="w-5 h-5 text-red-500" />;
            case 'follow':
                return <UserPlus className="w-5 h-5 text-green-500" />;
            case 'document_updated':
                return <FileText className="w-5 h-5 text-orange-500" />;
            case 'review_request':
                return <GitBranch className="w-5 h-5 text-indigo-500" />;
            case 'status_change':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Bell className="w-5 h-5 text-muted-foreground" />;
        }
    };

    const handleFilterChange = (newFilter: string) => {
        setSelectedFilter(newFilter);
        router.get('/notifications', { filter: newFilter }, { preserveState: true });
    };

    const markAsRead = (notificationId: number) => {
        router.post(`/notifications/${notificationId}/read`, {}, { preserveState: true });
    };

    const markAllAsRead = () => {
        router.post('/notifications/read-all', {}, { preserveState: true });
    };

    const loadMore = () => {
        if (notifications.current_page < notifications.last_page) {
            router.get(
                '/notifications',
                { filter: selectedFilter, page: notifications.current_page + 1 },
                { preserveState: true, preserveScroll: true }
            );
        }
    };

    return (
        <>
            <Head title="Notifications" />

            {/* Navigation Header */}
            <header
                className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                    isScrolled
                        ? 'bg-background/95 backdrop-blur shadow-md'
                        : 'bg-background/60 backdrop-blur'
                }`}
            >
                <div className="container flex h-14 items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <FileText className="h-6 w-6" />
                            <span className="font-bold text-lg">DocSystem</span>
                        </Link>
                        <nav className="hidden md:flex gap-6">
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
                                href="/dashboard"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Dashboard
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {auth?.user ? (
                            <Link href={`/users/${auth.user.id}`}>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        ) : (
                            <Link href="/login">
                                <UserCircle className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer" />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
                {/* Hero Section */}
                <div className="border-b bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                                <Bell className="h-5 w-5" />
                                <span className="text-sm font-medium">Notifications</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">Stay Updated</h1>
                            <p className="text-xl text-brand-100">
                                All your notifications in one place
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <Bell className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <div className="text-sm text-brand-200">Total</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <BellOff className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">{stats.unread}</div>
                                <div className="text-sm text-brand-200">Unread</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <CheckCheck className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">{stats.read}</div>
                                <div className="text-sm text-brand-200">Read</div>
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Filters and Actions */}
                    <Card className="p-4 mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-2">
                                <Button
                                    variant={(selectedFilter === 'all' ? 'default' : 'outline') as 'default' | 'outline'}
                                    onClick={() => handleFilterChange('all')}
                                >
                                    All ({stats.total})
                                </Button>
                                <Button
                                    variant={(selectedFilter === 'unread' ? 'default' : 'outline') as 'default' | 'outline'}
                                    onClick={() => handleFilterChange('unread')}
                                >
                                    Unread ({stats.unread})
                                </Button>
                                <Button
                                    variant={(selectedFilter === 'read' ? 'default' : 'outline') as 'default' | 'outline'}
                                    onClick={() => handleFilterChange('read')}
                                >
                                    Read ({stats.read})
                                </Button>
                            </div>

                            {stats.unread > 0 && (
                                <Button
                                    variant="outline"
                                    onClick={markAllAsRead}
                                    className="gap-2"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Mark all as read
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Notifications List */}
                    {notifications.data.length > 0 ? (
                        <div className="space-y-3">
                            {notifications.data.map((notification) => (
                                <Card
                                    key={notification.id}
                                    className={`p-4 hover:shadow-md transition-all ${
                                        !notification.read_at
                                            ? 'bg-brand-50/50 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800'
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Sender Avatar or Icon */}
                                        {notification.sender ? (
                                            <Link href={`/users/${notification.sender.id}`}>
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={notification.sender.avatar} />
                                                    <AvatarFallback className="bg-brand-500 text-white text-sm">
                                                        {getInitials(notification.sender.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </Link>
                                        ) : (
                                            <div className="p-2 rounded-full bg-muted">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                        )}

                                        {/* Notification Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-semibold text-sm">
                                                    {notification.title}
                                                </h3>
                                                {!notification.read_at && (
                                                    <Badge
                                                        variant="default"
                                                        className="shrink-0 bg-brand-500"
                                                    >
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{notification.created_at_human}</span>
                                                {!notification.read_at && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="h-6 px-2 text-xs gap-1"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Mark as read
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                <BellOff className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No notifications</h3>
                            <p className="text-muted-foreground">
                                {selectedFilter === 'unread'
                                    ? "You're all caught up! No unread notifications."
                                    : selectedFilter === 'read'
                                      ? 'No read notifications to show.'
                                      : "You don't have any notifications yet."}
                            </p>
                        </Card>
                    )}

                    {/* Pagination */}
                    {notifications.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <p className="text-sm text-muted-foreground">
                                Page {notifications.current_page} of {notifications.last_page}
                            </p>
                            {notifications.current_page < notifications.last_page && (
                                <Button variant="outline" onClick={loadMore}>
                                    Load more
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
