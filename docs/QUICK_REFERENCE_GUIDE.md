# 🚀 Quick Reference Guide - New Features

**Last Updated:** February 3, 2026

---

## 🔍 Global Search

### URLs
- **Main Search:** `/search`
- **With Query:** `/search?q=laravel`
- **Filter by Type:** `/search?q=laravel&type=documents`
- **Advanced:** `/search?q=laravel&type=documents&category=backend&sort=popular`

### API Endpoints
```bash
# Get search suggestions (autocomplete)
GET /search/suggestions?q={query}
```

### Query Parameters
- `q` - Search query (required)
- `type` - Content type (all, documents, users, categories, tags)
- `category` - Filter by category slug
- `tag` - Filter by tag slug
- `status` - Filter by status (published, draft, archived)
- `sort` - Sort order (relevance, latest, popular, score)

### Usage Example
```typescript
// Navigate to search
<Link href="/search?q=laravel&type=documents">
  Search Laravel Documents
</Link>

// Or use router
router.get('/search', { q: 'laravel', type: 'documents' });
```

---

## 🔔 Notifications

### URLs
- **All Notifications:** `/notifications`
- **Unread Only:** `/notifications?filter=unread`
- **Read Only:** `/notifications?filter=read`

### API Endpoints (Authenticated)
```bash
# Get unread count
GET /api/notifications/unread-count
Response: { "count": 5 }

# Get recent 5 notifications
GET /api/notifications/recent
Response: [{ id, type, title, message, ... }]

# Mark as read
POST /notifications/{id}/read

# Mark all as read
POST /notifications/read-all
```

### Notification Types
| Type | Icon | Color | Description |
|------|------|-------|-------------|
| `comment` | MessageSquare | Blue | New comment |
| `mention` | MessageSquare | Purple | User mentioned |
| `like` | Heart | Red | Content liked |
| `follow` | UserPlus | Green | New follower |
| `document_updated` | FileText | Orange | Document updated |
| `review_request` | GitBranch | Indigo | Review requested |
| `status_change` | AlertCircle | Yellow | Status changed |

### Creating Notifications (Backend)
```php
use App\Models\Notification;

Notification::create([
    'user_id' => $recipientId,
    'sender_id' => auth()->id(), // optional
    'type' => 'comment',
    'title' => 'New Comment',
    'message' => "{$sender->name} commented on your document",
    'data' => [
        'document_id' => $document->id,
        'comment_id' => $comment->id,
    ],
]);
```

---

## 📊 Route Summary

### Public Routes
```
GET  /                          HomeController@index
GET  /documents                 DocumentController@index
GET  /documents/{slug}          DocumentController@show
GET  /categories                CategoryController@index
GET  /categories/{slug}         CategoryController@show
GET  /tags                      TagController@index
GET  /tags/{slug}               TagController@show
GET  /users/{user}              UserProfileController@show
GET  /leaderboard               LeaderboardController@index
GET  /activity                  ActivityFeedController@index
GET  /search                    SearchController@index (NEW)
GET  /search/suggestions        SearchController@suggestions (NEW)
```

### Authenticated Routes
```
GET  /dashboard                 DashboardController@index
GET  /notifications             NotificationController@index (NEW)
POST /notifications/{id}/read   NotificationController@markAsRead (NEW)
POST /notifications/read-all    NotificationController@markAllAsRead (NEW)
POST /users/{user}/follow       UserProfileController@follow
DELETE /users/{user}/follow     UserProfileController@unfollow
```

### API Routes (Authenticated)
```
GET  /api/notifications/unread-count    NotificationController@unreadCount (NEW)
GET  /api/notifications/recent          NotificationController@recent (NEW)
```

---

## 🎨 UI Components Reference

### Search Page Components
- Gradient hero with search bar
- Type filter buttons (All, Documents, Users, etc.)
- Advanced filter panel (category, tag, sort)
- Result cards (different layout per type)
- Empty state
- Pagination

### Notifications Page Components
- Gradient hero with stats (3 cards)
- Filter buttons (All, Unread, Read)
- Notification cards
- Mark as read buttons
- Empty state
- Pagination

---

## 💻 Developer Notes

### Search Implementation
```php
// SearchController@index
// - Multi-type search with filters
// - Relevance-based sorting
// - Limited results (performance)

// SearchController@suggestions
// - Autocomplete API
// - Returns top 5 docs + 3 users + 3 tags
```

