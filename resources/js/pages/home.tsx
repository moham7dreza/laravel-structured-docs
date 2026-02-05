import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight, BookOpen, FileText, Sparkles, TrendingUp, Users,
    Star, Zap, Shield, Clock, Search, CheckCircle, Heart,
    Eye, GitBranch, Code2
} from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CategoryIcon } from '@/components/category-icon';
import { DocumentCard } from '@/components/document-card';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NotificationBell } from '@/components/notification-bell';
import { SearchBar } from '@/components/search-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { SharedData } from '@/types';

interface HomeProps {
    featuredDocuments: any[];
    recentDocuments: any[];
    popularCategories: any[];
    stats: {
        totalDocuments: number;
        totalUsers: number;
        totalViews: number;
    };
}

export default function Home({ featuredDocuments, recentDocuments, popularCategories, stats }: HomeProps) {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslation();

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <>
            <Head title="Home - Structured Documentation" />

            {/* Navigation Header */}
            <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-brand-500 blur-lg opacity-20 group-hover:opacity-30 transition-opacity rounded-full" />
                                    <BookOpen className="w-8 h-8 text-brand-600 relative" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                                    DocHub
                                </span>
                            </Link>
                            <div className="hidden md:flex items-center gap-1">
                                <Link
                                    href="/"
                                    className="px-3 py-2 text-sm font-medium text-foreground rounded-md bg-muted"
                                >
                                    {t('common.home')}
                                </Link>
                                <Link
                                    href="/documents"
                                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                >
                                    {t('common.documents')}
                                </Link>
                                <Link
                                    href="/categories"
                                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                >
                                    {t('common.categories')}
                                </Link>
                                <Link
                                    href="/tags"
                                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                >
                                    {t('common.tags')}
                                </Link>
                                <Link
                                    href="/leaderboard"
                                    className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                                >
                                    {t('common.leaderboard')}
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <LanguageSwitcher />
                            <ThemeToggle />
                            {auth.user && <NotificationBell />}
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
                                        <span className="sr-only">{t('page.viewProfile')}</span>
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/login">{t('common.login')}</Link>
                                    </Button>
                                    <Button size="sm" className="gradient-brand !text-white" asChild>
                                        <Link href="/register">{t('common.getStarted')}</Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="min-h-screen bg-background">
                {/* Hero Section with Animated Background */}
                <section className="relative overflow-hidden">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-purple-50 to-blue-50 dark:from-brand-950/20 dark:via-purple-950/20 dark:to-blue-950/20" />

                    {/* Animated blobs */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-brand-400/20 to-purple-400/20 blur-3xl animate-blob" />
                        <div className="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl animate-blob animation-delay-2000" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-400/10 to-pink-400/10 blur-3xl animate-blob animation-delay-4000" />
                    </div>

                    <div className="container relative mx-auto px-4 py-20 md:py-32">
                        <div className="max-w-5xl mx-auto">
                            {/* Floating badge */}
                            <div className="mb-8 flex justify-center animate-fade-in">
                                <Badge className="gap-2 px-4 py-2 bg-white dark:bg-gray-900 backdrop-blur-sm border-brand-300 dark:border-brand-700 shadow-lg shadow-brand-500/20 text-foreground">
                                    <Sparkles className="w-4 h-4 text-brand-600 animate-pulse" />
                                    <span className="text-sm font-medium text-foreground">{t('home.hero.badge', { count: formatNumber(stats.totalUsers) })}</span>
                                </Badge>
                            </div>

                            {/* Main heading */}
                            <div className="text-center mb-8 animate-fade-in animation-delay-200">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tight">
                                    <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-blue-600 bg-clip-text text-transparent inline-block">
                                        {t('home.hero.title')}
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        {t('home.hero.titleHighlight')}
                                    </span>
                                </h1>
                                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                                    {t('home.hero.description')}
                                    <span className="text-foreground font-medium"> {t('home.hero.descriptionHighlight')}</span>
                                </p>
                            </div>

                            {/* Search bar with glassmorphism */}
                            <div className="max-w-2xl mx-auto mb-12 animate-fade-in animation-delay-400">
                                <div className="relative">
                                    <SearchBar placeholder={t('home.hero.searchPlaceholder')} />
                                    <p className="text-center mt-3 text-sm text-muted-foreground">
                                        {t('home.hero.searchHint')}
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-4 justify-center mb-12 animate-fade-in animation-delay-600">
                                {auth.user ? (
                                    <>
                                        <Button size="lg" className="gradient-brand !text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all" asChild>
                                            <Link href="/documents/create">
                                                <FileText className="mr-2 w-5 h-5" />
                                                {t('home.hero.createDocument')}
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50" asChild>
                                            <Link href="/documents">
                                                <Search className="mr-2 w-5 h-5" />
                                                {t('home.hero.exploreDocuments')}
                                            </Link>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="lg" className="gradient-brand !text-white shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transition-all" asChild>
                                            <Link href="/register">
                                                <Sparkles className="mr-2 w-5 h-5" />
                                                {t('home.hero.getStartedFree')}
                                            </Link>
                                        </Button>
                                        <Button size="lg" variant="outline" className="backdrop-blur-sm bg-white/50 dark:bg-gray-900/50" asChild>
                                            <Link href="/documents">
                                                <BookOpen className="mr-2 w-5 h-5" />
                                                {t('home.hero.browseLibrary')}
                                            </Link>
                                        </Button>
                                    </>
                                )}
                            </div>

                            {/* Stats cards with glassmorphism */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-fade-in animation-delay-800">
                                <Card className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-white/20 dark:border-gray-800/20 shadow-xl p-6 text-center group hover:scale-105 transition-transform">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 mb-3 group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
                                        {formatNumber(stats.totalDocuments)}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">{t('home.stats.documents')}</div>
                                </Card>

                                <Card className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-white/20 dark:border-gray-800/20 shadow-xl p-6 text-center group hover:scale-105 transition-transform">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 mb-3 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                                        {formatNumber(stats.totalUsers)}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">{t('home.stats.contributors')}</div>
                                </Card>

                                <Card className="backdrop-blur-md bg-white/60 dark:bg-gray-900/60 border-white/20 dark:border-gray-800/20 shadow-xl p-6 text-center group hover:scale-105 transition-transform">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 mb-3 group-hover:scale-110 transition-transform">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl font-bold mb-1 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                                        {formatNumber(stats.totalViews)}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-medium">{t('home.stats.totalViews')}</div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Documents Section */}
                <section className="container mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <Badge className="mb-4">
                            <Star className="w-3 h-3 mr-1" />
                            {t('home.featured.badge')}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('home.featured.title')} <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">{t('home.featured.titleHighlight')}</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('home.featured.description')}
                        </p>
                    </div>

                    {featuredDocuments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredDocuments.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <DocumentCard document={doc} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <Card className="p-12 text-center">
                            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">{t('home.featured.empty')}</h3>
                            <p className="text-muted-foreground mb-6">{t('home.featured.emptyDescription')}</p>
                            <Button asChild>
                                <Link href="/documents/create">{t('home.featured.createDocument')}</Link>
                            </Button>
                        </Card>
                    )}

                    <div className="text-center mt-10">
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/documents">
                                {t('home.featured.viewAll')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Badge className="mb-4">
                                <BookOpen className="w-3 h-3 mr-1" />
                                {t('home.categories.badge')}
                            </Badge>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                {t('home.categories.title')} <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">{t('home.categories.titleHighlight')}</span>
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                {t('home.categories.description')}
                            </p>
                        </div>

                        {popularCategories.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                                {popularCategories.map((category, index) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="group animate-fade-in"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <Card className="relative overflow-hidden p-6 h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-brand-400 dark:hover:border-brand-600 bg-gradient-to-br from-card to-card/50">
                                            {/* Gradient overlay on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/0 to-purple-500/0 group-hover:from-brand-500/5 group-hover:to-purple-500/5 transition-all duration-300" />

                                            <div className="relative flex flex-col items-center text-center space-y-3">
                                                {/* Icon container with gradient background */}
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-brand-500/20">
                                                    <CategoryIcon
                                                        icon={category.icon}
                                                        className="w-8 h-8 text-brand-600 dark:text-brand-400"
                                                    />
                                                </div>

                                                {/* Category name */}
                                                <h3 className="font-bold text-sm leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                                    {category.name}
                                                </h3>

                                                {/* Document count badge */}
                                                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-muted/80 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/40 transition-colors">
                                                    {category.documents_count}
                                                </Badge>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>{t('home.categories.comingSoon')}</p>
                            </div>
                        )}

                        <div className="text-center mt-10">
                            <Button size="lg" variant="outline" asChild>
                                <Link href="/categories">
                                    {t('home.categories.viewAll')}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <Badge className="mb-4">
                            <Zap className="w-3 h-3 mr-1" />
                            {t('home.features.badge')}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            {t('home.features.title')} <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">{t('home.features.titleHighlight')}</span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            {t('home.features.description')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Feature cards */}
                        <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-brand-300 dark:hover:border-brand-700 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/30">
                                <BookOpen className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('home.features.structuredTemplates.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('home.features.structuredTemplates.description')}
                            </p>
                        </Card>

                        <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-purple-300 dark:hover:border-purple-700 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('home.features.teamCollaboration.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('home.features.teamCollaboration.description')}
                            </p>
                        </Card>

                        <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-blue-300 dark:hover:border-blue-700 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/30">
                                <GitBranch className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('home.features.versionControl.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('home.features.versionControl.description')}
                            </p>
                        </Card>

                        <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-green-300 dark:hover:border-green-700 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                                <Shield className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('home.features.qualityAssurance.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('home.features.qualityAssurance.description')}
                            </p>
                        </Card>

                        <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-orange-300 dark:hover:border-orange-700 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                                <Code2 className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('home.features.richTextEditor.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('home.features.richTextEditor.description')}
                            </p>
                        </Card>

                        <Card className="p-8 hover:shadow-xl transition-all hover:-translate-y-1 border-2 hover:border-pink-300 dark:hover:border-pink-700 group">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-pink-500/30">
                                <TrendingUp className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{t('home.features.analytics.title')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('home.features.analytics.description')}
                            </p>
                        </Card>
                    </div>
                </section>

                {/* Recent Updates */}
                {recentDocuments.length > 0 && (
                    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
                        <div className="container mx-auto px-4">
                            <div className="text-center mb-12">
                                <Badge className="mb-4">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {t('home.recentUpdates.badge')}
                                </Badge>
                                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                    {t('home.recentUpdates.title')} <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">{t('home.recentUpdates.titleHighlight')}</span>
                                </h2>
                                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                    {t('home.recentUpdates.description')}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {recentDocuments.slice(0, 8).map((doc, index) => (
                                    <div
                                        key={doc.id}
                                        className="animate-fade-in"
                                        style={{ animationDelay: `${index * 75}ms` }}
                                    >
                                        <DocumentCard document={doc} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="container mx-auto px-4 py-20">
                    <Card className="relative overflow-hidden border-0">
                        {/* Gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-purple-600 to-blue-600" />

                        {/* Pattern overlay */}
                        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />

                        {/* Content */}
                        <div className="relative p-12 md:p-16 text-center text-white">
                            <div className="max-w-3xl mx-auto">
                                <Badge className="mb-6 bg-white/20 border-white/20 text-white">
                                    <Heart className="w-3 h-3 mr-1" />
                                    {t('home.cta.badge')}
                                </Badge>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                                    {t('home.cta.title')}
                                </h2>
                                <p className="text-xl mb-10 text-white/90 leading-relaxed">
                                    {t('home.cta.description')}
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    {auth.user ? (
                                        <>
                                            <Button size="lg" className="bg-white text-brand-600 hover:bg-white/90 shadow-xl" asChild>
                                                <Link href="/documents/create">
                                                    <FileText className="mr-2 w-5 h-5" />
                                                    {t('home.cta.createFirstDoc')}
                                                </Link>
                                            </Button>
                                            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                                                <Link href="/dashboard">
                                                    {t('home.cta.goToDashboard')}
                                                    <ArrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="lg" className="bg-white text-brand-600 hover:bg-white/90 shadow-xl" asChild>
                                                <Link href="/register">
                                                    <Sparkles className="mr-2 w-5 h-5" />
                                                    {t('home.cta.startFreeToday')}
                                                </Link>
                                            </Button>
                                            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm" asChild>
                                                <Link href="/documents">
                                                    {t('home.cta.exploreLibrary')}
                                                    <ArrowRight className="ml-2 w-5 h-5" />
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {/* Trust indicators */}
                                <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>{t('home.cta.freeForever')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>{t('home.cta.noCreditCard')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>{t('home.cta.openSource')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </section>

                {/* Footer */}
                <footer className="border-t bg-muted/30 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <BookOpen className="w-6 h-6 text-brand-600" />
                                    <span className="text-lg font-bold">DocHub</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {t('home.footer.tagline')}
                                </p>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3">{t('home.footer.product')}</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/documents" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.documents')}</Link></li>
                                    <li><Link href="/categories" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.categories')}</Link></li>
                                    <li><Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.leaderboard')}</Link></li>
                                    <li><Link href="/activity" className="text-muted-foreground hover:text-foreground transition-colors">{t('home.footer.activityFeed')}</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3">{t('home.footer.community')}</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/tags" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.tags')}</Link></li>
                                    <li><Link href="/users" className="text-muted-foreground hover:text-foreground transition-colors">{t('home.footer.users')}</Link></li>
                                    <li><Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">{t('common.dashboard')}</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-3">{t('home.footer.resources')}</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('home.footer.about')}</a></li>
                                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('home.footer.blog')}</a></li>
                                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('home.footer.helpCenter')}</a></li>
                                    <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors">{t('home.footer.contact')}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-muted-foreground">
                                {t('home.footer.copyright')} <Heart className="w-4 h-4 inline text-red-500" /> {t('home.footer.forDocumentationLovers')}
                            </p>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                <a href="#" className="hover:text-foreground transition-colors">{t('home.footer.privacy')}</a>
                                <a href="#" className="hover:text-foreground transition-colors">{t('home.footer.terms')}</a>
                                <a href="#" className="hover:text-foreground transition-colors">{t('home.footer.license')}</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Add custom animations */}
            <style>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animation-delay-200 {
                    animation-delay: 0.2s;
                    opacity: 0;
                }

                .animation-delay-400 {
                    animation-delay: 0.4s;
                    opacity: 0;
                }

                .animation-delay-600 {
                    animation-delay: 0.6s;
                    opacity: 0;
                }

                .animation-delay-800 {
                    animation-delay: 0.8s;
                    opacity: 0;
                }

                .bg-grid-white\\/\\[0\\.05\\] {
                    background-image: linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px);
                }
            `}</style>
        </>
    );
}

function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
}
