import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Clock,
    Eye,
    GitBranch,
    MessageSquare,
    Star,
    Tag,
    UserCircle,
    FileText,
    Share2,
    Bookmark,
    ArrowLeft,
    TrendingUp,
    Edit,
    Trash2,
} from 'lucide-react';
import type { SharedData } from '@/types';
import React, { useState, useEffect } from 'react';

interface DocumentShowProps {
    document: {
        id: number;
        title: string;
        slug: string;
        description?: string;
        content: string;
        status: string;
        score: number;
        views_count: number;
        comments_count: number;
        created_at: string;
        updated_at: string;
        published_at?: string;
        category?: {
            id: number;
            name: string;
            slug: string;
            icon?: string;
            color?: string;
        };
        owner: {
            id: number;
            name: string;
            avatar?: string;
        };
        tags: Array<{
            id: number;
            name: string;
            slug: string;
        }>;
        branches: Array<{
            id: number;
            name: string;
            repository: string;
        }>;
    };
    sections: Array<{
        id: number;
        title: string;
        order: number;
    }>;
    relatedDocuments: Array<any>;
}

function getScoreColor(score: number): string {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-amber-500 to-orange-500';
    return 'from-red-500 to-rose-500';
}

function getScoreGrade(score: number): string {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

export default function DocumentShow({ document, sections, relatedDocuments }: DocumentShowProps) {
    const { auth } = usePage<SharedData>().props;
    const [activeSection, setActiveSection] = useState<number | null>(null);
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

    return (
        <>
            <Head title={`${document.title} - Documentation`} />

            {/* Navigation Header */}
            <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                isScrolled ? 'bg-background/95 backdrop-blur shadow-md' : 'bg-background/60 backdrop-blur'
            }`}>
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
                {/* Breadcrumbs */}
                <div className="border-b bg-muted/30">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            {document.category && (
                                <>
                                    <Link
                                        href={`/categories/${document.category.slug}`}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {document.category.name}
                                    </Link>
                                    <span>/</span>
                                </>
                            )}
                            <span className="text-foreground font-medium line-clamp-1">{document.title}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12 max-w-7xl">
                    {/* Back Button */}
                    <Link
                        href={document.category ? `/categories/${document.category.slug}` : '/documents'}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to {document.category ? document.category.name : 'Documents'}
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
                        {/* Main Content */}
                        <div className="min-w-0">
                            {/* Document Hero Card */}
                            <Card className="mb-8 p-8 md:p-10 bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm border-2 shadow-2xl relative overflow-hidden">
                                {/* Decorative Background */}
                                {document.category?.color && (
                                    <div
                                        className="absolute inset-0 opacity-5"
                                        style={{
                                            background: `radial-gradient(circle at top right, ${document.category.color} 0%, transparent 70%)`
                                        }}
                                    />
                                )}

                                <div className="relative">
                                    {/* Category & Status Badges */}
                                    <div className="flex flex-wrap items-center gap-2 mb-4">
                                        {document.category && (
                                            <Link href={`/categories/${document.category.slug}`}>
                                                <Badge
                                                    variant="outline"
                                                    className="px-3 py-1 hover:bg-accent transition-colors"
                                                    style={{
                                                        borderColor: document.category.color ? `${document.category.color}50` : undefined
                                                    }}
                                                >
                                                    {document.category.icon && (
                                                        <span className="mr-1.5">{document.category.icon}</span>
                                                    )}
                                                    {document.category.name}
                                                </Badge>
                                            </Link>
                                        )}
                                        <Badge
                                            className="px-3 py-1"
                                        >
                                            {document.status}
                                        </Badge>
                                    </div>

                                    {/* Title & Description */}
                                    <div className="flex items-start justify-between gap-4 mb-4">
                                        <h1 className="text-4xl md:text-5xl font-black leading-tight flex-1">
                                            {document.title}
                                        </h1>
                                        {auth?.user?.id === document.owner.id && (
                                            <div className="flex gap-2 mt-2">
                                                <Button asChild size="sm" className="gap-2">
                                                    <Link href={`/documents/${document.slug}/edit`}>
                                                        <Edit className="w-4 h-4" />
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="gap-2"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this document? This action can be undone from the admin panel.')) {
                                                            router.delete(`/documents/${document.slug}`, {
                                                                onSuccess: () => {
                                                                    // Will redirect to documents index
                                                                },
                                                            });
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {document.description && (
                                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                                            {document.description}
                                        </p>
                                    )}

                                    {/* Metadata Bar */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <Link
                                            href={`/users/${document.owner.id}`}
                                            className="flex items-center gap-2 hover:text-primary transition-colors group"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={document.owner.avatar} alt={document.owner.name} />
                                                <AvatarFallback className="text-xs">
                                                    {getInitials(document.owner.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{document.owner.name}</span>
                                        </Link>
                                        <Separator orientation="vertical" className="h-6" />
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Eye className="w-4 h-4" />
                                            <span>{document.views_count.toLocaleString()} views</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>{document.comments_count} comments</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                Updated {new Date(document.updated_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {document.tags.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t">
                                            <Tag className="w-4 h-4 text-muted-foreground" />
                                            {document.tags.map((tag) => (
                                                <Link
                                                    key={tag.id}
                                                    href={`/tags/${tag.slug}`}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                                                    >
                                                        #{tag.name}
                                                    </Badge>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Card>

                            {/* Document Content */}
                            <Card className="p-8 md:p-10 bg-card/50 backdrop-blur-sm border-2 mb-8">
                                <div
                                    className="prose prose-slate dark:prose-invert max-w-none
                                        prose-headings:font-bold prose-headings:tracking-tight
                                        prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                                        prose-p:leading-relaxed prose-p:text-base
                                        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                                        prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                                        prose-pre:bg-muted prose-pre:border prose-pre:border-border
                                        prose-img:rounded-lg prose-img:shadow-lg
                                        prose-blockquote:border-l-4 prose-blockquote:border-primary
                                        prose-ul:list-disc prose-ol:list-decimal"
                                    dangerouslySetInnerHTML={{ __html: document.content }}
                                />
                            </Card>

                            {/* Comments Section */}
                            <Card className="p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <MessageSquare className="w-6 h-6" />
                                    Comments ({document.comments_count})
                                </h2>
                                <div className="p-12 text-center bg-muted/30 rounded-lg border-2 border-dashed">
                                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-semibold mb-2">Comments Coming Soon</h3>
                                    <p className="text-muted-foreground">
                                        We're working on bringing discussions to the documentation.
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Score Card */}
                            <Card className="p-6 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-2 shadow-lg">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 bg-gradient-to-br ${getScoreColor(document.score)} shadow-xl">
                                        <div className="text-4xl font-black text-white">
                                            {getScoreGrade(document.score)}
                                        </div>
                                    </div>
                                    <div className="text-3xl font-black mb-1">{document.score}</div>
                                    <div className="text-sm text-muted-foreground">Quality Score</div>
                                    <div className="mt-4 flex items-center justify-center gap-1">
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                            High Quality
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            {/* Actions */}
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4">Quick Actions</h3>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                                        <Bookmark className="w-4 h-4 mr-2" />
                                        Bookmark
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start hover:bg-primary/10">
                                        <Star className="w-4 h-4 mr-2" />
                                        Watch Updates
                                    </Button>
                                </div>
                            </Card>

                            {/* Table of Contents */}
                            {sections.length > 0 && (
                                <Card className="p-6 sticky top-24">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Contents
                                    </h3>
                                    <nav className="space-y-1">
                                        {sections.map((section) => (
                                            <a
                                                key={section.id}
                                                href={`#section-${section.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setActiveSection(section.id);
                                                    const element = window.document.getElementById(`section-${section.id}`);
                                                    if (element) {
                                                        element.scrollIntoView({ behavior: 'smooth' });
                                                    }
                                                }}
                                                className={`block text-sm py-2 px-3 rounded-lg transition-all ${
                                                    activeSection === section.id
                                                        ? 'bg-primary text-primary-foreground font-semibold'
                                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                                }`}
                                            >
                                                {section.title}
                                            </a>
                                        ))}
                                    </nav>
                                </Card>
                            )}

                            {/* Document Info */}
                            <Card className="p-6 bg-muted/30">
                                <h3 className="font-semibold mb-4 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Timeline
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                                        <div className="flex-1">
                                            <div className="text-muted-foreground text-xs">Created</div>
                                            <div className="font-medium">
                                                {new Date(document.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    {document.published_at && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                                            <div className="flex-1">
                                                <div className="text-muted-foreground text-xs">Published</div>
                                                <div className="font-medium">
                                                    {new Date(document.published_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></div>
                                        <div className="flex-1">
                                            <div className="text-muted-foreground text-xs">Last Updated</div>
                                            <div className="font-medium">
                                                {new Date(document.updated_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Git Branches */}
                            {document.branches.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <GitBranch className="w-4 h-4" />
                                        Git Integration
                                    </h3>
                                    <div className="space-y-2">
                                        {document.branches.map((branch) => (
                                            <div
                                                key={branch.id}
                                                className="p-3 rounded-lg bg-muted/50 border transition-colors hover:border-primary/50"
                                            >
                                                <div className="font-mono text-sm font-semibold mb-1">
                                                    {branch.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground truncate">
                                                    {branch.repository}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Related Documents */}
                            {relatedDocuments.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="font-semibold mb-4">Related Docs</h3>
                                    <div className="space-y-3">
                                        {relatedDocuments.map((doc) => (
                                            <Link
                                                key={doc.id}
                                                href={`/documents/${doc.slug}`}
                                                className="block group p-3 rounded-lg hover:bg-accent transition-colors"
                                            >
                                                <div className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                                    {doc.title}
                                                </div>
                                                {doc.category && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {doc.category.name}
                                                    </div>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}