### Notifications Implementation
```php
// NotificationController@index
// - Paginated notifications (20 per page)
// - Filter support (all, unread, read)
// - Eager loading of sender

// NotificationController@markAsRead
// - Authorization check
// - Update read_at timestamp

// NotificationController@markAllAsRead
// - Bulk update read_at
// - Only unread notifications
```

---

## 🧪 Testing Checklist

### Search
- [ ] Search with query works
- [ ] Type filters work (All, Documents, Users, etc.)
- [ ] Advanced filters work (category, tag, sort)
- [ ] Clear filters works
- [ ] Results display correctly
- [ ] Empty state shows when no results
- [ ] Pagination works
- [ ] Search suggestions API works
- [ ] Mobile responsive

### Notifications
- [ ] View all notifications
- [ ] Filter by unread works
- [ ] Filter by read works
- [ ] Mark as read (individual) works
- [ ] Mark all as read works
- [ ] Statistics display correctly
- [ ] Pagination works
- [ ] Empty states show correctly
- [ ] Unread count API works
- [ ] Recent notifications API works
- [ ] Mobile responsive

---

## 🔧 Configuration

### Search Settings (Recommended)
```php
// config/search.php (create if needed)
return [
    'results_per_type' => [
        'all' => [
            'documents' => 10,
            'users' => 5,
            'categories' => 5,
            'tags' => 5,
        ],
        'specific' => 20,
    ],
    'suggestions_limit' => [
        'documents' => 5,
        'users' => 3,
        'tags' => 3,
    ],
];
```

### Notification Settings (Recommended)
```php
// config/notifications.php (create if needed)
return [
    'per_page' => 20,
    'recent_limit' => 5,
    'types' => [
        'comment',
        'mention',
        'like',
        'follow',
        'document_updated',
        'review_request',
        'status_change',
    ],
];
```

---

## 📱 Frontend Integration

### Using Search in Components
```typescript
import { router } from '@inertiajs/react';

// Navigate to search
const handleSearch = (query: string) => {
    router.get('/search', { q: query });
};

// With filters
const handleAdvancedSearch = () => {
    router.get('/search', {
        q: searchQuery,
        type: 'documents',
        category: selectedCategory,
        sort: 'popular',
    });
};
```

### Using Notifications in Header
```typescript
import { useEffect, useState } from 'react';

const [unreadCount, setUnreadCount] = useState(0);

useEffect(() => {
    // Fetch unread count
    fetch('/api/notifications/unread-count')
        .then(res => res.json())
        .then(data => setUnreadCount(data.count));
}, []);

// Display badge
<Bell className="w-5 h-5" />
{unreadCount > 0 && (
    <span className="badge">{unreadCount}</span>
)}
```

---

## 🎯 Performance Tips

### Search Optimization
1. ✅ **Limit results** (already implemented)
2. ✅ **Eager load relationships** (already implemented)
3. 🔲 **Add database indexes** on searchable columns
4. 🔲 **Implement caching** for popular searches
5. 🔲 **Use Laravel Scout** for better full-text search

### Notifications Optimization
1. ✅ **Pagination** (already implemented)
2. ✅ **Eager loading** (already implemented)
3. 🔲 **Add index** on `user_id` and `read_at`
4. 🔲 **Cache unread count** (refresh on change)
5. 🔲 **Queue notification creation** for bulk sends

---

## 🚀 Future Enhancements

### Search
- [ ] Laravel Scout integration (Algolia/Meilisearch)
- [ ] Search history
- [ ] Saved searches
- [ ] Fuzzy matching
- [ ] Advanced query syntax
- [ ] Search analytics

### Notifications
- [ ] Real-time updates (WebSockets)
- [ ] Header bell icon with dropdown
- [ ] Email notifications
- [ ] Push notifications
- [ ] Notification preferences
- [ ] Rich notifications (images, actions)
- [ ] Notification grouping
- [ ] Mute notifications

---

## 📞 Support & Documentation

### Full Documentation
- `docs/SEARCH_IMPLEMENTED.md` - Complete search guide
- `docs/NOTIFICATIONS_IMPLEMENTED.md` - Complete notifications guide
- `docs/PHASE_4_PROGRESS_REPORT.md` - Implementation status
- `docs/SESSION_SUMMARY_FEB_3_2026.md` - Session summary

### Code Locations
- **Search:** `app/Http/Controllers/SearchController.php`
- **Search Page:** `resources/js/pages/search/index.tsx`
- **Notifications:** `app/Http/Controllers/NotificationController.php`
- **Notifications Page:** `resources/js/pages/notifications/index.tsx`

---

**Quick Reference Guide - Phase 4 Features**  
**Created:** February 3, 2026  
**Version:** 1.0

