    # Figma Design Specification - Structured Documentation System

## 🎨 Design System Overview

This document outlines the complete UI/UX requirements for the Structured Documentation System Figma designs.

---

## 🎯 Design Principles

1. **Clean & Minimal** - Focus on content, reduce clutter
2. **Consistent** - Reuse components, maintain patterns
3. **Accessible** - WCAG AA compliance, keyboard navigation
4. **Responsive** - Mobile-first approach (though desktop is primary)
5. **Collaborative** - Real-time indicators, presence awareness
6. **Gamified** - Subtle rewards, progress indicators

---

## 🎨 Design Tokens

### Color Palette

```
Primary Colors:
  - Primary: #3B82F6 (Blue)
  - Primary Dark: #1D4ED8
  - Primary Light: #DBEAFE

Semantic Colors:
  - Success: #10B981 (Green)
  - Warning: #F59E0B (Amber)
  - Error: #EF4444 (Red)
  - Info: #06B6D4 (Cyan)

Status Colors:
  - Draft: #94A3B8 (Gray)
  - Pending Review: #F59E0B (Amber)
  - Published: #10B981 (Green)
  - Completed: #8B5CF6 (Purple)
  - Stale: #EF4444 (Red)
  - Archived: #64748B (Dark Gray)

Neutral Colors:
  - Gray 50: #F9FAFB
  - Gray 100: #F3F4F6
  - Gray 200: #E5E7EB
  - Gray 300: #D1D5DB
  - Gray 400: #9CA3AF
  - Gray 500: #6B7280
  - Gray 600: #4B5563
  - Gray 700: #374151
  - Gray 800: #1F2937
  - Gray 900: #111827

Grade Colors (Gamification):
  - S Grade: #FFD700 (Gold)
  - A Grade: #C0C0C0 (Silver)
  - B Grade: #CD7F32 (Bronze)
  - C Grade: #60A5FA (Blue)
  - D Grade: #A78BFA (Purple)
  - F Grade: #F87171 (Red)
```

### Typography

```
Font Family: Inter (Primary), JetBrains Mono (Code)

Headings:
  - H1: 36px / 500 / -0.02em
  - H2: 30px / 500 / -0.01em
  - H3: 24px / 500 / -0.01em
  - H4: 20px / 500 / 0em
  - H5: 16px / 500 / 0em

Body:
  - Large: 18px / 400 / 0em
  - Base: 16px / 400 / 0em
  - Small: 14px / 400 / 0em
  - XSmall: 12px / 400 / 0.01em

Special:
  - Code: JetBrains Mono 14px / 400
  - Caption: 12px / 500 / 0.05em (uppercase)
```

### Spacing Scale
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

### Border Radius
```
- Small: 4px (buttons, inputs)
- Medium: 8px (cards)
- Large: 12px (modals, panels)
- XLarge: 16px (hero sections)
- Full: 9999px (pills, avatars)
```

### Shadows
```
- xs: 0 1px 2px rgba(0, 0, 0, 0.05)
- sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
- md: 0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.05)
- lg: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
- xl: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)
```

---

## 📱 Responsive Breakpoints

```
- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px - 1279px
- Large Desktop: 1280px+
```

---

## 🧩 Component Library

### 1. Avatars

**User Avatar**
- Sizes: 24px, 32px, 40px, 48px, 64px, 96px
- States: Default, Online (green dot), Editing (yellow ring), Offline
- Fallback: Initials with colored background (based on user ID hash)
- Image: Rounded full, border 2px white

**Group Avatar**
- Stack up to 3 avatars
- Show "+N more" badge for > 3 users
- Overlap: -8px

### 2. Badges & Pills

**Status Badge**
- Variants: Draft, Pending, Published, Completed, Stale, Archived
- Size: Small (h-6), Medium (h-7), Large (h-8)
- Format: Icon + Text or Text only
- Border radius: Full

