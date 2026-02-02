import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, UserCircle } from 'lucide-react';
import type { SharedData } from '@/types';
import React from 'react';

interface CategoriesIndexProps {
    categories: Array<{
        id: number;
        name: string;
        slug: string;
        description: string | null;
        icon: string | null;
        color: string | null;
        documents_count: number;
    }>;
}

export default function CategoriesIndex({ categories }: CategoriesIndexProps) {
    const { auth } = usePage<SharedData>().props;

    // Debug logging
    React.useEffect(() => {
        console.log('=== Categories Page Debug ===');
        console.log('Categories prop:', categories);
        console.log('Categories count:', categories?.length);
        console.log('First category:', categories?.[0]);
    }, [categories]);

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
            <Head title="Categories" />

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
                                href="/documents"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Documents
                            </Link>
                            <Link
                                href="/categories"
                                className="text-sm font-medium text-foreground transition-colors"
                            >
                                Categories
                            </Link>
                            <Link
                                href="/tags"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
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
                <div className="container mx-auto px-4 py-16 max-w-7xl">
                    {/* Page Header - Centered */}
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-lg">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            <span>Documentation Categories</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                Explore by
                            </span>
                            <br />
                            <span className="text-foreground">Category</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                            Browse our comprehensive documentation library organized into {categories?.length || 0} curated categories.
                            Find exactly what you're looking for.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-md border">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
                                <span className="font-medium text-foreground">{categories?.length || 0} Active Categories</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-md border">
                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="font-medium text-muted-foreground">Comprehensive Guides</span>
                            </div>
                        </div>
                    </div>

                    {/* Categories Grid - Centered */}
                    {categories && categories.length > 0 ? (
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                                {categories.map((category, index) => (
                                    <Link
                                        key={category.id}
                                        href={`/categories/${category.slug}`}
                                        className="group"
                                        style={{
                                            animation: `fadeInUp 0.6s ease-out ${index * 0.08}s both`
                                        }}
                                    >
                                        <Card className="relative h-full overflow-hidden bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:scale-105">
                                            {/* Decorative gradient overlay */}
                                            <div
                                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                style={{
                                                    background: `linear-gradient(135deg, ${category.color || '#3b82f6'}10 0%, transparent 100%)`
                                                }}
                                            />

                                            {/* Color accent bar with gradient */}
                                            <div
                                                className="h-2 w-full relative overflow-hidden"
                                            >
                                                <div
                                                    className="absolute inset-0 group-hover:scale-x-110 transition-transform duration-500"
                                                    style={{
                                                        background: `linear-gradient(90deg, ${category.color || '#3b82f6'} 0%, ${category.color || '#3b82f6'}CC 100%)`
                                                    }}
                                                />
                                            </div>

                                            <div className="relative p-6">
                                                {/* Icon Section */}
                                                <div className="mb-6 flex items-start justify-between">
                                                    <div
                                                        className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                                                        style={{
                                                            backgroundColor: category.color ? `${category.color}20` : '#3b82f620',
                                                            color: category.color || '#3b82f6',
                                                            boxShadow: `0 10px 30px ${category.color || '#3b82f6'}30`
                                                        }}
                                                    >
                                                        {category.icon || '📁'}
                                                    </div>
                                                    <Badge
                                                        className="bg-background/80 backdrop-blur-sm shadow-sm px-3 py-1"
                                                    >
                                                        <span className="font-bold" style={{ color: category.color || '#3b82f6' }}>
                                                            {category.documents_count}
                                                        </span>
                                                    </Badge>
                                                </div>

                                                {/* Title */}
                                                <h3 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors duration-300 min-h-[3.5rem]">
                                                    {category.name}
                                                </h3>

                                                {/* Description */}
                                                {category.description ? (
                                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 min-h-[4.5rem]">
                                                        {category.description}
                                                    </p>
                                                ) : (
                                                    <div className="min-h-[4.5rem] mb-4" />
                                                )}

                                                {/* View Link */}
                                                <div className="flex items-center gap-2 text-sm font-semibold text-primary pt-4 border-t border-border/50">
                                                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                                                        Explore Documentation
                                                    </span>
                                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="max-w-2xl mx-auto p-16 text-center bg-gradient-to-br from-card to-muted/30 border-2 border-dashed">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-6 flex items-center justify-center">
                                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold mb-3">No Categories Available</h3>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                Categories will appear here once they're created. Check back soon!
                            </p>
                        </Card>
                    )}
                </div>

                {/* CSS Animations */}
                <style>{`
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translateY(30px) scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}</style>
            </main>
        </>
    );
}
