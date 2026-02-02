import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    Clock,
    Eye,
    GitBranch,
    MessageSquare,
    Star,
    Tag,
    User,
    UserCircle,
} from 'lucide-react';
import type { SharedData } from '@/types';
import React, { useState } from 'react';

interface DocumentShowProps {
    document: {
        id: number;
        title: string;
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

export default function DocumentShow({ document, sections, relatedDocuments }: DocumentShowProps) {
    const { auth } = usePage<SharedData>().props;
    const [activeSection, setActiveSection] = useState<number | null>(null);

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
                {/* Breadcrumbs */}
                <div className="border-b bg-muted/30">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground">
                                Home
                            </Link>
                            <span>/</span>
                            <Link href="/documents" className="hover:text-foreground">
                                Documents
                            </Link>
                            {document.category && (
                                <>
                                    <span>/</span>
                                    <Link
                                        href={`/categories/${document.category.slug}`}
                                        className="hover:text-foreground"
                                    >
                                        {document.category.name}
                                    </Link>
                                </>
                            )}
                            <span>/</span>
                            <span className="text-foreground font-medium">{document.title}</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                        {/* Main Content */}
                        <div className="min-w-0">
                            {/* Document Header */}
                            <div className="mb-8">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        {document.category && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <Badge variant="outline">
                                                    {document.category.icon && (
                                                        <span className="mr-1">
                                                            {document.category.icon}
                                                        </span>
                                                    )}
                                                    {document.category.name}
                                                </Badge>
                                                <Badge
                                                    variant={
                                                        document.status === 'published'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {document.status}
                                                </Badge>
                                            </div>
                                        )}
                                        <h1 className="text-4xl font-bold mb-3">{document.title}</h1>
                                        {document.description && (
                                            <p className="text-xl text-muted-foreground">
                                                {document.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-primary">
                                                {document.score}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Score
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Metadata Bar */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <Link
                                        href={`/users/${document.owner.id}`}
                                        className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span>{document.owner.name}</span>
                                    </Link>
                                    <div className="flex items-center gap-1.5">
                                        <Eye className="w-4 h-4" />
                                        <span>{document.views_count} views</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare className="w-4 h-4" />
                                        <span>{document.comments_count} comments</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            Updated{' '}
                                            {new Date(document.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Tags */}
                                {document.tags.length > 0 && (
                                    <div className="flex flex-wrap items-center gap-2 mt-4">
                                        <Tag className="w-4 h-4 text-muted-foreground" />
                                        {document.tags.map((tag) => (
                                            <Link
                                                key={tag.id}
                                                href={`/tags/${tag.slug}`}
                                                className="inline-block"
                                            >
                                                <Badge variant="secondary" className="hover:bg-accent">
                                                    {tag.name}
                                                </Badge>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Separator className="my-8" />

                            {/* Document Content */}
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: document.content }} />
                            </div>

                            <Separator className="my-8" />

                            {/* Comments Section */}
                            <div className="mt-12">
                                <h2 className="text-2xl font-bold mb-6">
                                    Comments ({document.comments_count})
                                </h2>
                                <Card className="p-8 text-center text-muted-foreground">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p>Comments feature coming soon...</p>
                                </Card>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="space-y-6">
                            {/* Table of Contents */}
                            {sections.length > 0 && (
                                <Card className="p-6 sticky top-24">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Table of Contents
                                    </h3>
                                    <nav className="space-y-2">
                                        {sections.map((section) => (
                                            <a
                                                key={section.id}
                                                href={`#section-${section.id}`}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`block text-sm py-1 px-2 rounded hover:bg-accent transition-colors ${
                                                    activeSection === section.id
                                                        ? 'bg-accent font-medium'
                                                        : 'text-muted-foreground'
                                                }`}
                                            >
                                                {section.title}
                                            </a>
                                        ))}
                                    </nav>
                                </Card>
                            )}

                            {/* Document Info */}
                            <Card className="p-6">
                                <h3 className="font-semibold mb-4">Document Info</h3>
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <div className="text-muted-foreground mb-1">Created</div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(document.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {document.published_at && (
                                        <div>
                                            <div className="text-muted-foreground mb-1">
                                                Published
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(document.published_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="text-muted-foreground mb-1">Last Updated</div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(document.updated_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Git Branches */}
                            {document.branches.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <GitBranch className="w-4 h-4" />
                                        Git Branches
                                    </h3>
                                    <div className="space-y-2">
                                        {document.branches.map((branch) => (
                                            <div
                                                key={branch.id}
                                                className="text-sm p-2 rounded bg-muted"
                                            >
                                                <div className="font-medium">{branch.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {branch.repository}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* Actions */}
                            <Card className="p-6">
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start">
                                        <Star className="w-4 h-4 mr-2" />
                                        Watch Document
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Print / Export
                                    </Button>
                                </div>
                            </Card>

                            {/* Related Documents */}
                            {relatedDocuments.length > 0 && (
                                <Card className="p-6">
                                    <h3 className="font-semibold mb-4">Related Documents</h3>
                                    <div className="space-y-3">
                                        {relatedDocuments.map((doc) => (
                                            <Link
                                                key={doc.id}
                                                href={`/documents/${doc.slug}`}
                                                className="block group"
                                            >
                                                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                                                    {doc.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {doc.category?.name}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </Card>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