**Score Badge**
- Display: Score number with background color (gradient for high scores)
- Icon: ⭐ Star or 📊 Chart
- Variants: 
  - Low (0-40): Red
  - Medium (41-70): Yellow
  - High (71-100): Green

**Grade Badge**
- Large circular badge with grade letter (S, A, B, C, D, F)
- Gradient background based on grade
- Shadow: lg
- Size: 48px - 96px

**Notification Badge**
- Small red circle with count
- Position: Top-right of parent
- Max count: 99+

### 3. Buttons

**Primary Button**
- Background: Primary color
- Hover: Primary Dark
- Active: Darker + scale(0.98)
- Disabled: opacity-50, cursor-not-allowed
- Loading: Spinner animation
- Sizes: sm (h-8), md (h-10), lg (h-12)

**Secondary Button**
- Border: 1px solid Gray 300
- Background: White
- Hover: Gray 50

**Ghost Button**
- No border, no background
- Hover: Gray 100

**Icon Button**
- Square or Circle
- Sizes: 32px, 40px, 48px
- Icon only, no text

**Button with Icon**
- Icon left or right of text
- Gap: 8px

### 4. Input Fields

**Text Input**
- Height: 40px
- Border: 1px solid Gray 300
- Focus: Border Primary + ring
- Error: Border red + error message below
- Icon: Can have left/right icon
- Placeholder: Gray 400

**Textarea**
- Min height: 100px
- Resizable vertically
- Same styles as text input

**Rich Text Editor**
- Toolbar: Floating or fixed top
- Formatting: Bold, Italic, Underline, Code, Link
- Lists: Bullet, Numbered
- Headings: H1-H3
- Insert: Image, Code block, Table
- Mentions: @username autocomplete
- Presence: Show active cursors with user names

**Select Dropdown**
- Custom styled (not native)
- Search: For > 10 options
- Multi-select: Show selected as chips
- Group options: With headers

**Checkbox & Radio**
- Size: 20px
- Checked: Primary color fill
- Indeterminate: Dash for checkbox
- Label: 16px regular, clickable

**Toggle Switch**
- Width: 44px, Height: 24px
- Thumb: 20px circle
- On: Primary color
- Off: Gray 300

**Date Picker**
- Calendar popup
- Range selection support
- Time picker variant

**File Upload**
- Drag & drop zone
- File list with preview
- Progress bar for uploads
- Size limit indicator

### 5. Cards

**Document Card**
- Thumbnail: 16:9 ratio, fallback gradient
- Title: H4, truncate 2 lines
- Description: Body small, truncate 3 lines
- Metadata: Author, date, category, score
- Footer: View count, comment count, reaction count
- Hover: Lift up with shadow
- Quick actions: Bookmark, Share (show on hover)

**User Card**
- Avatar: 64px
- Name: H5 bold
- Role/Bio: Small text
- Stats: Docs written, Score, Rank
- Follow button
- Link to profile

**Section Card**
- Section title
- Completeness bar
- Last edited by + timestamp
- Edit button (if has permission)
- Expand/collapse icon

**Stat Card**
- Large number (metric)
- Label below
- Icon or graph
- Trend indicator (up/down arrow + percentage)
- Optional: Sparkline chart

### 6. Lists & Tables

**Document List Item**
- Checkbox (for bulk actions)
- Icon/Thumbnail (48px)
- Title + description
- Metadata badges
- Actions menu (three dots)
- Hover: Background gray-50

**Table**
- Sortable columns (click header)
- Filterable columns
- Sticky header
- Row hover: Background gray-50
- Row selection: Checkbox
- Pagination: Bottom right
- Actions: Per row + bulk actions
- Empty state: Icon + message

**Leaderboard List**
- Rank number (large, bold)
- User avatar + name
- Score (prominent)
- Grade badge
- Trend indicator
- Expandable: Show detailed stats

### 7. Modals & Dialogs

