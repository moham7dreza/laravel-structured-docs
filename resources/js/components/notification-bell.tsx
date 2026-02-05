import { Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // Fetch unread count
        fetch('/api/notifications/unread-count')
            .then((res) => res.json())
            .then((data) => setUnreadCount(data.count))
            .catch(() => setUnreadCount(0));
    }, []);

    return (
        <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
                <span className="sr-only">
                    Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
                </span>
            </Link>
        </Button>
    );
}
