import {
    Box,
    Sparkles,
    Wrench,
    ClipboardList,
    BookOpen,
    Code,
    Database,
    FileText,
    Shield,
    Users,
    Settings,
    Zap,
    Trophy,
    Layers,
    FolderOpen,
    type LucideIcon,
} from 'lucide-react';

// Map Heroicon names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
    'heroicon-o-cube-transparent': Box,
    'heroicon-o-sparkles': Sparkles,
    'heroicon-o-wrench-screwdriver': Wrench,
    'heroicon-o-clipboard-document-list': ClipboardList,
    'heroicon-o-book-open': BookOpen,
    'heroicon-o-code-bracket': Code,
    'heroicon-o-circle-stack': Database,
    'heroicon-o-document-text': FileText,
    'heroicon-o-shield-check': Shield,
    'heroicon-o-users': Users,
    'heroicon-o-cog': Settings,
    'heroicon-o-bolt': Zap,
    'heroicon-o-trophy': Trophy,
    'heroicon-o-squares-2x2': Layers,
    'heroicon-o-folder-open': FolderOpen,
};

interface CategoryIconProps {
    icon: string;
    className?: string;
}

export function CategoryIcon({ icon, className = 'w-8 h-8' }: CategoryIconProps) {
    const IconComponent = iconMap[icon] || FolderOpen;
    return <IconComponent className={className} />;
}
