import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, UserCircle, Tag } from 'lucide-react';
import type { SharedData } from '@/types';
import React from 'react';

interface TagsIndexProps {
    tags: Array<{
        id: number;
        name: string;
        slug: string;
        documents_count: number;
    }>;
}

export default function TagsIndex({ tags }: TagsIndexProps) {
    const { auth } = usePage<SharedData>().props;

    // Debug logging
    React.useEffect(() => {
        console.log('=== Tags Page Debug ===');
        console.log('Tags prop:', tags);
        console.log('Tags count:', tags?.length);
        console.log('First tag:', tags?.[0]);
    }, [tags]);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Group tags by first letter
    const groupedTags = tags?.reduce(
        (acc, tag) => {
            const firstLetter = tag.name[0].toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(tag);
            return acc;
        },
        {} as Record<string, typeof tags>,
    ) || {};

    const sortedLetters = Object.keys(groupedTags).sort();

    return (
        <>
            <Head title="Tags" />

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
                <div className="container mx-auto px-4 py-16 max-w-7xl">
                    {/* Page Header - Centered */}
                    <div className="text-center mb-16 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 text-primary rounded-full text-sm font-medium mb-6 shadow-lg">
                            <Tag className="w-5 h-5" />
                            <span>Topic Tags</span>
                        </div>

                        <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                                Discover
                            </span>
                            <br />
                            <span className="text-foreground">by Tags</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-8">
                            Explore {tags?.length || 0} topic tags covering technologies, frameworks, and concepts.
                            Find content that matches your interests.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-md border">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
                                <span className="font-medium text-foreground">{tags?.length || 0} Active Tags</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-full shadow-md border">
                                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="font-medium text-muted-foreground">Organized Topics</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags Display - Centered */}
                    {tags && tags.length > 0 ? (
                        <div className="max-w-7xl mx-auto space-y-16">
                            {/* Trending Tags Section */}
                            <div>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-3 mb-4">
                                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                            Trending Tags
                                        </h2>
                                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"></div>
                                    </div>
                                    <p className="text-muted-foreground">Most popular topics in our documentation</p>
                                </div>

                                <Card className="p-8 md:p-12 bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm border-2 shadow-2xl">
                                    <div className="flex flex-wrap justify-center gap-3 md:gap-4">
                                        {tags.slice(0, 20).map((tag, index) => (
                                            <Link
                                                key={tag.id}
                                                href={`/tags/${tag.slug}`}
                                                style={{
                                                    animation: `popIn 0.5s ease-out ${index * 0.03}s both`
                                                }}
                                            >
                                                <Badge
                                                    className="group relative px-5 py-3 text-base font-semibold cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl border-2 hover:border-primary bg-background/80 backdrop-blur-sm"
                                                >
                                                    <span className="text-primary font-bold mr-1 text-lg">#</span>
                                                    <span className="text-foreground group-hover:text-primary transition-colors">{tag.name}</span>
                                                    <span className="ml-3 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                                                        {tag.documents_count}
                                                    </span>
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* All Tags Alphabetically */}
                            <div>
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-3 mb-4">
                                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full"></div>
                                        <h2 className="text-3xl md:text-4xl font-bold">
                                            All Tags
                                        </h2>
                                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full"></div>
                                    </div>
                                    <p className="text-muted-foreground">Browse alphabetically</p>
                                </div>

                                <div className="space-y-12">
                                    {sortedLetters.map((letter) => (
                                        <div key={letter} className="scroll-mt-20" id={`letter-${letter}`}>
                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-3xl font-black shadow-xl">
                                                    {letter}
                                                </div>
                                                <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/50 via-primary/20 to-transparent rounded-full"></div>
                                                <span className="text-sm font-medium text-muted-foreground px-4 py-2 bg-card rounded-full border shadow-sm">
                                                    {groupedTags[letter].length} {groupedTags[letter].length === 1 ? 'tag' : 'tags'}
                                                </span>
                                            </div>

                                            <Card className="p-6 md:p-8 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 shadow-lg">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                    {groupedTags[letter].map((tag) => (
                                                        <Link
                                                            key={tag.id}
                                                            href={`/tags/${tag.slug}`}
                                                            className="group"
                                                        >
                                                            <div className="relative flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 transition-all duration-300 border-2 border-transparent hover:border-primary/30 hover:shadow-lg group">
                                                                <div className="flex items-center gap-3 min-w-0">
                                                                    <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary to-primary/50 group-hover:scale-150 transition-transform duration-300"></div>
                                                                    <span className="font-semibold group-hover:text-primary transition-colors truncate">
                                                                        {tag.name}
                                                                    </span>
                                                                </div>
                                                                <Badge variant="outline" className="ml-3 flex-shrink-0 font-bold shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all">
                                                                    {tag.documents_count}
                                                                </Badge>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </Card>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Alphabet Quick Navigation */}
                            <Card className="p-6 sticky bottom-6 shadow-2xl border-2 bg-card/95 backdrop-blur-lg">
                                <div className="text-center mb-4">
                                    <span className="text-sm font-semibold text-muted-foreground">Quick Navigation</span>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {sortedLetters.map((letter) => (
                                        <a
                                            key={letter}
                                            href={`#letter-${letter}`}
                                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-muted to-muted/50 hover:from-primary hover:to-primary/80 hover:text-primary-foreground transition-all duration-300 font-bold text-sm shadow-md hover:shadow-xl hover:scale-110"
                                        >
                                            {letter}
                                        </a>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="max-w-2xl mx-auto p-16 text-center bg-gradient-to-br from-card to-muted/30 border-2 border-dashed">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mx-auto mb-6 flex items-center justify-center">
                                <Tag className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">No Tags Available</h3>
                            <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                Tags will appear here once content is tagged. Check back soon!
                            </p>
                        </Card>
                    )}
                </div>

                {/* CSS Animations */}
                <style>{`
                    @keyframes popIn {
                        from {
                            opacity: 0;
                            transform: scale(0.8) translateY(10px);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }
                `}</style>
            </main>
        </>
    );
}
