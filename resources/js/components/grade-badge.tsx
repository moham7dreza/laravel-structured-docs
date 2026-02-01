import { cn } from '@/lib/utils';
import React from 'react';

interface GradeBadgeProps {
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function GradeBadge({ grade, size = 'md', className }: GradeBadgeProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-lg',
        lg: 'w-16 h-16 text-2xl',
    };

    const gradeClasses = {
        S: 'badge-grade-s shadow-lg shadow-yellow-400/50',
        A: 'badge-grade-a shadow-lg shadow-gray-300/50',
        B: 'badge-grade-b shadow-lg shadow-amber-600/50',
        C: 'badge-grade-c shadow-lg shadow-blue-400/50',
        D: 'badge-grade-d shadow-lg shadow-purple-400/50',
        F: 'badge-grade-f shadow-lg shadow-red-400/50',
    };

    return (
        <div
            className={cn(
                'rounded-full flex items-center justify-center',
                sizeClasses[size],
                gradeClasses[grade],
                className,
            )}
        >
            {grade}
        </div>
    );
}
