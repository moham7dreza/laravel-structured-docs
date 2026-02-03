import { DocumentCard } from '@/components/document-card';
import { SearchBar } from '@/components/search-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, FileText, Grid3x3, List, SlidersHorizontal, X, UserCircle, Tag } from 'lucide-react';
import type { SharedData } from '@/types';
import React, { useState } from 'react';

interface TagShowProps {
    tag: {
        id: number;
        name: string;
        slug: string;
    };
    documents: {
        data: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: any[];
    filters: {
        search?: string;
        category?: string;
        sort?: string;
    };
}

export default function TagShow({ tag, documents, categories, filters }: TagShowProps) {
    const { auth } = usePage<SharedData>().props;
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(`/tags/${tag.slug}`, { ...filters, [key]: value }, { preserveState: true });
    };

    const clearFilter = (key: string) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        router.get(`/tags/${tag.slug}`, newFilters, { preserveState: true });
    };

    const clearAllFilters = () => {
        router.get(`/tags/${tag.slug}`, {}, { preserveState: true });
    };

    const hasActiveFilters = Object.keys(filters).some(
        (key) => key !== 'sort' && filters[key],
    );

    return (
        <>
            <Head title={`${tag.name} - Tags`} />

            {/* Navigation Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <FileText className="h-6 w-6" />
                            <span className="font-bold text-lg">DocSystem</span>
                        </Link>
                        <nav className="hidden md:flex gap-6">
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
                                className="text-sm font-medium text-foreground transition-colors"
                            >
                                Tags
                            </Link>
                            <Link
                                href="/leaderboard"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Leaderboard
                            </Link>
                            <Link
                                href="/activity"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Activity
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        {auth?.user ? (
                            <Link href={`/users/${auth.user.id}`}>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    {auth.user.avatar ? (
                                        <AvatarImage
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                        />
                                    ) : null}
                                    <AvatarFallback>
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

            {/* Main Content */}
            <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    {/* Breadcrumb */}
                    <Link
                        href="/tags"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to all tags
                    </Link>

                    {/* Tag Hero Card */}
                    <Card className="mb-12 p-8 md:p-12 bg-gradient-to-br from-card via-card/90 to-primary/5 backdrop-blur-sm border-2 shadow-2xl overflow-hidden relative">
                        {/* Decorative background */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                background: `radial-gradient(circle at top right, var(--primary) 0%, transparent 70%)`
                            }}
                        />

                        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-8">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-2xl transition-transform hover:scale-105 duration-300">
                                <Tag className="w-12 h-12 md:w-16 md:h-16 text-primary-foreground" />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-4xl md:text-5xl font-black text-primary">#</span>
                                    <h1 className="text-4xl md:text-5xl font-black leading-tight">{tag.name}</h1>
                                </div>
                                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                                    Explore all documentation tagged with <span className="font-semibold text-foreground">#{tag.name}</span>
                                </p>
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border shadow-sm">
                                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
                                        <span className="text-sm font-semibold">{documents.total} {documents.total === 1 ? 'Document' : 'Documents'}</span>
                                    </div>
                                    {categories.length > 0 && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-full border shadow-sm">
                                            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                            <span className="text-sm font-semibold text-muted-foreground">{categories.length} Categories</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Filters and Search Bar */}
                    <div className="mb-8 space-y-6">
                        {/* Search and View Toggle */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <SearchBar
                                    defaultValue={filters.search}
                                    onSearch={(value) => handleFilterChange('search', value)}
                                    placeholder={`Search in #${tag.name}...`}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={view === 'grid' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setView('grid')}
                                    className="flex-shrink-0"
                                >
                                    <Grid3x3 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={view === 'list' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setView('list')}
                                    className="flex-shrink-0"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Filter Pills */}
                        <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2">
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Sort */}
                                <Select
                                    value={filters.sort || 'latest'}
                                    onValueChange={(value) => handleFilterChange('sort', value)}
                                >
                                    <SelectTrigger className="w-[180px] bg-background/80">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="latest">📅 Latest</SelectItem>
                                        <SelectItem value="oldest">📅 Oldest</SelectItem>
                                        <SelectItem value="title">🔤 Title (A-Z)</SelectItem>
                                        <SelectItem value="popular">🔥 Most Popular</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Categories */}
                                {categories.length > 0 && (
                                    <>
                                        <div className="h-6 w-px bg-border"></div>
                                        <Select
                                            value={filters.category || 'all'}
                                            onValueChange={(value) => {
                                                if (value === 'all') {
                                                    clearFilter('category');
                                                } else {
                                                    handleFilterChange('category', value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-[200px] bg-background/80">
                                                <SelectValue placeholder="All categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All categories</SelectItem>
                                                {categories.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.slug}>
                                                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </>
                                )}

                                {/* Clear Filters */}
                                {hasActiveFilters && (
                                    <>
                                        <div className="h-6 w-px bg-border ml-auto"></div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearAllFilters}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <X className="w-4 h-4 mr-1" />
                                            Clear filters
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Documents Grid/List */}
                    {documents?.data && Array.isArray(documents.data) && documents.data.length > 0 ? (
                        <>
                            <div
                                className={cn(
                                    'mb-12',
                                    view === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'space-y-4',
                                )}
                            >
                                {documents.data.map((doc, index) => (
                                    <div
                                        key={doc.id}
                                        style={{
                                            animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                                        }}
                                    >
                                        <DocumentCard document={doc} />
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {documents.last_page > 1 && (
                                <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2">
                                    <div className="flex items-center justify-center gap-2">
                                        {documents.current_page > 1 && (
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    router.get(
                                                        `/tags/${tag.slug}`,
                                                        { ...filters, page: documents.current_page - 1 },
                                                        { preserveState: true },
                                                    )
                                                }
                                            >
                                                Previous
                                            </Button>
                                        )}
                                        <div className="flex items-center gap-2">
                                            {Array.from({ length: Math.min(5, documents.last_page) }, (_, i) => {
                                                const page = i + 1;
                                                return (
                                                    <Button
                                                        key={page}
                                                        variant={
                                                            documents.current_page === page
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        onClick={() =>
                                                            router.get(
                                                                `/tags/${tag.slug}`,
                                                                { ...filters, page },
                                                                { preserveState: true },
                                                            )
                                                        }
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        {documents.current_page < documents.last_page && (
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    router.get(
                                                        `/tags/${tag.slug}`,
                                                        { ...filters, page: documents.current_page + 1 },
                                                        { preserveState: true },
                                                    )
                                                }
                                            >
                                                Next
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Card className="p-16 text-center bg-gradient-to-br from-card to-muted/30 border-2 border-dashed">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-6 flex items-center justify-center">
                                <FileText className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">No Documents Found</h3>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto mb-6">
                                {hasActiveFilters
                                    ? 'Try adjusting your filters to find what you\'re looking for.'
                                    : `There are no documents tagged with #${tag.name} yet.`}
                            </p>
                            {hasActiveFilters && (
                                <Button onClick={clearAllFilters} variant="outline">
                                    Clear all filters
                                </Button>
                            )}
                        </Card>
                    )}
                </div>

                {/* CSS Animation */}
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}</style>
            </main>
        </>
    );
}
