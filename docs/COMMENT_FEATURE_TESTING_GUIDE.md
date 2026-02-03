# Comment Feature Testing Guide

## Overview
The comment feature allows users to:
- Post comments on documents
- Reply to comments (threaded discussions)
- Mention other users (@username)
- Post inline comments on specific document sections
- Edit and delete their own comments
- Resolve/unresolve comments (for document owners)

## Prerequisites
1. Ensure you're logged in as a user
2. Have at least one published document in the database
3. Have multiple users for testing mentions

## Testing Steps

### 1. Basic Comment Posting

#### Access a Document
1. Navigate to the documents page: `http://127.0.0.1:8000/documents`
2. Click on any document to open its detail page
3. Scroll down to the "Comments" section at the bottom

#### Post a Comment
1. Click the "Add Comment" button
2. A rich text editor will appear
3. Type your comment (you can use formatting):
   - **Bold** text
   - *Italic* text
   - Headings
   - Lists
   - Links
4. Click "Post Comment"
5. Your comment should appear immediately below

**Expected Result:**
- Comment appears with your avatar and name
- Timestamp shows "just now"
- Comment counter increments

---

### 2. Reply to Comments

#### Reply to an Existing Comment
1. Find any comment in the list
2. Click the "Reply" button under the comment
3. A reply form appears
4. Type your reply in the editor
5. Click "Post Comment"

**Expected Result:**
- Reply appears nested under the parent comment
- Reply is indented to show the thread hierarchy
- Parent comment author gets a notification

---

### 3. Mention Users (@mentions)

#### Mention a User in a Comment
1. Click "Add Comment" or "Reply"
2. Type `@` followed by a username (e.g., `@john`)
3. Complete your message: `@john please review this section`
4. Post the comment

**Expected Result:**
- Mentioned user receives a notification
- The mention is highlighted in the comment
- User can click notification to view the comment

---

### 4. Inline Comments (Section-specific)

#### Post an Inline Comment
Inline comments are attached to specific sections of the document.

1. View a document with sections
2. Each section should have a comment icon or indicator
3. Click to add a comment on that specific section
4. The comment form appears with context about which section
5. Post your inline comment

**Expected Result:**
- Comment is attached to that specific section
- Shows in both the section and main comments area
- Other users can see which section the comment refers to

---

### 5. Edit Comments

#### Edit Your Own Comment
1. Find a comment you posted
2. Click the "Edit" button (pencil icon)
3. The comment transforms into an editor
4. Make your changes
5. Click "Save" or "Cancel"

**Expected Result:**
- Comment updates immediately
- Timestamp shows "edited"
- Mentions are re-processed if changed

**Restrictions:**
- You can only edit your own comments
- Cannot edit other users' comments

---

### 6. Delete Comments

#### Delete Your Own Comment
1. Find a comment you posted
2. Click the "Delete" button (trash icon)
3. Confirm the deletion
4. Comment is removed

**Expected Result:**
- Comment disappears from the list
- Document comment counter decrements
- Replies are also deleted

**Who Can Delete:**
- Comment author (their own comments)
- Document owner (any comment on their document)

---

### 7. Resolve/Unresolve Comments

This feature is useful for inline comments and feedback tracking.

#### Resolve a Comment (Document Owner Only)
1. As the document owner, view comments
2. Find a comment with the "Resolve" button
3. Click "Resolve"

**Expected Result:**
- Comment shows "Resolved" badge
- Comment becomes slightly faded/grayed out
- Resolved timestamp is recorded

#### Unresolve a Comment
1. Find a resolved comment
2. Click "Unresolve"

**Expected Result:**
- "Resolved" badge is removed
- Comment returns to normal appearance

**Restrictions:**
- Only document owner can resolve/unresolve comments

---

## Testing Rich Text Features

### Formatting Options
Test the following in your comments:

1. **Bold Text**: Select text and click Bold button or use `Ctrl+B`
2. **Italic Text**: Select text and click Italic or use `Ctrl+I`
3. **Headings**: Click H2 or H3 buttons
4. **Lists**: 
   - Bullet list button
   - Numbered list button
5. **Links**: 
   - Select text
   - Click link button
   - Enter URL
6. **Code**: Inline code formatting
7. **Blockquotes**: Quote button

