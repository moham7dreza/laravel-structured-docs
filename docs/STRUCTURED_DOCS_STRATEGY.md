# Structured Documentation System - Strategic Implementation Plan

## Executive Summary

Based on your requirements, I recommend building this as a **standalone Laravel 12 application** using a **dual admin approach**: Filament v4 for backend administration and custom Inertia components for editor-facing workflows.

---

## 🎯 Architecture Decision

### ✅ RECOMMENDED: Standalone Laravel Application

**Why NOT a package?**
- Too complex with UI, admin panel, real-time features, and external integrations
- Packages are better for reusable libraries, not full-featured applications
- You need migrations, routes, controllers, views, and background jobs

**Why NOT extend BookStack?**
- BookStack doesn't have schema enforcement, gamification, or section-level permissions
- Refactoring BookStack's codebase would be harder than building custom
- Your requirements are fundamentally different from BookStack's wiki approach

**Why Standalone App?** ✅
- Full control over architecture and features
- Easier to maintain and extend
- Better integration with your existing Laravel ecosystem
- Can still sync with Confluence bidirectionally

---

## 🏗️ Technical Architecture

### Admin Panel Strategy: Dual Approach

#### 1. **Filament v4** for System Administration (`/admin` route)
**Use Filament for:**
- ✅ Schema/Structure Builder (Categories → Structures → Sections → Items)
- ✅ User Management & Roles
- ✅ System Configuration (approval thresholds, outdated rules, penalties)
- ✅ Integration Settings (Confluence, Jira, GitLab credentials)
- ✅ Activity Logs & Audit Trails
- ✅ Batch Operations (bulk doc status changes, score recalculations)

**Why Filament?**
- Rapid development of complex CRUD interfaces
- Built-in relationship management
- Powerful table filters, bulk actions, and form builders
- Perfect for admin-only operations
- Strong community and Laravel integration

#### 2. **Custom Inertia v2 Components** for Editor Workflows
**Use Inertia for:**
- ✅ Document Creation & Editing
- ✅ Collaborative Live Editing
- ✅ Gamification Dashboard & Leaderboard
- ✅ User Profiles & Performance Metrics
- ✅ Document Viewing & Commenting
- ✅ Search & Discovery

**Why Custom Inertia?**
- Maintains consistency with existing UI/UX
- Better control over collaborative editing experience
- Type-safe routing with Wayfinder
- Seamless integration with your existing components
- Better performance for real-time features

---

## 📊 Database Design - Enhanced Schema

### Core Improvements to Your Schema

#### ✅ What's Good:
- Solid foundation with users, documents, categories
- Good separation of structures and sections
- Proper pivot tables for many-to-many

#### 🔧 Recommended Enhancements:

```sql
-- Add to documents table
ALTER TABLE documents ADD COLUMN
    published_at TIMESTAMP NULL,
    first_published_at TIMESTAMP NULL,
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approval_threshold_score INT DEFAULT 0,
    view_count INT UNSIGNED DEFAULT 0,
    comment_count INT UNSIGNED DEFAULT 0,
    reaction_count INT UNSIGNED DEFAULT 0;

-- Missing critical tables:

-- Approval Workflow
CREATE TABLE document_approvals (
    id BIGINT PRIMARY KEY,
    document_id BIGINT,
    reviewer_id BIGINT,
    status ENUM('pending', 'approved', 'rejected'),
    score INT,
    reason TEXT,
    approved_at TIMESTAMP NULL,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Collaborative Editing Sessions
CREATE TABLE editing_sessions (
    id BIGINT PRIMARY KEY,
    document_id BIGINT,
    user_id BIGINT,
    section_id BIGINT NULL,
    started_at TIMESTAMP,
    ended_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Integration Sync Logs
CREATE TABLE integration_sync_logs (
    id BIGINT PRIMARY KEY,
    document_id BIGINT,
    service ENUM('confluence', 'jira', 'gitlab'),
    external_id VARCHAR(255),
    sync_type ENUM('push', 'pull'),
    status ENUM('success', 'failed', 'conflict'),
    error_message TEXT NULL,
    synced_at TIMESTAMP
);

-- Leaderboard Cache
CREATE TABLE leaderboard_cache (
    user_id BIGINT PRIMARY KEY,
    total_score INT DEFAULT 0,
    rank INT,
    docs_written INT DEFAULT 0,
    docs_reviewed INT DEFAULT 0,
    penalties_received INT DEFAULT 0,
    last_calculated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notification Settings
CREATE TABLE notification_settings (
    id BIGINT PRIMARY KEY,
    user_id BIGINT,
    channel ENUM('email', 'telegram', 'in_app'),
    event_type VARCHAR(100), -- 'doc_assigned', 'review_request', etc.
    is_enabled BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔗 Integration Strategy

### External Service Integrations

#### 1. **Confluence Sync** (Bidirectional)
```
Flow:
1. User creates doc in your system → Auto-create Confluence page
2. User edits Confluence → Webhook updates your system
3. Store mapping in external_links table
4. Use Confluence REST API v2
5. Handle conflicts with "last write wins" + notification
```

#### 2. **Jira Integration** (Validation & Linking)
```
Flow:
1. Document branches reference Jira task IDs
2. Validate task exists via Jira API
3. Auto-mark docs as outdated when Jira task status = "Done"
4. Link Jira comments to doc discussions
5. Use Jira webhooks for real-time updates
```

#### 3. **GitLab Integration** (MR Tracking)
```
Flow:
1. Track GitLab MR URLs in document branches
2. Auto-update when MR is merged (webhook)
3. Trigger outdated detection if doc not updated after merge
4. Import GitLab wiki pages as docs
5. Use GitLab API v4
```

### Implementation Pattern

```php
// app/Services/Integrations/IntegrationContract.php
interface IntegrationContract {
    public function sync(Document $document): SyncResult;
    public function pull(string $externalId): ?Document;
    public function push(Document $document): string; // returns external ID
    public function handleWebhook(array $payload): void;
}

