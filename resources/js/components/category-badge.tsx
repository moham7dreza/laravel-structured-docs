import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import React from 'react';

interface CategoryBadgeProps {
    category: {
        id: number;
        name: string;
        slug: string;
        color?: string;
        icon?: string;
    };
    clickable?: boolean;
    className?: string;
}

export function CategoryBadge({ category, clickable = true, className }: CategoryBadgeProps) {
    const badge = (
        <Badge
            variant="outline"
            className={cn(
                'gap-1.5',
                clickable && 'hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors',
                className,
            )}
            style={{
                borderColor: category.color,
                color: category.color,
            }}
        >
            {category.icon && <span>{category.icon}</span>}
            <span>{category.name}</span>
        </Badge>
    );

    if (clickable) {
        return (
            <Link href={`/categories/${category.slug}`} className="inline-block">
                {badge}
            </Link>
        );
    }

    return badge;
}
