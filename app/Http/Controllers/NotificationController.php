<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display the notifications page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $filter = $request->input('filter', 'all'); // all, unread, read

        $query = Notification::query()
            ->where('user_id', $user->id)
            ->with(['sender']);

        // Apply filter
        if ($filter === 'unread') {
            $query->whereNull('read_at');
        } elseif ($filter === 'read') {
            $query->whereNotNull('read_at');
        }

        $notifications = $query
            ->latest()
            ->paginate(20)
            ->through(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at' => $notification->created_at->toISOString(),
                    'created_at_human' => $notification->created_at->diffForHumans(),
                    'sender' => $notification->sender ? [
                        'id' => $notification->sender->id,
                        'name' => $notification->sender->name,
                        'avatar' => $notification->sender->avatar,
                    ] : null,
                ];
            });

        $stats = [
            'total' => Notification::where('user_id', $user->id)->count(),
            'unread' => Notification::where('user_id', $user->id)->whereNull('read_at')->count(),
            'read' => Notification::where('user_id', $user->id)->whereNotNull('read_at')->count(),
        ];

        return Inertia::render('notifications/index', [
            'notifications' => $notifications,
            'stats' => $stats,
            'filter' => $filter,
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Request $request, Notification $notification)
    {
        if ($notification->user_id !== $request->user()->id) {
            abort(403);
        }

        $notification->update(['read_at' => now()]);

        return back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return back();
    }

    /**
     * Get unread notifications count (for header badge).
     */
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Get recent notifications (for dropdown).
     */
    public function recent(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->with(['sender'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'data' => $notification->data,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at_human' => $notification->created_at->diffForHumans(),
                    'sender' => $notification->sender ? [
                        'id' => $notification->sender->id,
                        'name' => $notification->sender->name,
                        'avatar' => $notification->sender->avatar,
                    ] : null,
                ];
            });

        return response()->json($notifications);
    }
}