**Modal**
- Overlay: Dark semi-transparent
- Container: White, rounded-lg, shadow-xl
- Max width: 600px (sm), 900px (lg)
- Header: Title + close button
- Body: Scrollable if needed
- Footer: Action buttons (Cancel + Confirm)

**Confirmation Dialog**
- Small modal (400px)
- Warning icon if destructive
- Clear message
- Two buttons: Cancel (secondary) + Confirm (primary or danger)

**Drawer (Side Panel)**
- Slide from right
- Full height
- Width: 480px - 600px
- Use for: Filters, Details, Comments
- Close: X button + click outside

### 8. Navigation

**Top Navigation Bar**
- Height: 64px
- Background: White, border-bottom
- Left: Logo + main nav links
- Right: Search, Notifications, User menu
- Sticky on scroll

**Sidebar Navigation**
- Width: 240px (collapsed: 64px)
- Background: Gray 50 or White
- Items: Icon + label
- Active: Primary color background
- Collapsible: Toggle button

**Breadcrumbs**
- Home > Category > Document
- Separator: / or >
- Last item: Not clickable, bold
- Color: Gray 600
- Hover: Primary color

**Tabs**
- Underline style (active has bottom border)
- Pills style (active has background)
- Count badge: Show counts per tab
- Scrollable: For many tabs

### 9. Feedback & Notifications

**Toast Notification**
- Position: Top-right
- Auto-dismiss: 5 seconds
- Types: Success, Error, Warning, Info
- Icon + message
- Close button
- Stack: Multiple toasts
- Animation: Slide in from right

**Alert Banner**
- Full width
- Types: Info, Warning, Error, Success
- Icon + message + action button
- Dismissible: X button
- Position: Top of content area

**Progress Bar**
- Linear: For uploads, processing
- Circular: For loading states
- Indeterminate: When duration unknown
- With percentage label

**Loading Skeleton**
- Animated pulse
- Match layout of actual content
- Use for: Cards, Lists, Text blocks

**Empty State**
- Large icon (64px - 96px)
- Message: No items found
- Subtext: Suggestion or next action
- CTA button: Create first item
- Illustration optional

### 10. Special Components

**Collaborative Editor Presence**
- Cursor: User avatar + name in tooltip
- Selection: Highlighted with user color
- Typing indicator: "User is typing..." with animation
- Active users list: Avatars in header

**Comment Thread**
- Parent comment + nested replies
- Avatar + name + timestamp
- Markdown support
- Actions: Reply, Edit, Delete, Resolve
- Mentions: Highlighted @username
- Reactions: Emoji picker

**Inline Comment Marker**
- Icon: 💬 in margin
- Count: Number of comments
- Hover: Show preview
- Click: Open comment thread

**Version Diff Viewer**
- Side-by-side or unified view
- Additions: Green background
- Deletions: Red background
- Line numbers
- Expand context

**Score Breakdown**
- Donut chart or radial progress
- Legend: Category + points
- Total in center
- Color-coded segments

**Leaderboard Podium**
- Top 3 users
- Gold, Silver, Bronze platforms
- Large avatars
- Scores displayed
- Animated entrance

**Achievement Badge Display**
- Grid or carousel
- Locked vs unlocked states
- Tooltip: How to earn
- Progress bar for incomplete

**Search Bar**
- Width: Expands on focus
- Icon: 🔍 Magnifying glass
- Placeholder: "Search documents..."
- Keyboard shortcut: Cmd+K or Ctrl+K
- Autocomplete: Suggested results
- Recent searches

**Filter Panel**
- Collapsible sections
- Checkboxes for multi-select
- Date range picker
- Score range slider
- Active filters: Show as chips
- Clear all button

**Pagination**
- Page numbers: 1, 2, 3, ..., 10
- Previous/Next buttons
- Items per page selector
- Total count display
- Jump to page input

