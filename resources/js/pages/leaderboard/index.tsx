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
    Star,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { SharedData } from '@/types';
import {useTranslation} from "react-i18next";
import {LanguageSwitcher} from "@/components/language-switcher";

interface Badge {
    name: string;
    icon: string;
    color: string;
}

interface ScoreBreakdownItem {
    value: number;
    points: number;
    label: string;
}

interface LeaderboardUser {
    position: number;
    id: number;
    name: string;
    avatar?: string;
    total_score: number;
    current_rank?: number;
    grade: string;
    badges: Badge[];
    score_breakdown: {
        documents_created: ScoreBreakdownItem;
        documents_reviewed: ScoreBreakdownItem;
        helpful_votes: ScoreBreakdownItem;
        comments_made: ScoreBreakdownItem;
    };
    documents_count: number;
    followers_count: number;
    level: number;
    next_level_score: number;
    progress_to_next_level: number;
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
    currentUser?: LeaderboardUser;
}

export default function Leaderboard({ users, stats, timeframe, currentUser }: LeaderboardProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();
    const [activeTimeframe, setActiveTimeframe] = useState(timeframe);

    const handleTimeframeChange = (newTimeframe: string) => {
        setActiveTimeframe(newTimeframe);
        router.get('/leaderboard', { timeframe: newTimeframe }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const getPositionIcon = (position: number) => {
        switch (position) {
            case 1:
                return <Crown className="w-6 h-6 text-yellow-500" />;
            case 2:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 3:
                return <Medal className="w-6 h-6 text-amber-600" />;
            default:
                return <span className="text-2xl font-bold text-muted-foreground">#{position}</span>;
        }
    };

    const getGradeColor = (grade: string) => {
        switch (grade) {
            case 'S': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
            case 'A': return 'bg-gradient-to-r from-blue-500 to-purple-500 text-white';
            case 'B': return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
            case 'C': return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
            case 'D': return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
            default: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
        }
    };

    const getBadgeColor = (color: string) => {
        switch (color) {
            case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200';
            case 'blue': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200';
            case 'purple': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200';
            case 'green': return 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200';
            case 'pink': return 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900 dark:text-pink-200';
            case 'orange': return 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900 dark:text-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <>
            <Head title="Leaderboard" />

            <div className="min-h-screen bg-background">
                {/* Navigation */}
                <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container mx-auto px-4">
                        <div className="flex h-16 items-center">
                            <div className="flex items-center gap-6">
                                <Link href="/" className="text-xl font-bold">
                                    📚 {t('nav.docs')}
                                </Link>
                                <div className="hidden md:flex items-center gap-4">
                                    <Link
                                        href="/"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t('common.home')}
                                    </Link>
                                    <Link
                                        href="/documents"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t('common.documents')}
                                    </Link>
                                    <Link
                                        href="/leaderboard"
                                        className="text-sm font-medium text-foreground transition-colors"
                                    >
                                        {t('common.leaderboard')}
                                    </Link>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center gap-2">
                                <LanguageSwitcher />
                                <ThemeToggle />
                                {auth?.user && (
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/dashboard">{t('common.dashboard')}</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="border-b bg-gradient-to-br from-brand-50 via-background to-accent-50 dark:from-brand-950 dark:via-background dark:to-accent-950">
                    <div className="container mx-auto px-4 py-12">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="flex justify-center mb-4">
                                <Trophy className="w-16 h-16 text-brand-600" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
                                {t('common.leaderboard')}
                            </h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                {t('leaderboard.description')}
                            </p>

                            {/* Timeframe Filters */}
                            <div className="flex justify-center gap-2 mb-8">
                                <Button
                                    variant={activeTimeframe === 'all' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleTimeframeChange('all')}
                                >
                                    {t('leaderboard.allTime')}
                                </Button>
                                <Button
                                    variant={activeTimeframe === 'year' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleTimeframeChange('year')}
                                >
                                    {t('leaderboard.thisYear')}
                                </Button>
                                <Button
                                    variant={activeTimeframe === 'month' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleTimeframeChange('month')}
                                >
                                    {t('leaderboard.thisMonth')}
                                </Button>
                                <Button
                                    variant={activeTimeframe === 'week' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => handleTimeframeChange('week')}
                                >
                                    {t('leaderboard.thisWeek')}
                                </Button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card className="p-4 bg-card/50 backdrop-blur">
                                    <Users className="w-6 h-6 text-brand-600 mb-2 mx-auto" />
                                    <div className="text-2xl font-bold">{stats.total_users}</div>
                                    <div className="text-sm text-muted-foreground">{t('leaderboard.contributors')}</div>
                                </Card>
                                <Card className="p-4 bg-card/50 backdrop-blur">
                                    <TrendingUp className="w-6 h-6 text-green-600 mb-2 mx-auto" />
                                    <div className="text-2xl font-bold">{Math.round(stats.average_score)}</div>
                                    <div className="text-sm text-muted-foreground">{t('leaderboard.avgScore')}</div>
                                </Card>
                                <Card className="p-4 bg-card/50 backdrop-blur">
                                    <Trophy className="w-6 h-6 text-yellow-600 mb-2 mx-auto" />
                                    <div className="text-2xl font-bold">{stats.highest_score}</div>
                                    <div className="text-sm text-muted-foreground">{t('leaderboard.topScore')}</div>
                                </Card>
                                <Card className="p-4 bg-card/50 backdrop-blur">
                                    <Award className="w-6 h-6 text-purple-600 mb-2 mx-auto" />
                                    <div className="text-2xl font-bold">{stats.total_score.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">{t('leaderboard.totalPoints')}</div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-8">
                    {/* Current User Card */}
                    {currentUser && (
                        <Card className="mb-8 p-6 bg-gradient-to-r from-brand-50 to-accent-50 dark:from-brand-950 dark:to-accent-950 border-2 border-brand-200 dark:border-brand-800">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900">
                                    {getPositionIcon(currentUser.position)}
                                </div>
                                <Avatar className="h-16 w-16 border-4 border-background">
                                    <AvatarImage src={currentUser.avatar || undefined} alt={currentUser.name} />
                                    <AvatarFallback className="text-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                                        {getInitials(currentUser.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-xl font-bold">{currentUser.name}</h3>
                                        <Badge className={`${getGradeColor(currentUser.grade)} font-bold`}>
                                            {currentUser.grade}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Your Position: #{currentUser.position} • Level {currentUser.level}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500" />
                                            {currentUser.total_score} points
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FileText className="w-4 h-4 text-blue-500" />
                                            {currentUser.documents_count} docs
                                        </span>
                                    </div>
                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span>Progress to Level {currentUser.level + 1}</span>
                                            <span className="font-semibold">{currentUser.progress_to_next_level}%</span>
                                        </div>
                                        <Progress value={currentUser.progress_to_next_level} className="h-2" />
                                    </div>
                                </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-brand-600">{currentUser.total_score}</div>
                                                <div className="text-sm text-muted-foreground">{t('leaderboard.totalPoints')}</div>
                                            </div>
                            </div>
                        </Card>
                    )}

                    {/* Leaderboard List */}
                    <div className="space-y-4">
                        {users.map((user) => (
                            <Card key={user.id} className={`p-6 hover:shadow-lg transition-all ${user.position <= 3 ? 'border-2 border-yellow-400 dark:border-yellow-600' : ''}`}>
                                <div className="flex items-start gap-4">
                                    {/* Position */}
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                                        {getPositionIcon(user.position)}
                                    </div>

                                    {/* Avatar */}
                                    <Avatar className="h-16 w-16 border-4 border-background">
                                        <AvatarImage src={user.avatar || undefined} alt={user.name} />
                                        <AvatarFallback className="text-lg bg-gradient-to-br from-brand-500 to-brand-600 text-white">
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* User Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Link
                                                        href={`/users/${user.id}`}
                                                        className="text-xl font-bold hover:text-brand-600 transition-colors"
                                                    >
                                                        {user.name}
                                                    </Link>
                                                    <Badge className={`${getGradeColor(user.grade)} font-bold`}>
                                                        {user.grade}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                                    <span className="flex items-center gap-1">
                                                        <Zap className="w-4 h-4 text-yellow-500" />
                                                        Level {user.level}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{user.total_score} points</span>
                                                </div>
                                                {/* Badges */}
                                                {user.badges.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {user.badges.map((badge, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                                className={`${getBadgeColor(badge.color)} text-xs`}
                                                            >
                                                                <span className="mr-1">{badge.icon}</span>
                                                                {badge.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold text-brand-600">{user.total_score}</div>
                                                <div className="text-sm text-muted-foreground">Points</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-3">
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                                <span>{t('leaderboard.levelProgress', { level: user.level })}</span>
                                                <span>{user.progress_to_next_level}%</span>
                                            </div>
                                            <Progress value={user.progress_to_next_level} className="h-1.5" />
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                                <div>
                                                    <div className="text-sm font-semibold">{user.score_breakdown.documents_created.value}</div>
                                                    <div className="text-xs text-muted-foreground">{t('leaderboard.documents')}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <div>
                                                    <div className="text-sm font-semibold">{user.score_breakdown.documents_reviewed.value}</div>
                                                    <div className="text-xs text-muted-foreground">{t('leaderboard.reviews')}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                                <ThumbsUp className="w-4 h-4 text-purple-500" />
                                                <div>
                                                    <div className="text-sm font-semibold">{user.score_breakdown.helpful_votes.value}</div>
                                                    <div className="text-xs text-muted-foreground">{t('leaderboard.helpful')}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                                                <MessageSquare className="w-4 h-4 text-orange-500" />
                                                <div>
                                                    <div className="text-sm font-semibold">{user.score_breakdown.comments_made.value}</div>
                                                    <div className="text-xs text-muted-foreground">{t('common.comments')}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Score Breakdown Details */}
                                        <details className="mt-3">
                                            <summary className="cursor-pointer text-sm text-brand-600 hover:text-brand-700 font-medium">
                                                {t('leaderboard.viewBreakdown')}
                                            </summary>
                                            <div className="mt-2 p-3 rounded-lg bg-muted/30 space-y-2">
                                                {Object.entries(user.score_breakdown).map(([key, item]) => (
                                                    <div key={key} className="flex justify-between items-center text-sm">
                                                        <span className="text-muted-foreground">{item.label}:</span>
                                                        <span className="font-semibold">
                                                            {item.value} × {item.points / item.value || 0} = {item.points} pts
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="pt-2 border-t border-border flex justify-between items-center font-bold">
                                                    <span>{t('leaderboard.total')}:</span>
                                                    <span className="text-brand-600">{user.total_score} {t('leaderboard.points')}</span>
                                                </div>
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {users.length === 0 && (
                        <Card className="p-12 text-center">
                            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{t('leaderboard.noRankings')}</h3>
                            <p className="text-muted-foreground mb-4">
                                {t('leaderboard.beFirst')}
                            </p>
                            <Button asChild>
                                <Link href="/documents/create">{t('common.createDocument')}</Link>
                            </Button>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
