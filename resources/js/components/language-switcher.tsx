import { Globe } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        dir: 'ltr',
    },
    {
        code: 'fa',
        name: 'Persian',
        nativeName: 'فارسی',
        flag: '🇮🇷',
        dir: 'rtl',
    },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode: string) => {
        const newLang = languages.find((lang) => lang.code === langCode);
        if (newLang) {
            i18n.changeLanguage(langCode);
            document.documentElement.setAttribute('dir', newLang.dir);
            document.documentElement.setAttribute('lang', langCode);
            document.documentElement.setAttribute('lang', langCode);
            localStorage.setItem('i18nextLng', langCode);
            // Force a small delay to ensure direction is set before re-render
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }));
            }, 0);
        }
    };

    // Set initial direction and update on language change
    useEffect(() => {
        const cleanLang = i18n.language.split('-')[0];
        const newLang = languages.find((lang) => lang.code === cleanLang) || languages[0];
        document.documentElement.setAttribute('dir', newLang.dir);
        document.documentElement.setAttribute('lang', cleanLang);
    }, [i18n.language]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Globe className="h-5 w-5" />
                    <span className="absolute -bottom-1 -right-1 text-xs">{currentLanguage.flag}</span>
                    <span className="sr-only">Change language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className={`flex items-center gap-3 cursor-pointer ${
                            currentLanguage.code === language.code ? 'bg-muted' : ''
                        }`}
                    >
                        <span className="text-2xl">{language.flag}</span>
                        <div className="flex flex-col">
                            <span className="font-medium">{language.nativeName}</span>
                            <span className="text-xs text-muted-foreground">{language.name}</span>
                        </div>
                        {currentLanguage.code === language.code && (
                            <span className="ml-auto text-brand-600">✓</span>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