**Dropdown Menu**
- Trigger: Button or icon
- Menu: Positioned below or above
- Items: Icon + label
- Dividers: Between groups
- Destructive items: Red text
- Keyboard navigation

---

## 📄 Page Layouts

### A. Main Application (Custom Inertia)

#### 1. Home / Dashboard

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Nav: Logo | Docs | Leaderboard | [Search] [🔔] [👤] │
├─────────────────────────────────────────────────────────┤
│ Hero Section:                                            │
│   - Welcome message                                      │
│   - Quick stats (Total docs, Your docs, Pending reviews)│
│   - CTA: Create Document button                         │
├─────────────────────────────────────────────────────────┤
│ Recent Documents (Cards Grid 3 columns)                 │
│   ┌──────┐ ┌──────┐ ┌──────┐                            │
│   │ Doc  │ │ Doc  │ │ Doc  │                            │
│   └──────┘ └──────┘ └──────┘                            │
├─────────────────────────────────────────────────────────┤
│ Trending This Week (Cards Grid 3 columns)               │
├─────────────────────────────────────────────────────────┤
│ Your Activity Timeline (Sidebar right 30%)              │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Quick stat cards
- Document cards (grid)
- Activity timeline
- Create document FAB (floating action button)

#### 2. Documents List

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Nav                                                  │
├───────┬─────────────────────────────────────────────────┤
│Filter │ Search Bar                                       │
│Panel  ├─────────────────────────────────────────────────┤
│       │ Sort: [Most Recent ▼] View: [⊞] [☰]             │
│       ├─────────────────────────────────────────────────┤
│       │ Active Filters: [Category: Tech ✕] [Clear All]  │
│       ├─────────────────────────────────────────────────┤
│       │ Documents (Grid or List view)                    │
│       │ ┌────────┐ ┌────────┐ ┌────────┐                │
│       │ │  Doc   │ │  Doc   │ │  Doc   │                │
│       │ └────────┘ └────────┘ └────────┘                │
│       │                                                   │
│       └───────────────────────────────────────────────────┤
│                           [Pagination]                   │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Filter panel (collapsible)
- Search + sort controls
- View toggle (grid/list)
- Document cards/rows
- Pagination

#### 3. Document Editor (Collaborative)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Bar: [Status: Draft ▼] [Save] [Publish] [👤👤👤]     │
├─────┬───────────────────────────────────┬───────────────┤
│ TOC │ Main Editor Area                  │ Right Sidebar │
│     │                                   │               │
│ 1.  │ ┌─────────────────────────────┐   │ Active Users  │
│ Intro│ │ Rich Text Editor            │   │ - User1       │
│     │ │                             │   │ - User2       │
│ 2.  │ │ [User cursor here]          │   │               │
│ Setup│ │                             │   │ Comments (5)  │
│     │ │                             │   │ ┌───────────┐ │
│ 3.  │ └─────────────────────────────┘   │ │ Comment 1 │ │
│ Usage│                                   │ └───────────┘ │
│     │ Section: Introduction             │               │
│     │ ┌─────────────────────────────┐   │ Metadata      │
│     │ │ Title: [Input field]        │   │ - Owner       │
│     │ │ Description: [Textarea]     │   │ - Category    │
│     │ └─────────────────────────────┘   │ - Tags        │
│     │                                   │ - Score: 85   │
└─────┴───────────────────────────────────┴───────────────┘
```

**Components:**
- Table of contents (sticky)
- Rich text editor with toolbar
- Presence indicators (cursors, avatars)
- Section forms (schema-based)
- Comment panel
- Version history timeline
- Metadata panel

#### 4. Document View (Read-only)

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Nav                                                  │
├─────────────────────────────────────────────────────────┤
│ Header:                                                  │
│   Title (H1)                                             │
│   Author • Category • Published Date                     │
│   [⭐ 85 Score] [👁 123 views] [💬 5 comments]           │
│   Actions: [📋 Copy Link] [⭐ Watch] [Edit] [...]        │
├─────┬───────────────────────────────────────────────────┤
│ TOC │ Content Area (Markdown/Rich Text Rendered)        │
│     │                                                    │
│     │ Introduction                                       │
│     │ Lorem ipsum dolor sit amet...                      │
│     │                                                    │
│     │ Setup                                              │
│     │ Step 1: Install dependencies...                   │
│     │                                                    │
├─────┴───────────────────────────────────────────────────┤
│ Footer:                                                  │
│   Related Documents (Card carousel)                      │
│   Contributors (Avatar list)                             │
└─────────────────────────────────────────────────────────┘
```

