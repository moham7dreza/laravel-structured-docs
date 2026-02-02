import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Award,
    TrendingUp,
    Users,
    Trophy,
    Medal,
    Crown,
    FileText,
    MessageSquare,
    ThumbsUp,
    CheckCircle,
    UserCircle,
} from 'lucide-react';
import type { SharedData } from '@/types';
import React, { useState } from 'react';

interface LeaderboardUser {
    position: number;
    id: number;
    name: string;
    avatar?: string;
    total_score: number;
    current_rank?: number;
    grade: string;
    score_breakdown: {
        documents_created: number;
        documents_reviewed: number;
        helpful_votes: number;
        comments_made: number;
    };
    documents_count: number;
}

interface LeaderboardProps {
    users: LeaderboardUser[];
    stats: {
        total_users: number;
        total_score: number;
        average_score: number;
        highest_score: number;
    };
    timeframe: string;
    currentUser?: {
        position: number;
        id: number;
        name: string;
        avatar?: string;
        total_score: number;
        current_rank?: number;
        grade: string;
    };
}

export default function Leaderboard({ users, stats, timeframe, currentUser }: LeaderboardProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'S':
                return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
            case 'A':
                return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
            case 'B':
                return 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white';
            case 'C':
                return 'bg-gradient-to-r from-purple-400 to-pink-500 text-white';
            case 'D':
                return 'bg-gradient-to-r from-gray-400 to-slate-500 text-white';
            default:
                return 'bg-gradient-to-r from-red-400 to-rose-500 text-white';
        }
    };

    const getPositionIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Crown className="h-6 w-6 text-yellow-500" />;
            case 2:
                return <Medal className="h-6 w-6 text-gray-400" />;
            case 3:
                return <Medal className="h-6 w-6 text-amber-600" />;
            default:
                return null;
        }
    };

    const handleTimeframeChange = (newTimeframe: string) => {
        setSelectedTimeframe(newTimeframe);
        router.get(
            '/leaderboard',
            { timeframe: newTimeframe },
            { preserveState: true },
        );
    };

    return (
        <>
            <Head title="Leaderboard - Top Contributors" />

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
                                    className="text-sm font-medium text-foreground"
                                >
                                    Leaderboard
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
                                <Trophy className="h-5 w-5" />
                                <span className="text-sm font-medium">Top Contributors</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Leaderboard
                            </h1>
                            <p className="text-xl text-brand-100 max-w-2xl mx-auto">
                                Celebrating our amazing community contributors who make this
                                platform better every day!
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <Users className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {stats.total_users.toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">Contributors</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {Math.round(stats.average_score).toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">Avg Score</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <Award className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {stats.highest_score.toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">Top Score</div>
                            </Card>
                            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
                                <Trophy className="h-6 w-6 mx-auto mb-2 text-brand-200" />
                                <div className="text-2xl font-bold">
                                    {stats.total_score.toLocaleString()}
                                </div>
                                <div className="text-sm text-brand-200">Total Points</div>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Filters */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Rankings</h2>
                        <div className="flex gap-2">
                            <Button
                                variant={selectedTimeframe === 'all' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleTimeframeChange('all')}
                            >
                                All Time
                            </Button>
                            <Button
                                variant={selectedTimeframe === 'month' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleTimeframeChange('month')}
                            >
                                This Month
                            </Button>
                            <Button
                                variant={selectedTimeframe === 'week' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => handleTimeframeChange('week')}
                            >
                                This Week
                            </Button>
                        </div>
                    </div>

                    {/* Current User Position (if logged in and not in top 10) */}
                    {currentUser && currentUser.position > 10 && (
                        <Card className="mb-6 p-4 bg-brand-50 dark:bg-brand-950 border-brand-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-2xl font-bold text-brand-600 min-w-[3rem]">
                                        #{currentUser.position}
                                    </div>
                                    <Link
                                        href={`/users/${currentUser.id}`}
                                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={currentUser.avatar} />
                                            <AvatarFallback className="bg-brand-500 text-white">
                                                {getInitials(currentUser.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-semibold">
                                                {currentUser.name} (You)
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge className={getGradeColor(currentUser.grade)}>
                                        Grade {currentUser.grade}
                                    </Badge>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-brand-600">
                                            {currentUser.total_score.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">points</div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Top 3 Podium */}
                    {users.length >= 3 && (
                        <div className="grid grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
                            {/* 2nd Place */}
                            <div className="pt-8">
                                <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                                    <div className="mb-4 flex justify-center">
                                        {getPositionIcon(2)}
                                    </div>
                                    <Link href={`/users/${users[1].id}`}>
                                        <Avatar className="h-20 w-20 mx-auto mb-3">
                                            <AvatarImage src={users[1].avatar} />
                                            <AvatarFallback className="text-xl bg-gray-400 text-white">
                                                {getInitials(users[1].name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <h3 className="font-bold text-lg mb-1">{users[1].name}</h3>
                                    <Badge className={getGradeColor(users[1].grade) + ' mb-2'}>
                                        {users[1].grade}
                                    </Badge>
                                    <div className="text-2xl font-bold text-brand-600">
                                        {users[1].total_score.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">points</div>
                                </Card>
                            </div>

                            {/* 1st Place */}
                            <div className="pt-0">
                                <Card className="p-6 text-center bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800 hover:shadow-2xl transition-shadow">
                                    <div className="mb-4 flex justify-center">
                                        {getPositionIcon(1)}
                                    </div>
                                    <Link href={`/users/${users[0].id}`}>
                                        <Avatar className="h-24 w-24 mx-auto mb-3 ring-4 ring-yellow-400">
                                            <AvatarImage src={users[0].avatar} />
                                            <AvatarFallback className="text-2xl bg-yellow-500 text-white">
                                                {getInitials(users[0].name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <h3 className="font-bold text-xl mb-1">{users[0].name}</h3>
                                    <Badge className={getGradeColor(users[0].grade) + ' mb-2'}>
                                        {users[0].grade}
                                    </Badge>
                                    <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {users[0].total_score.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">points</div>
                                </Card>
                            </div>

                            {/* 3rd Place */}
                            <div className="pt-12">
                                <Card className="p-6 text-center hover:shadow-xl transition-shadow">
                                    <div className="mb-4 flex justify-center">
                                        {getPositionIcon(3)}
                                    </div>
                                    <Link href={`/users/${users[2].id}`}>
                                        <Avatar className="h-18 w-18 mx-auto mb-3">
                                            <AvatarImage src={users[2].avatar} />
                                            <AvatarFallback className="text-lg bg-amber-600 text-white">
                                                {getInitials(users[2].name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <h3 className="font-bold mb-1">{users[2].name}</h3>
                                    <Badge className={getGradeColor(users[2].grade) + ' mb-2'}>
                                        {users[2].grade}
                                    </Badge>
                                    <div className="text-2xl font-bold text-brand-600">
                                        {users[2].total_score.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-muted-foreground">points</div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* Full Rankings Table */}
                    <Card className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="text-left p-4 font-semibold">Rank</th>
                                        <th className="text-left p-4 font-semibold">User</th>
                                        <th className="text-left p-4 font-semibold">Grade</th>
                                        <th className="text-right p-4 font-semibold">Score</th>
                                        <th className="text-center p-4 font-semibold hidden md:table-cell">
                                            Stats
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-accent/50 transition-colors ${
                                                currentUser?.id === user.id
                                                    ? 'bg-brand-50 dark:bg-brand-950'
                                                    : ''
                                            }`}
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    {getPositionIcon(user.position)}
                                                    <span className="text-lg font-bold min-w-[2rem]">
                                                        #{user.position}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <Link
                                                    href={`/users/${user.id}`}
                                                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                                                >
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={user.avatar} />
                                                        <AvatarFallback className="bg-brand-500 text-white">
                                                            {getInitials(user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {user.name}
                                                            {currentUser?.id === user.id && (
                                                                <span className="text-xs text-brand-600 ml-2">
                                                                    (You)
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {user.documents_count} documents
                                                        </div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={getGradeColor(user.grade)}>
                                                    {user.grade}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="text-xl font-bold text-brand-600">
                                                    {user.total_score.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    points
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell">
                                                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                                    <div
                                                        className="flex items-center gap-1"
                                                        title="Documents Created"
                                                    >
                                                        <FileText className="h-3.5 w-3.5" />
                                                        {user.score_breakdown.documents_created}
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1"
                                                        title="Documents Reviewed"
                                                    >
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        {user.score_breakdown.documents_reviewed}
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1"
                                                        title="Helpful Votes"
                                                    >
                                                        <ThumbsUp className="h-3.5 w-3.5" />
                                                        {user.score_breakdown.helpful_votes}
                                                    </div>
                                                    <div
                                                        className="flex items-center gap-1"
                                                        title="Comments Made"
                                                    >
                                                        <MessageSquare className="h-3.5 w-3.5" />
                                                        {user.score_breakdown.comments_made}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <Card className="p-12 text-center">
                            <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No rankings yet</h3>
                            <p className="text-muted-foreground mb-4">
                                Be the first to contribute and earn points!
                            </p>
                            <Button asChild>
                                <Link href="/documents">Browse Documents</Link>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
