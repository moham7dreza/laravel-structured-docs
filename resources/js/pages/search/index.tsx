import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Eye,
    FileText,
    Hash,
    Layers,
    MessageSquare,
    Search,
    TrendingUp,
    User,
    UserCircle,
    X,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { SharedData } from '@/types';

interface SearchResult {
    type: 'document' | 'user' | 'category' | 'tag';
    id: number;
    // Document fields
    title?: string;
    slug?: string;
    description?: string;
    thumbnail?: string;
    status?: string;
    score?: number;
    views_count?: number;
    comments_count?: number;
    category?: {
        id: number;
        name: string;
        slug: string;
        icon?: string;
        color?: string;
    };
    owner?: {
        id: number;
        name: string;
        avatar?: string;
    };
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    // User fields
    name?: string;
    email?: string;
    avatar?: string;
    bio?: string;
    role?: string;
    total_score?: number;
    current_rank?: string;
    documents_count?: number;
    // Category/Tag fields
    icon?: string;
    color?: string;
}

interface SearchPageProps {
    query: string;
    type: string;
    results: SearchResult[];
    stats: {
        total: number;
        documents: number;
        users: number;
        categories: number;
        tags: number;
    };
    filters: {
        category?: string;
        tag?: string;
        status?: string;
        sort: string;
    };
    categories: Array<{ id: number; name: string; slug: string }>;
    tags: Array<{ id: number; name: string; slug: string }>;
}

