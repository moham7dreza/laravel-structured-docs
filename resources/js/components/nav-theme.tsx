import { Moon, Sun } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppearance } from '@/hooks/use-appearance';

export function NavTheme() {
    const { appearance, resolvedAppearance, updateAppearance } =
        useAppearance();

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100">
                                    {resolvedAppearance === 'dark' ? (
                                        <Moon className="h-5 w-5" />
                                    ) : (
                                        <Sun className="h-5 w-5" />
                                    )}
                                    <span>
                                        {appearance === 'system'
                                            ? 'System'
                                            : appearance === 'dark'
                                              ? 'Dark'
                                              : 'Light'}
                                    </span>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                side="right"
                                className="w-48"
                            >
                                <DropdownMenuItem
                                    onClick={() => updateAppearance('light')}
                                    className={
                                        appearance === 'light'
                                            ? 'bg-accent text-accent-foreground'
                                            : ''
                                    }
                                >
                                    <Sun className="mr-2 h-4 w-4" />
                                    <span>Light</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateAppearance('dark')}
                                    className={
                                        appearance === 'dark'
                                            ? 'bg-accent text-accent-foreground'
                                            : ''
                                    }
                                >
                                    <Moon className="mr-2 h-4 w-4" />
                                    <span>Dark</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => updateAppearance('system')}
                                    className={
                                        appearance === 'system'
                                            ? 'bg-accent text-accent-foreground'
                                            : ''
                                    }
                                >
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <rect
                                            x="2"
                                            y="3"
                                            width="20"
                                            height="14"
                                            rx="2"
                                            ry="2"
                                        />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                    <span>System</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