**Floating Comment Sidebar (Right):**
```
┌───────────────┐
│ Comments (5)  │
│               │
│ ┌───────────┐ │
│ │ User1     │ │
│ │ Great!    │ │
│ └───────────┘ │
│               │
│ [Add comment] │
└───────────────┘
```

**Components:**
- Document header with metadata
- Action bar (watch, share, edit)
- Table of contents (sticky)
- Rendered content with syntax highlighting
- Comment markers (inline)
- Comment sidebar
- Related docs carousel
- Reaction buttons (bottom)

#### 5. Leaderboard

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Nav                                                  │
├─────────────────────────────────────────────────────────┤
│ Filters: [All Time ▼] [Department: All ▼]               │
├─────────────────────────────────────────────────────────┤
│ Top 3 Podium (Visual highlight)                          │
│        ┌───────┐                                         │
│   ┌────┤ 🥇 #1 ├────┐                                   │
│   │🥈 #2 │ 850pts │ 🥉 #3│                               │
│   └─────┴───────┴────┘                                   │
├─────────────────────────────────────────────────────────┤
│ Rank  User          Docs  Reviews  Score  Grade  Trend  │
│ ───────────────────────────────────────────────────────│
│  4    User4   [👤]   15     8      720     A     ↑ +2   │
│  5    User5   [👤]   12     5      680     B     ↓ -1   │
│  6    You     [👤]   10     3      650     B     → 0    │
│ ...                                                      │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Filter controls
- Podium display (top 3)
- Leaderboard table
- Rank badges
- Grade indicators
- Trend arrows
- User profile links

#### 6. User Profile

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Nav                                                  │
├─────────────────────────────────────────────────────────┤
│ Profile Header:                                          │
│   [Avatar 96px] User Name                                │
│                 Role • Joined Jan 2026                   │
│                 [Follow] [Message]                       │
│                                                          │
│   Stats Row: [15 Docs] [8 Reviews] [720 Score] [A Grade]│
├─────────────────────────────────────────────────────────┤
│ Tabs: [Written Docs] [Reviewed] [Edited] [Viewed]       │
├─────────────────────────────────────────────────────────┤
│ Tab Content (Documents List)                             │
│ ┌────────┐ ┌────────┐ ┌────────┐                        │
│ │  Doc   │ │  Doc   │ │  Doc   │                        │
│ └────────┘ └────────┘ └────────┘                        │
├─────────────────────────────────────────────────────────┤
│ Activity Timeline (Right sidebar 30%)                    │
│   • Published "API Guide" - 2h ago                       │
│   • Reviewed "Setup" - 1d ago                            │
│   • Earned "Contributor" badge - 2d ago                  │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- Profile header with avatar
- Stats cards
- Follow/Message buttons
- Tabs navigation
- Document grid/list
- Activity timeline
- Achievement badges section

