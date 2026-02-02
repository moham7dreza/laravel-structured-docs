import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import React, { useState } from 'react';

interface SearchBarProps {
    placeholder?: string;
    defaultValue?: string | null;
    onSearch?: (query: string) => void;
    className?: string;
}

export function SearchBar({
    placeholder = 'Search documents...',
    defaultValue = '',
    onSearch,
    className,
}: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        } else {
            router.visit(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleClear = () => {
        setQuery('');
        if (onSearch) {
            onSearch('');
        }
    };

    return (
        <form onSubmit={handleSearch} className={className}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="pl-10 pr-20"
                />
                {query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="absolute right-14 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
                <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                    Search
                </Button>
            </div>
        </form>
    );
}
