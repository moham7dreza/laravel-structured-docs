import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Clock, Eye, MessageSquare, User } from 'lucide-react';
import React from 'react';

interface DocumentCardProps {
    document: {
        id: number;
        title: string;
        slug: string;
        description?: string;
        thumbnail?: string;
        category?: {
            name: string;
            slug: string;
            color?: string;
        };
        owner?: {
            id: number;
            name: string;
            avatar?: string;
        };
        status: string;
        views_count?: number;
        comments_count?: number;
        score?: number;
        updated_at: string;
    };
    className?: string;
}

export function DocumentCard({ document, className }: DocumentCardProps) {
    const statusVariant = getStatusVariant(document.status);

    return (
        <Link href={`/documents/${document.slug}`} className={cn('block', className)}>
            <Card className="h-full overflow-hidden card-hover group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-brand-500 to-brand-700 overflow-hidden">
                    {document.thumbnail ? (
                        <img
                            src={document.thumbnail}
                            alt={document.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-white/30 text-6xl font-bold">
                                {document.title.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}

                    {/* Status badge overlay */}
                    <div className="absolute top-3 right-3">
                        <Badge variant={statusVariant as any}>{document.status}</Badge>
                    </div>

                    {/* Score badge */}
                    {document.score !== undefined && (
                        <div className="absolute bottom-3 right-3">
                            <div className={cn(
                                'px-2.5 py-1 rounded-full text-xs font-bold',
                                getScoreColor(document.score)
                            )}>
                                {document.score}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    {/* Category */}
                    {document.category && (
                        <div className="mb-2">
                            <Badge variant="outline" className="text-xs">
                                {document.category.name}
                            </Badge>
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {document.title}
                    </h3>

                    {/* Description */}
                    {document.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {document.description}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                        {/* Author */}
                        {document.owner && (
                            <Link
                                href={`/users/${document.owner.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-2 hover:text-brand-600 transition-colors"
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>{document.owner.name}</span>
                            </Link>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-3">
                            {document.views_count !== undefined && (
                                <div className="flex items-center gap-1">
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>{formatNumber(document.views_count)}</span>
                                </div>
                            )}
                            {document.comments_count !== undefined && document.comments_count > 0 && (
                                <div className="flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>{formatNumber(document.comments_count)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{formatDate(document.updated_at)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

// Helper functions
function getStatusVariant(status: string): string {
    const variants: Record<string, string> = {
        draft: 'draft',
        pending_review: 'pending',
        published: 'published',
        completed: 'completed',
        stale: 'stale',
        archived: 'archived',
    };
    return variants[status] || 'default';
}

function getScoreColor(score: number): string {
    if (score >= 70) return 'bg-green-500 text-white';
    if (score >= 40) return 'bg-amber-500 text-white';
    return 'bg-red-500 text-white';
}

function formatNumber(num: number): string {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
}

function formatDate(date: string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
}
