import { router } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
    placeholder?: string;
    defaultValue?: string | null;
    onSearch?: (query: string) => void;
    className?: string;
}

export function SearchBar({
    placeholder,
    defaultValue = '',
    onSearch,
    className,
}: SearchBarProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState(defaultValue || '');
    const finalPlaceholder = placeholder || t('search.placeholder');

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
            <div className="relative group">
                {/* Gradient border effect on focus */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500 to-brand-600 rounded-lg opacity-0 group-focus-within:opacity-100 blur transition duration-300"></div>

                <div className="relative bg-background rounded-lg">
                    {/* Search Icon - RTL aware positioning */}
                    <div className="absolute top-1/2 -translate-y-1/2 pointer-events-none ltr:left-4 rtl:right-4">
                        <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-brand-500 transition-colors" />
                    </div>

                    {/* Input Field - RTL aware padding */}
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={finalPlaceholder}
                        className="h-12 ltr:pl-12 rtl:pr-12 ltr:pr-32 rtl:pl-12 text-base border-2 border-muted hover:border-muted-foreground/20 focus-visible:border-transparent transition-all shadow-sm"
                    />

                    {/* Action Buttons - RTL aware positioning */}
                    <div className="absolute top-1/2 -translate-y-1/2 ltr:right-2 rtl:left-2 flex items-center gap-2 rtl:flex-row-reverse">
                        {query && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleClear}
                                className="h-8 w-8 p-0 hover:bg-muted rounded-md transition-colors"
                                title={t('common.cancel')}
                            >
                                <X className="w-4 h-4" />
                                <span className="sr-only">{t('common.cancel')}</span>
                            </Button>
                        )}
                        <Button
                            type="submit"
                            size="sm"
                            className="h-8 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-medium shadow-md hover:shadow-lg transition-all gap-1.5 flex items-center rtl:flex-row-reverse"
                        >
                            <Search className="w-4 h-4" />
                            <span>{t('search.button')}</span>
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
}