// app/Services/Integrations/ConfluenceService.php
class ConfluenceService implements IntegrationContract {
    // Implementation using Guzzle HTTP client
}
```

---

## ⚡ Real-time Collaboration

### Technology Choice: **Laravel Reverb + Yjs**

**Laravel Reverb** (Official Laravel WebSocket server)
- First-party Laravel solution
- Simple setup with Artisan commands
- Integrates with Laravel Broadcasting

**Yjs** (Collaborative editing CRDT)
- Conflict-free replicated data type
- Handles offline editing
- Proven technology (used by Notion, Figma)

### Implementation Flow

```
1. User opens document → Connect to Reverb WebSocket
2. Load Yjs document state from database
3. Show active users with presence cursors
4. Broadcast changes via Reverb channels
5. Yjs auto-merges conflicts
6. Save snapshots to document_section_items table every 30s
7. Track line-level changes in document_changes table
```

---

## 🎮 Gamification & Scoring System

### Score Calculation Logic

```php
// app/Services/QualityScoreCalculator.php
class QualityScoreCalculator {
    public function calculate(Document $doc): int {
        $score = 0;
        
        // Completeness (40 points)
        $score += $this->calculateCompleteness($doc) * 40;
        
        // Freshness (20 points)
        $score += $this->calculateFreshness($doc) * 20;
        
        // Engagement (20 points)
        $score += $this->calculateEngagement($doc) * 20;
        
        // Review scores (20 points)
        $score += $this->averageReviewScore($doc) * 20;
        
        // Penalties
        $score -= $this->calculatePenalties($doc);
        
        return max(0, $score); // Never go below 0
    }
}
```

### Publishing Approval Logic (Configurable)

```php
// config/documentation.php
return [
    'approval' => [
        'min_score' => 70,
        'min_reviewers' => 2,
        'min_completeness' => 0.8, // 80% of required fields
        'auto_approve_threshold' => 90, // Auto-approve if score > 90
    ],
];
```

### Leaderboard Ranking

```php
// Recalculated via scheduled job daily
// app/Console/Commands/RecalculateLeaderboard.php
```

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Install Filament v4
- [ ] Create all database migrations with proper indexes
- [ ] Set up models with relationships
- [ ] Create factories and seeders
- [ ] Build basic Filament admin (users, categories)

### Phase 2: Schema System (Weeks 3-4)
- [ ] Build Structure/Section/Item CRUD in Filament
- [ ] Implement JSON schema builder
- [ ] Create SchemaValidator service
- [ ] Build dynamic form renderer in Inertia
- [ ] Add schema enforcement validation

### Phase 3: Document Management (Weeks 5-6)
- [ ] Document CRUD in Inertia
- [ ] Editor/Reviewer assignment
- [ ] Section-level permissions
- [ ] Version control and history
- [ ] File attachments

### Phase 4: Collaboration (Weeks 7-8)
- [ ] Install Laravel Reverb
- [ ] Integrate Yjs for collaborative editing
- [ ] Implement presence indicators
- [ ] Build commenting system with mentions
- [ ] Add inline comments

### Phase 5: Integrations (Weeks 9-10)
- [ ] Build Confluence service
- [ ] Build Jira service
- [ ] Build GitLab service
- [ ] Implement webhook handlers
- [ ] Add sync UI in Filament admin

### Phase 6: Gamification (Weeks 11-12)
- [ ] Quality score calculator
- [ ] Outdated detection scheduler
- [ ] Penalty system
- [ ] Leaderboard UI
- [ ] User performance dashboard
- [ ] Achievement badges

### Phase 7: Advanced Features (Weeks 13-14)
- [ ] Advanced search (Meilisearch/Algolia)
- [ ] Custom notification channels (Telegram)
- [ ] Approval workflow
- [ ] Analytics dashboard
- [ ] Export/Import functionality

### Phase 8: Polish & Testing (Weeks 15-16)
- [ ] Comprehensive Pest tests
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] User training materials

---

## 📐 Figma Design Requirements

### Page Structure

#### Admin Panel (Filament - Auto-generated, just customize theme)
1. **Dashboard** - System overview
2. **Structures** - Schema builder
3. **Categories** - Category management
4. **Users** - User & role management
5. **Settings** - System configuration
6. **Integrations** - External service config
7. **Activity Log** - Audit trail

#### Main Application (Custom Inertia - Need Figma Designs)
1. **Home/Dashboard**
   - Recent documents
   - Quick stats
   - Trending docs

2. **Document List**
   - Search bar with filters
   - Sort options (date, score, views)
   - Card/List view toggle
   - Status badges

3. **Document Editor**
   - Left sidebar: Structure navigation
   - Center: Collaborative editor with schema-guided form
   - Right sidebar: 
     - Active users (presence)
     - Comments
     - Metadata (owner, reviewers, scores)
     - Version history
   - Top bar: Status, publish button, share

4. **Document View** (Read-only)
   - Clean reading view
   - Table of contents
   - Comments sidebar
   - Reactions
   - Related docs

5. **Leaderboard**
   - Top contributors table
   - Filters (time period, department)
   - User cards with avatars
   - Score breakdown

6. **User Profile**
   - Stats overview
   - Written docs
   - Reviewed docs
   - Edited docs
   - Achievements/Badges
   - Activity timeline

7. **Search Results**
   - Faceted filters (category, tags, author, date)
   - Results with highlights
   - Save search functionality

### Design System Components Needed

- [ ] Document card (grid/list variants)
- [ ] User avatar with presence indicator
- [ ] Score badge/pill
- [ ] Status badge (draft, published, stale, etc.)
- [ ] Section editor component
- [ ] Comment thread component
- [ ] Inline comment marker
- [ ] Version diff viewer
- [ ] Achievement badge
- [ ] Leaderboard row
- [ ] Schema form builder preview
- [ ] Collaborative cursor (with user color)
- [ ] Notification toast
- [ ] Modal dialogs
- [ ] Empty states
- [ ] Loading skeletons

---

## 🔐 Security Considerations

1. **Section-level Permissions** - Use Laravel Policies
2. **XSS Prevention** - Sanitize rich text with HTMLPurifier
3. **API Rate Limiting** - For external integrations
4. **CSRF Protection** - Laravel default
5. **Input Validation** - Form Requests everywhere
6. **SQL Injection** - Use Eloquent/Query Builder (never raw)
7. **File Upload Security** - Validate MIME types, scan for malware
8. **WebSocket Authentication** - Signed channel names

---

## 📊 Performance Optimization

1. **Database Indexes** - On all foreign keys, searchable fields
2. **Query Optimization** - Eager load relationships, avoid N+1
3. **Caching** - Cache leaderboard, frequently accessed docs
4. **Queue Jobs** - Sync operations, score calculations, email sending
5. **CDN** - For attachments and images
6. **Redis** - For real-time features, cache, queues
7. **Meilisearch/Algolia** - For full-text search

---

## 💰 Estimated Development Time

- **Total**: 16 weeks (4 months) for MVP
- **Team**: 2-3 developers (1 backend, 1 frontend, 1 part-time for integrations)
- **Post-MVP**: Ongoing maintenance and feature additions

---

## ✅ Next Steps

1. **Review this strategy document** - Approve or request changes
2. **I'll create the enhanced ER diagram** - Visual database schema
3. **I'll set up the initial project structure** - Migrations, models, Filament installation
4. **You create Figma designs** - Based on component list above
5. **We begin Phase 1 implementation** - Foundation work

---

## 🤔 Questions for You

1. Do you want me to create a detailed ER diagram now?
2. Should I start implementing the database migrations immediately?
3. Do you have existing Confluence/Jira/GitLab instances we can test against?
4. What's your preferred deployment environment? (AWS, DigitalOcean, self-hosted?)
5. Do you need help with Figma design or do you have a designer?

Let me know which parts you'd like me to start building first! 🚀
