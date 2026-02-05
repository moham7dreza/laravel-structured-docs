import { Head, Link, router } from '@inertiajs/react';
import {
    Award,
    BookOpen,
    Calendar,
    FileText,
    TrendingUp,
    Users,
    UserCheck,
    UserPlus,
    Settings,
    Mail,
} from 'lucide-react';
import React, { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface UserProfileProps {
    user: {
        id: number;
        name: string;
        email?: string;
        avatar?: string;
        total_score: number;
        current_rank?: number;
        created_at: string;
        followers_count: number;
        following_count: number;
        documents_count: number;
        score_breakdown?: {
            documents_created: number;
            documents_reviewed: number;
            helpful_votes: number;
            comments_made: number;
        };
        leaderboard_position?: number;
    };
    documents: {
        data: Array<any>;
        current_page: number;
        last_page: number;
        total: number;
    };
    activities: Array<any>;
    isFollowing: boolean;
    isOwnProfile: boolean;
}

export default function UserProfile({
    user,
    documents,
    activities,
    isFollowing,
    isOwnProfile,
}: UserProfileProps) {
    const [activeTab, setActiveTab] = useState<
        'documents' | 'activity' | 'stats'
    >('documents');

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFollow = () => {
        if (isFollowing) {
            router.delete(`/users/${user.id}/follow`, {
                preserveScroll: true,
            });
        } else {
            router.post(
                `/users/${user.id}/follow`,
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
        });
    };

    return (
        <>
            <Head title={`${user.name} - User Profile`} />

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
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen bg-background text-foreground">
                {/* Profile Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-12">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Avatar */}
                            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                                <AvatarImage
                                    src={user.avatar || undefined}
                                    alt={user.name}
                                />
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">
                                            {user.name}
                                        </h1>
                                        {user.email && isOwnProfile && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail className="h-4 w-4" />
                                                <span>{user.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {isOwnProfile ? (
                                            <Button asChild>
                                                <Link href="/settings/profile">
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Edit Profile
                                                </Link>
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleFollow}
                                                variant={
                                                    isFollowing
                                                        ? 'outline'
                                                        : 'default'
                                                }
                                            >
                                                {isFollowing ? (
                                                    <>
                                                        <UserCheck className="h-4 w-4 mr-2" />
                                                        Following
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Follow
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold">
                                            {user.documents_count}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Documents
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold">
                                            {user.followers_count}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Followers
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold">
                                            {user.following_count}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Following
                                        </div>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <div className="text-2xl font-bold flex items-center gap-2 justify-center sm:justify-start">
                                            <TrendingUp className="h-5 w-5 text-brand-500" />
                                            {user.total_score.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Total Score
                                        </div>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2">
                                    {user.leaderboard_position && (
                                        <Badge
                                            variant="secondary"
                                            className="gap-1.5"
                                        >
                                            <Award className="h-3.5 w-3.5" />
                                            Rank #{user.leaderboard_position}
                                        </Badge>
                                    )}
                                    {user.current_rank && (
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5"
                                        >
                                            <Award className="h-3.5 w-3.5" />
                                            Level {user.current_rank}
                                        </Badge>
                                    )}
                                    <Badge variant="outline" className="gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        Joined {formatDate(user.created_at)}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <div className="container mx-auto px-4 py-8">
                    {/* Tab Navigation */}
                    <div className="flex gap-2 mb-6 border-b pb-2">
                        <Button
                            variant={
                                activeTab === 'documents' ? 'default' : 'ghost'
                            }
                            onClick={() => setActiveTab('documents')}
                            className="gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Documents
                        </Button>
                        <Button
                            variant={
                                activeTab === 'activity' ? 'default' : 'ghost'
                            }
                            onClick={() => setActiveTab('activity')}
                            className="gap-2"
                        >
                            <BookOpen className="h-4 w-4" />
                            Activity
                        </Button>
                        {user.score_breakdown && (
                            <Button
                                variant={
                                    activeTab === 'stats' ? 'default' : 'ghost'
                                }
                                onClick={() => setActiveTab('stats')}
                                className="gap-2"
                            >
                                <TrendingUp className="h-4 w-4" />
                                Statistics
                            </Button>
                        )}
                    </div>

                    {/* Tab Content */}
                    <div>
                        {/* Documents Tab */}
                        {activeTab === 'documents' && (
                            documents.data.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                        {documents.data.map((doc) => (
                                            <Card
                                                key={doc.id}
                                                className="overflow-hidden hover:shadow-lg transition-shadow"
                                            >
                                                <Link
                                                    href={`/documents/${doc.slug}`}
                                                    className="block p-6"
                                                >
                                                    <div className="mb-3">
                                                        {doc.category && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="mb-2"
                                                            >
                                                                {
                                                                    doc.category
                                                                        .name
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                                                        {doc.title}
                                                    </h3>
                                                    {doc.description && (
                                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                                            {doc.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            {new Date(
                                                                doc.created_at,
                                                            ).toLocaleDateString()}
                                                        </span>
                                                        {doc.views_count >
                                                            0 && (
                                                            <span>
                                                                {doc.views_count}{' '}
                                                                views
                                                            </span>
                                                        )}
                                                    </div>
                                                </Link>
                                            </Card>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {documents.last_page > 1 && (
                                        <div className="flex justify-center gap-2">
                                            {documents.current_page > 1 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.get(
                                                            `/users/${user.id}`,
                                                            {
                                                                page:
                                                                    documents.current_page -
                                                                    1,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Previous
                                                </Button>
                                            )}
                                            <span className="flex items-center px-4">
                                                Page {documents.current_page} of{' '}
                                                {documents.last_page}
                                            </span>
                                            {documents.current_page <
                                                documents.last_page && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.get(
                                                            `/users/${user.id}`,
                                                            {
                                                                page:
                                                                    documents.current_page +
                                                                    1,
                                                            },
                                                        )
                                                    }
                                                >
                                                    Next
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Card className="p-12 text-center">
                                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        No documents yet
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {isOwnProfile
                                            ? "You haven't created any documents yet."
                                            : `${user.name} hasn't created any documents yet.`}
                                    </p>
                                </Card>
                            )
                        )}

                        {/* Activity Tab */}
                        {activeTab === 'activity' && (
                            activities.length > 0 ? (
                                <Card className="divide-y">
                                    {activities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="p-4 hover:bg-accent/50 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm mb-1">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            activity.created_at,
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </Card>
                            ) : (
                                <Card className="p-12 text-center">
                                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        No activity yet
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Recent activity will appear here.
                                    </p>
                                </Card>
                            )
                        )}

                        {/* Statistics Tab */}
                        {user.score_breakdown && activeTab === 'stats' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <FileText className="h-5 w-5 text-brand-500" />
                                            Documents Created
                                        </h3>
                                        <div className="text-4xl font-bold">
                                            {
                                                user.score_breakdown
                                                    .documents_created
                                            }
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5 text-brand-500" />
                                            Documents Reviewed
                                        </h3>
                                        <div className="text-4xl font-bold">
                                            {
                                                user.score_breakdown
                                                    .documents_reviewed
                                            }
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <TrendingUp className="h-5 w-5 text-brand-500" />
                                            Helpful Votes
                                        </h3>
                                        <div className="text-4xl font-bold">
                                            {user.score_breakdown.helpful_votes}
                                        </div>
                                    </Card>

                                    <Card className="p-6">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <Users className="h-5 w-5 text-brand-500" />
                                            Comments Made
                                        </h3>
                                        <div className="text-4xl font-bold">
                                            {user.score_breakdown.comments_made}
                                        </div>
                                    </Card>
                                </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