---

## Testing Scenarios

### Scenario 1: Team Discussion
1. User A posts a comment asking a question
2. User B replies with an answer
3. User C mentions User A: "@UserA I agree with User B"
4. User A edits their original comment to add more context
5. User A resolves the comment thread

### Scenario 2: Inline Feedback
1. User views a document section
2. Posts an inline comment with feedback
3. Document owner reviews and responds
4. Owner resolves the comment once addressed

### Scenario 3: Mention Notifications
1. User A creates a comment mentioning "@UserB and @UserC"
2. Both UserB and UserC receive notifications
3. They click notifications to see the comment
4. They can reply directly

---

## Checking the Database

### View Comments in Database
```bash
php artisan tinker
```

Then run:
```php
// Get all comments with relationships
Comment::with(['user', 'document', 'replies', 'mentions'])->get();

// Get comments for a specific document
Document::find(1)->comments;

// Get inline comments
Comment::whereNotNull('section_item_id')->get();

// Get resolved comments
Comment::where('is_resolved', true)->get();
```

---

## API Testing with Browser DevTools

### Check Network Requests
1. Open browser DevTools (F12)
2. Go to Network tab
3. Post a comment
4. Watch for POST request to `/comments`
5. Check response data

### Expected Request Payload:
```json
{
    "document_id": 1,
    "parent_id": null,
    "section_item_id": null,
    "content": "<p>Your comment content</p>"
}
```

---

## Troubleshooting

### Comments Not Appearing
- Check if you're logged in
- Check browser console for JavaScript errors
- Verify document exists and is published
- Clear browser cache and refresh

### Rich Text Editor Not Working
- Check if Tiptap packages are installed: `npm list @tiptap/react`
- Rebuild frontend: `npm run build`
- Check browser console for errors

### Mentions Not Working
- Ensure mentioned user exists
- Check username format (no spaces)
- Verify notifications are working

### Cannot Resolve Comments
- Verify you're the document owner
- Check if `showResolve` prop is true
- Look for authorization errors in network tab

---

## Quick Test Checklist

- [ ] Post a basic comment
- [ ] Reply to a comment
- [ ] Mention a user with @username
- [ ] Post an inline comment on a section
- [ ] Edit your own comment
- [ ] Delete your own comment
- [ ] Resolve a comment (as owner)
- [ ] Unresolve a comment (as owner)
- [ ] Use bold, italic, and other formatting
- [ ] Add a link in a comment
- [ ] Create a nested reply thread
- [ ] Verify comment counter updates
- [ ] Check notifications are sent
- [ ] View comments as different users

---

## Current Implementation Status

### ✅ Implemented Features:
- Comment posting with rich text
- Threaded replies
- User mentions (@username)
- Edit/Delete comments
- Resolve/Unresolve functionality
- Inline comments on sections
- Comment counter
- Notifications for mentions and replies
- Avatar display
- Timestamp formatting
- Rich text editor with formatting toolbar

### 🔧 Backend Routes:
- `POST /comments` - Create comment
- `PUT /comments/{comment}` - Update comment
- `DELETE /comments/{comment}` - Delete comment
- `POST /comments/{comment}/resolve` - Resolve comment
- `POST /comments/{comment}/unresolve` - Unresolve comment

### 📱 Frontend Components:
- `CommentSection` - Main comment display component
- `CommentItem` - Individual comment with actions
- `RichTextEditor` - Editor with formatting toolbar

---

## Next Steps for Testing

1. **Load Test**: Create multiple comments to test performance
2. **Edge Cases**: 
   - Very long comments
   - Special characters in mentions
   - Multiple mentions in one comment
   - Deeply nested reply threads
3. **Permissions**: Test what users can/cannot do
4. **Real-time Updates**: Test if comments update when others post
5. **Mobile Responsive**: Test on mobile devices

---

## Document Show Page URL Format
`http://127.0.0.1:8000/documents/{document-slug}`

Example: `http://127.0.0.1:8000/documents/my-first-document`

---

## Need Help?
- Check browser console for errors
- Check Laravel logs: `tail -f storage/logs/laravel.log`
- Use `dd()` or `dump()` in controllers to debug
- Check network tab in DevTools for failed requests