#### 7. Search Results

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ Top Nav with Search: [query____________] [Search]       │
├───────┬─────────────────────────────────────────────────┤
│Filters│ Results for "authentication" (42 found)          │
│       ├─────────────────────────────────────────────────┤
│       │ Sort: [Relevance ▼]                             │
│       ├─────────────────────────────────────────────────┤
│       │ ┌─────────────────────────────────────────────┐ │
│       │ │ Doc Title with keyword highlighted          │ │
│       │ │ ...description with keyword match...        │ │
│       │ │ Category • Author • Score                   │ │
│       │ └─────────────────────────────────────────────┘ │
│       │                                                  │
│       │ ┌─────────────────────────────────────────────┐ │
│       │ │ Another Result...                           │ │
│       │ └─────────────────────────────────────────────┘ │
└───────┴─────────────────────────────────────────────────┘
```

**Components:**
- Enhanced search bar
- Faceted filters
- Result cards with highlights
- Pagination
- Save search button

#### 8. Create Document Flow

**Step 1: Basic Info**
```
┌─────────────────────────────────────────────────────────┐
│ Create New Document - Step 1/3                          │
├─────────────────────────────────────────────────────────┤
│ Title: [_____________________________]                   │
│                                                          │
│ Description: [__________________________]                │
│              [__________________________]                │
│                                                          │
│ Category: [Select category ▼]                           │
│                                                          │
│ Structure: [Select structure ▼]                         │
│                                                          │
│ Tags: [Add tags...] [tag1 ✕] [tag2 ✕]                   │
│                                                          │
│ Visibility: ( ) Public (•) Private ( ) Team              │
│                                                          │
│                            [Cancel] [Next →]             │
└─────────────────────────────────────────────────────────┘
```

**Step 2: Branches (Optional)**
```
┌─────────────────────────────────────────────────────────┐
│ Create New Document - Step 2/3                          │
├─────────────────────────────────────────────────────────┤
│ Related Branches (Optional)                              │
│                                                          │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Task ID: [PROJ-1234____]                            │ │
│ │ Task Title: [Feature implementation]                │ │
│ │ Branch: [feature/auth-system___]                    │ │
│ │ MR/PR URL: [https://gitlab.com/...]                 │ │
│ │                                       [✕ Remove]    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                          │
│ [+ Add Another Branch]                                   │
│                                                          │
│                       [← Back] [Skip] [Next →]           │
└─────────────────────────────────────────────────────────┘
```

**Step 3: Schema Form**
```
┌─────────────────────────────────────────────────────────┐
│ Create New Document - Step 3/3                          │
├─────────────────────────────────────────────────────────┤
│ Fill Required Sections                                   │
│                                                          │
│ Section 1: Introduction ✓                                │
│   Title: [Filled_____________]                           │
│   Description: [Filled__________]                        │
│                                                          │
│ Section 2: Setup ⚠️ (Required)                           │
│   Prerequisites: [____________]                          │
│   Steps: [_____________________]                         │
│                                                          │
│ Section 3: Usage ⚠️ (Required)                           │
│   Examples: [__________________]                         │
│                                                          │
│ Completeness: [████████░░] 80%                           │
│                                                          │
│                       [← Back] [Save Draft] [Create]     │
└──────────────────────���──────────────────────────────────┘
```

**Components:**
- Multi-step form with progress
- Validation indicators
- Completeness bar
- Dynamic schema-based fields

---

### B. Admin Panel (Filament)

*Note: Filament auto-generates most UI, but you should customize the theme*

#### Custom Admin Pages Needed:

1. **Dashboard**
   - Total documents chart (line graph)
   - Documents by status (donut chart)
   - Active users today (number)
   - Average document score (gauge)
   - Recent activity feed

2. **Schema Builder** (Custom Filament Page)
   - Left: Structure list
   - Right: Section builder (drag-drop)
   - Item builder: Form with field type selector

3. **Integration Status**
   - Service cards (Confluence, Jira, GitLab)
   - Connection status (green/red indicator)
   - Last sync time
   - Sync logs table

4. **System Settings**
   - Approval threshold slider
   - Outdated rules configuration
   - Email templates editor
   - Notification settings

---

## 🎬 Animations & Interactions

### Micro-interactions
- **Button hover**: Slight scale (1.02) + shadow increase
- **Card hover**: Lift with shadow (translateY -2px)
- **Checkbox check**: Checkmark draw animation
- **Toggle switch**: Smooth slide with spring
- **Modal open**: Fade in overlay + scale up content
- **Toast**: Slide in from right
- **Loading**: Skeleton pulse or spinner

### Page Transitions
- **Page change**: Fade out → Fade in (200ms)
- **Tab switch**: Slide left/right (150ms)
- **Drawer open**: Slide from right (250ms)

### Collaborative Indicators
- **User joins**: Avatar bounces in
- **Typing**: Animated dots "..."
- **Cursor move**: Smooth follow with name tag
- **Selection**: Highlight with user color + pulse

---

## 📐 Layout Templates

### Template 1: Full Width
```
┌─────────────────────────────────┐
│        Top Navigation            │
├─────────────────────────────────┤
│                                  │
│         Main Content             │
│         (Full Width)             │
│                                  │
└─────────────────────────────────┘
```

### Template 2: Sidebar + Content
```
┌───┬─────────────────────────────┐
│Top│     Navigation              │
├───┼─────────────────────────────┤
│ S │                             │
│ i │      Main Content           │
│ d │                             │
│ e │                             │
│ b │                             │
│ a │                             │
│ r │                             │
└───┴─────────────────────────────┘
```

### Template 3: Editor Layout
```
┌─────────────────────────────────┐
│        Top Toolbar               │
├────┬───────────────┬─────────────┤
│ T  │               │             │
│ O  │    Editor     │   Sidebar   │
│ C  │               │   (Meta)    │
│    │               │             │
└────┴───────────────┴─────────────┘
```

### Template 4: Dashboard
```
┌─────────────────────────────────┐
│        Top Navigation            │
├─────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐    │
│  │Stat│ │Stat│ │Stat│ │Stat│    │
│  └────┘ └────┘ └────┘ └────┘    │
├──────────────────┬──────────────┤
│                  │              │
│   Main Chart     │  Activity    │
│                  │   Feed       │
│                  │              │
└──────────────────┴──────────────┘
```

---

## ✅ Figma File Structure

Organize your Figma file like this:

```
📁 Structured Documentation System
├── 📄 Cover Page (Project overview)
├── 📄 Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 📄 Components
│   ├── Avatars
│   ├── Badges & Pills
│   ├── Buttons
│   ├── Inputs
│   ├── Cards
│   ├── Lists
│   ├── Modals
│   ├── Navigation
│   └── Special Components
├── 📄 Page Layouts
│   ├── Home/Dashboard
│   ├── Documents List
│   ├── Document Editor
│   ├── Document View
│   ├── Leaderboard
│   ├── User Profile
│   ├── Search Results
│   └── Create Document Flow
├── 📄 Mobile Views (Optional)
└── 📄 Developer Handoff Notes
```

---

## 🚀 Next Steps for Designer

1. **Create Design Tokens** - Set up color styles, text styles, effects
2. **Build Component Library** - Create all reusable components
3. **Design Key Pages** - Start with Home, Documents List, Editor
4. **Add Interactions** - Prototype key flows (create doc, edit, comment)
5. **Responsive Variants** - Design mobile/tablet views
6. **Developer Handoff** - Add specs, export assets, share Figma link

---

## 📦 Assets to Export

- Logo (SVG)
- Icons (SVG, 24px, 48px)
- Illustrations for empty states (SVG)
- Avatar placeholders
- Default document thumbnails
- Badge images (achievements)

---

## 🎯 Design Priorities

**Must Have (MVP):**
1. Home/Dashboard
2. Documents List
3. Document Editor (with schema form)
4. Document View
5. Leaderboard
6. User Profile
7. Components Library

**Nice to Have:**
8. Mobile views
9. Advanced search
10. Admin panel customization
11. Detailed animations

---

This specification should give your designer everything they need to create a complete, consistent design system in Figma! 🎨
