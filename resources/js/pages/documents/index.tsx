import { CategoryBadge } from '@/components/category-badge';
import { DocumentCard } from '@/components/document-card';
import { SearchBar } from '@/components/search-bar';
import { ThemeToggle } from '@/components/theme-toggle';
import { NotificationBell } from '@/components/notification-bell';
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
import { Grid3x3, List, SlidersHorizontal, X, UserCircle, Plus } from 'lucide-react';
import type { SharedData } from '@/types';
import React, { useState } from 'react';

interface DocumentsListProps {
    documents: {
        data: any[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: any[];
    tags: any[];
    filters: {
        search?: string;
        category?: string;
        tag?: string;
        status?: string;
        sort?: string;
    };
}

export default function DocumentsList({ documents, categories, tags, filters }: DocumentsListProps) {
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
        router.get('/documents', {
            ...filters,
            [key]: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilter = (key: string) => {
        const newFilters = { ...filters };
        delete newFilters[key];
        router.get('/documents', newFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearAllFilters = () => {
        router.get('/documents', {
            sort: filters.sort || 'latest', // Keep sort
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasActiveFilters = Object.keys(filters).some(
        (key) => key !== 'sort' && filters[key],
    );

    return (
        <>
            <Head title="Documents" />

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
                                    className="text-sm font-medium text-foreground"
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
                                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Activity
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                            {auth?.user && <NotificationBell />}
                            {auth?.user ? (
                                <Button variant="ghost" size="icon" asChild>
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
                {/* Header */}
                <div className="border-b bg-card">
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-4xl font-bold mb-2">Documentation</h1>
                                <p className="text-muted-foreground text-lg">
                                    Browse {documents.total.toLocaleString()} documents
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {auth?.user && (
                                    <Button asChild>
                                        <Link href="/documents/create" className="flex items-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Create Document
                                        </Link>
                                    </Button>
                                )}
                                <Button
                                    variant={view === 'grid' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setView('grid')}
                                >
                                    <Grid3x3 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={view === 'list' ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => setView('list')}
                                >
                                    <List className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <SearchBar
                            defaultValue={filters.search}
                            onSearch={(query) => handleFilterChange('search', query)}
                        />
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-6">
                        {/* Sidebar Filters - Desktop */}
                        <aside className="hidden lg:block w-64 flex-shrink-0">
                            <Card className="p-6 sticky top-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold">Filters</h3>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearAllFilters}
                                            className="h-auto py-1 px-2"
                                        >
                                            Clear all
                                        </Button>
                                    )}
                                </div>

                                {/* Category Filter */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">
                                        Category
                                    </label>
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
                                        <SelectTrigger>
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All categories</SelectItem>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.slug}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Status Filter */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">Status</label>
                                    <Select
                                        value={filters.status || 'all'}
                                        onValueChange={(value) => {
                                            if (value === 'all') {
                                                clearFilter('status');
                                            } else {
                                                handleFilterChange('status', value);
                                            }
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All statuses</SelectItem>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="pending_review">
                                                Pending Review
                                            </SelectItem>
                                            <SelectItem value="published">Published</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="stale">Stale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Sort */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">Sort by</label>
                                    <Select
                                        value={filters.sort || 'latest'}
                                        onValueChange={(value) => handleFilterChange('sort', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="latest">Latest</SelectItem>
                                            <SelectItem value="oldest">Oldest</SelectItem>
                                            <SelectItem value="title">Title (A-Z)</SelectItem>
                                            <SelectItem value="popular">Most Popular</SelectItem>
                                            <SelectItem value="score">Highest Score</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Popular Tags */}
                                {tags.length > 0 && (
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Popular Tags
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.slice(0, 10).map((tag) => (
                                                <Link key={tag.id} href={`/tags/${tag.slug}`}>
                                                    <Badge
                                                        variant="outline"
                                                        className="cursor-pointer hover:bg-accent transition-colors"
                                                    >
                                                        {tag.name}
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile Filter Button */}
                            <div className="lg:hidden mb-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="w-full"
                                >
                                    <SlidersHorizontal className="mr-2 w-4 h-4" />
                                    Filters
                                    {hasActiveFilters && (
                                        <Badge variant="default" className="ml-2">
                                            {Object.keys(filters).filter((k) => k !== 'sort').length}
                                        </Badge>
                                    )}
                                </Button>
                            </div>

                            {/* Active Filters */}
                            {hasActiveFilters && (
                                <div className="mb-6 flex flex-wrap gap-2">
                                    {filters.search && (
                                        <Badge variant="secondary" className="gap-1">
                                            Search: {filters.search}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={() => clearFilter('search')}
                                            />
                                        </Badge>
                                    )}
                                    {filters.category && (
                                        <Badge variant="secondary" className="gap-1">
                                            Category: {filters.category}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={() => clearFilter('category')}
                                            />
                                        </Badge>
                                    )}
                                    {filters.status && (
                                        <Badge variant="secondary" className="gap-1">
                                            Status: {filters.status}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={() => clearFilter('status')}
                                            />
                                        </Badge>
                                    )}
                                    {filters.tag && (
                                        <Badge variant="secondary" className="gap-1">
                                            Tag: {filters.tag}
                                            <X
                                                className="w-3 h-3 cursor-pointer"
                                                onClick={() => clearFilter('tag')}
                                            />
                                        </Badge>
                                    )}
                                </div>
                            )}

                            {/* Results Count */}
                            <div className="mb-4 text-sm text-muted-foreground">
                                Showing {documents.data.length} of {documents.total.toLocaleString()}{' '}
                                documents
                            </div>

                            {/* Documents Grid/List */}
                            {documents.data.length > 0 ? (
                                <>
                                    <div
                                        className={cn(
                                            'mb-8',
                                            view === 'grid'
                                                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                                                : 'space-y-4',
                                        )}
                                    >
                                        {documents.data.map((doc) => (
                                            <DocumentCard key={doc.id} document={doc} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {documents.last_page > 1 && (
                                        <div className="flex justify-center gap-2">
                                            {documents.current_page > 1 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.get('/documents', {
                                                            ...filters,
                                                            page: documents.current_page - 1,
                                                        })
                                                    }
                                                >
                                                    Previous
                                                </Button>
                                            )}

                                            <div className="flex items-center gap-2">
                                                {Array.from({ length: documents.last_page }).map(
                                                    (_, i) => {
                                                        const page = i + 1;
                                                        if (
                                                            page === 1 ||
                                                            page === documents.last_page ||
                                                            Math.abs(page - documents.current_page) <= 2
                                                        ) {
                                                            return (
                                                                <Button
                                                                    key={page}
                                                                    variant={
                                                                        page === documents.current_page
                                                                            ? 'default'
                                                                            : 'outline'
                                                                    }
                                                                    onClick={() =>
                                                                        router.get('/documents', {
                                                                            ...filters,
                                                                            page,
                                                                        })
                                                                    }
                                                                >
                                                                    {page}
                                                                </Button>
                                                            );
                                                        } else if (
                                                            page === documents.current_page - 3 ||
                                                            page === documents.current_page + 3
                                                        ) {
                                                            return <span key={page}>...</span>;
                                                        }
                                                        return null;
                                                    },
                                                )}
                                            </div>

                                            {documents.current_page < documents.last_page && (
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        router.get('/documents', {
                                                            ...filters,
                                                            page: documents.current_page + 1,
                                                        })
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
                                    <div className="text-6xl mb-4">📄</div>
                                    <h3 className="text-xl font-semibold mb-2">No documents found</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Try adjusting your filters or search query
                                    </p>
                                    {hasActiveFilters && (
                                        <Button onClick={clearAllFilters}>Clear all filters</Button>
                                    )}
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