export default function SearchPage({
    query,
    type,
    results,
    stats,
    filters,
    categories,
    tags,
}: SearchPageProps) {
    const { auth } = usePage<SharedData>().props;
    const [searchQuery, setSearchQuery] = useState(query);
    const [selectedType, setSelectedType] = useState(type);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/search', { q: searchQuery, type: selectedType }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/search',
            {
                q: query,
                type: selectedType,
                ...filters,
                [key]: value || undefined,
            },
            { preserveState: true }
        );
    };

    const clearFilter = (key: string) => {
        const newFilters = { ...filters };
        delete newFilters[key as keyof typeof filters];
        router.get(
            '/search',
            {
                q: query,
                type: selectedType,
                ...newFilters,
            },
            { preserveState: true }
        );
    };

    const getTypeIcon = (itemType: string) => {
        switch (itemType) {
            case 'document':
                return <FileText className="w-5 h-5" />;
            case 'user':
                return <User className="w-5 h-5" />;
            case 'category':
                return <Layers className="w-5 h-5" />;
            case 'tag':
                return <Hash className="w-5 h-5" />;
            default:
                return <Search className="w-5 h-5" />;
        }
    };

    return (
        <>
            <Head title={query ? `Search: ${query}` : 'Search'} />

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
                        <LanguageSwitcher />
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
                {/* Search Hero */}
                <div className="border-b bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 text-white">
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                                    <Search className="h-5 w-5" />
                                    <span className="text-sm font-medium">Search</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                    Find what you're looking for
                                </h1>
                                <p className="text-xl text-brand-100">
                                    Search documents, users, categories, and tags
                                </p>
                            </div>

                            {/* Search Form */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="relative group max-w-4xl mx-auto">
                                    {/* Gradient glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/10 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>

                                    <div className="relative flex gap-3 bg-white/10 backdrop-blur-md rounded-xl p-2 border border-white/20">
                                        {/* Search Icon */}
                                        <div className="absolute ltr:left-5 rtl:right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <Search className="h-6 w-6 text-white/60 group-focus-within:text-white transition-colors" />
                                        </div>

                                        {/* Input Field */}
                                        <Input
                                            type="text"
                                            placeholder="Search for documents, users, categories, and more..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="flex-1 h-14 ltr:pl-14 rtl:pr-14 ltr:pr-4 rtl:pl-4 text-base bg-transparent border-0 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                                        />

                                        {/* Search Button */}
                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="h-14 px-8 bg-white text-brand-700 hover:bg-white/90 font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                        >
                                            <Search className="w-5 h-5" />
                                            Search
                                        </Button>
                                    </div>
                                </div>
                            </form>

                            {/* Type Filters */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {[
                                    { value: 'all', label: 'All', count: stats.total },
                                    { value: 'documents', label: 'Documents', count: stats.documents },
                                    { value: 'users', label: 'Users', count: stats.users },
                                    { value: 'categories', label: 'Categories', count: stats.categories },
                                    { value: 'tags', label: 'Tags', count: stats.tags },
                                ].map((filter) => (
                                    <button
                                        key={filter.value}
                                        onClick={() => {
                                            setSelectedType(filter.value);
                                            if (query) {
                                                router.get(
                                                    '/search',
                                                    { q: query, type: filter.value },
                                                    { preserveState: true }
                                                );
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                            selectedType === filter.value
                                                ? 'bg-white text-brand-700 shadow-lg'
                                                : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        {filter.label}
                                        {filter.count > 0 && (
                                            <span className="ml-1.5 opacity-75">({filter.count})</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {query ? (
                        <>
                            {/* Advanced Filters */}
                            {selectedType === 'documents' && (
                                <Card className="p-4 mb-6">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="flex-1 min-w-[200px]">
                                            <label className="text-sm font-medium mb-2 block">
                                                Category
                                            </label>
                                            <Select
                                                value={filters.category || ''}
                                                onValueChange={(value) =>
                                                    handleFilterChange('category', value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All categories" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All categories</SelectItem>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.slug}>
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="text-sm font-medium mb-2 block">
                                                Tag
                                            </label>
                                            <Select
                                                value={filters.tag || ''}
                                                onValueChange={(value) =>
                                                    handleFilterChange('tag', value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="All tags" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">All tags</SelectItem>
                                                    {tags.map((tag) => (
                                                        <SelectItem key={tag.id} value={tag.slug}>
                                                            #{tag.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex-1 min-w-[200px]">
                                            <label className="text-sm font-medium mb-2 block">
                                                Sort by
                                            </label>
                                            <Select
                                                value={filters.sort}
                                                onValueChange={(value) =>
                                                    handleFilterChange('sort', value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="relevance">Relevance</SelectItem>
                                                    <SelectItem value="latest">Latest</SelectItem>
                                                    <SelectItem value="popular">Most Popular</SelectItem>
                                                    <SelectItem value="score">Highest Score</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Active Filters */}
                                    {(filters.category || filters.tag) && (
                                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                                            <span className="text-sm text-muted-foreground">
                                                Active filters:
                                            </span>
                                            {filters.category && (
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1 cursor-pointer"
                                                    onClick={() => clearFilter('category')}
                                                >
                                                    Category:{' '}
                                                    {
                                                        categories.find(
                                                            (c) => c.slug === filters.category
                                                        )?.name
                                                    }
                                                    <X className="w-3 h-3" />
                                                </Badge>
                                            )}
                                            {filters.tag && (
                                                <Badge
                                                    variant="secondary"
                                                    className="gap-1 cursor-pointer"
                                                    onClick={() => clearFilter('tag')}
                                                >
                                                    Tag: {tags.find((t) => t.slug === filters.tag)?.name}
                                                    <X className="w-3 h-3" />
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Results */}
                            {results.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold">
                                            {stats.total} {stats.total === 1 ? 'result' : 'results'} for "
                                            {query}"
                                        </h2>
                                    </div>

                                    {results.map((result) => (
                                        <Card
                                            key={`${result.type}-${result.id}`}
                                            className="p-6 hover:shadow-lg transition-shadow"
                                        >
                                            {result.type === 'document' && (
                                                <Link
                                                    href={`/documents/${result.slug}`}
                                                    className="block group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                                                            {getTypeIcon(result.type)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                                {result.title}
                                                            </h3>
                                                            {result.description && (
                                                                <p className="text-muted-foreground mb-3 line-clamp-2">
                                                                    {result.description}
                                                                </p>
                                                            )}
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                                {result.category && (
                                                                    <span className="flex items-center gap-1">
                                                                        <Layers className="w-4 h-4" />
                                                                        {result.category.name}
                                                                    </span>
                                                                )}
                                                                {result.owner && (
                                                                    <span className="flex items-center gap-1">
                                                                        <User className="w-4 h-4" />
                                                                        {result.owner.name}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1">
                                                                    <Eye className="w-4 h-4" />
                                                                    {(result.views_count || 0).toLocaleString()}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <MessageSquare className="w-4 h-4" />
                                                                    {result.comments_count || 0}
                                                                </span>
                                                            </div>
                                                            {result.tags && result.tags.length > 0 && (
                                                                <div className="flex flex-wrap gap-2 mt-3">
                                                                    {result.tags.map((tag) => (
                                                                        <Badge
                                                                            key={tag.id}
                                                                            variant="secondary"
                                                                        >
                                                                            #{tag.name}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                </Link>
                                            )}

                                            {result.type === 'user' && (
                                                <Link
                                                    href={`/users/${result.id}`}
                                                    className="block group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={result.avatar} />
                                                            <AvatarFallback className="bg-blue-500 text-white">
                                                                {result.name &&
                                                                    getInitials(result.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                                                {result.name}
                                                            </h3>
                                                            {result.bio && (
                                                                <p className="text-muted-foreground mb-2 line-clamp-1">
                                                                    {result.bio}
                                                                </p>
                                                            )}
                                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1">
                                                                    <FileText className="w-4 h-4" />
                                                                    {result.documents_count || 0} documents
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <TrendingUp className="w-4 h-4" />
                                                                    {result.total_score || 0} points
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                </Link>
                                            )}

                                            {result.type === 'category' && (
                                                <Link
                                                    href={`/categories/${result.slug}`}
                                                    className="block group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div
                                                            className="p-3 rounded-lg text-white"
                                                            style={{
                                                                backgroundColor: result.color || '#6366f1',
                                                            }}
                                                        >
                                                            <Layers className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                                                {result.name}
                                                            </h3>
                                                            {result.description && (
                                                                <p className="text-muted-foreground mb-2">
                                                                    {result.description}
                                                                </p>
                                                            )}
                                                            <span className="text-sm text-muted-foreground">
                                                                {result.documents_count || 0} documents
                                                            </span>
                                                        </div>
                                                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                </Link>
                                            )}

                                            {result.type === 'tag' && (
                                                <Link
                                                    href={`/tags/${result.slug}`}
                                                    className="block group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                                            <Hash className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">
                                                                #{result.name}
                                                            </h3>
                                                            <span className="text-sm text-muted-foreground">
                                                                {result.documents_count || 0} documents
                                                            </span>
                                                        </div>
                                                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                    </div>
                                                </Link>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                        <Search className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                    <p className="text-muted-foreground mb-6">
                                        We couldn't find anything matching "{query}". Try different
                                        keywords or filters.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedType('all');
                                        }}
                                    >
                                        Clear search
                                    </Button>
                                </Card>
                            )}
                        </>
                    ) : (
                        <Card className="p-12 text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 mb-4">
                                <Search className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Start searching</h3>
                            <p className="text-muted-foreground">
                                Enter a search term to find documents, users, categories, and tags.
                            </p>
                        </Card>
                    )}
                </div>
            </main>
        </>
    );
}
