import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import {
    BookOpen,
    Eye,
    FileText,
    TrendingUp,
    Clock,
    Bookmark,
    MessageSquare,
    Star,
    Activity as ActivityIcon,
    UserCircle,
    ArrowRight,
    Sparkles,
} from 'lucide-react';
import type { SharedData } from '@/types';
import React from 'react';
interface DashboardProps {
    stats: {
        documents_read: number;
        bookmarks: number;
        contributions: number;
        comments: number;
    };
    recentDocuments: Array<any>;
    bookmarks: Array<any>;
    activities: Array<any>;
    recommended: Array<any>;
    myDocuments: Array<any>;
}
export default function Dashboard({
    stats,
    recentDocuments,
    bookmarks,
    activities,
    recommended,
    myDocuments,
}: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };
    const formatNumber = (num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };
    return (
        <>
            <Head title="Dashboard" />
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                                href="/categories"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Categories
                            </Link>
                            <Link
                                href="/tags"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Tags
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {auth?.user && (
                            <Link href={`/users/${auth.user.id}`}>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    {/* Welcome Section */}
                    <div className="mb-12">
                        <h1 className="text-4xl md:text-5xl font-black mb-3">
                            Welcome back, {auth?.user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Here's what's happening with your documentation
                        </p>
                    </div>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-2 hover:border-blue-500/50 transition-all hover:shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-lg bg-blue-500/20">
                                    <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="text-3xl font-black mb-1">{stats.documents_read}</div>
                            <div className="text-sm text-muted-foreground">Documents Read</div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-2 hover:border-amber-500/50 transition-all hover:shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-lg bg-amber-500/20">
                                    <Bookmark className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="text-3xl font-black mb-1">{stats.bookmarks}</div>
                            <div className="text-sm text-muted-foreground">Bookmarked</div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-2 hover:border-green-500/50 transition-all hover:shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-lg bg-green-500/20">
                                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-3xl font-black mb-1">{stats.contributions}</div>
                            <div className="text-sm text-muted-foreground">Contributions</div>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-2 hover:border-purple-500/50 transition-all hover:shadow-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-3 rounded-lg bg-purple-500/20">
                                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="text-3xl font-black mb-1">{stats.comments}</div>
                            <div className="text-sm text-muted-foreground">Comments</div>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content - 2 columns */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Continue Reading */}
                            {recentDocuments.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <Clock className="w-6 h-6 text-primary" />
                                            Continue Reading
                                        </h2>
                                        <Link href="/documents">
                                            <Button variant="ghost" size="sm">
                                                View all
                                                <ArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {recentDocuments.slice(0, 4).map((doc) => (
                                            <Link key={doc.id} href={`/documents/${doc.slug}`}>
                                                <Card className="p-5 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
                                                    {doc.category && (
                                                        <Badge variant="outline" className="mb-3">
                                                            {doc.category.icon && <span className="mr-1">{doc.category.icon}</span>}
                                                            {doc.category.name}
                                                        </Badge>
                                                    )}
                                                    <h3 className="font-semibold mb-2 line-clamp-2">{doc.title}</h3>
                                                    {doc.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            {doc.score}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {formatNumber(doc.views_count)}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* Recommended for You */}
                            {recommended.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <Sparkles className="w-6 h-6 text-primary" />
                                            Recommended for You
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {recommended.slice(0, 4).map((doc) => (
                                            <Link key={doc.id} href={`/documents/${doc.slug}`}>
                                                <Card className="p-5 hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer h-full">
                                                    {doc.category && (
                                                        <Badge variant="outline" className="mb-3">
                                                            {doc.category.icon && <span className="mr-1">{doc.category.icon}</span>}
                                                            {doc.category.name}
                                                        </Badge>
                                                    )}
                                                    <h3 className="font-semibold mb-2 line-clamp-2">{doc.title}</h3>
                                                    {doc.description && (
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 text-amber-500" />
                                                            {doc.score}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Eye className="w-3 h-3" />
                                                            {formatNumber(doc.views_count)}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* My Documents */}
                            {myDocuments.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-primary" />
                                            My Documents
                                        </h2>
                                    </div>
                                    <Card className="p-6">
                                        <div className="space-y-3">
                                            {myDocuments.map((doc) => (
                                                <Link
                                                    key={doc.id}
                                                    href={`/documents/${doc.slug}`}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors group"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium group-hover:text-primary transition-colors">
                                                            {doc.title}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Updated {doc.updated_at}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge>{doc.status}</Badge>
                                                        <div className="text-sm text-muted-foreground">
                                                            {doc.views_count} views
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            )}
                        </div>
                        {/* Sidebar - 1 column */}
                        <div className="space-y-8">
                            {/* Bookmarks */}
                            {bookmarks.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Bookmark className="w-5 h-5 text-primary" />
                                            Bookmarks
                                        </h3>
                                    </div>
                                    <Card className="p-4">
                                        <div className="space-y-3">
                                            {bookmarks.slice(0, 5).map((doc) => (
                                                <Link
                                                    key={doc.id}
                                                    href={`/documents/${doc.slug}`}
                                                    className="block group"
                                                >
                                                    <div className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                                                        {doc.title}
                                                    </div>
                                                    {doc.category && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {doc.category.name}
                                                        </div>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            )}
                            {/* Recent Activity */}
                            {activities.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-bold flex items-center gap-2">
                                            <ActivityIcon className="w-5 h-5 text-primary" />
                                            Recent Activity
                                        </h3>
                                        <Link href="/activity">
                                            <Button variant="ghost" size="sm">
                                                View all
                                            </Button>
                                        </Link>
                                    </div>
                                    <Card className="p-4">
                                        <div className="space-y-4">
                                            {activities.slice(0, 6).map((activity) => (
                                                <div key={activity.id} className="flex gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={activity.user.avatar}
                                                            alt={activity.user.name}
                                                        />
                                                        <AvatarFallback className="text-xs">
                                                            {getInitials(activity.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm">
                                                            <span className="font-medium">{activity.user.name}</span>{' '}
                                                            <span className="text-muted-foreground">{activity.description}</span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            {activity.created_at}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                </div>
                            )}
                            {/* Quick Actions */}
                            <div>
                                <h3 className="font-bold mb-4 flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary" />
                                    Quick Actions
                                </h3>
                                <Card className="p-4">
                                    <div className="space-y-2">
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <Link href="/documents">
                                                <BookOpen className="w-4 h-4 mr-2" />
                                                Browse Documents
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <Link href="/categories">
                                                <FileText className="w-4 h-4 mr-2" />
                                                View Categories
                                            </Link>
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" asChild>
                                            <Link href="/leaderboard">
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                Leaderboard
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
