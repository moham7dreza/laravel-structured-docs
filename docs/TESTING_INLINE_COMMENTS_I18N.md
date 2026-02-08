# Quick Testing Guide: Inline Comments & Internationalization

## Prerequisites
- Project running with `npm run dev`
- Laravel backend running
- Database with documents containing sections

---

## Part 1: Testing Inline Comments

### Step 1: Navigate to a Document
1. Go to the home page
2. Click on any document with sections
3. The document show page should display:
   - Document header with metadata
   - Sections with their titles
   - Section items with content
   - Below each item: A comment section

### Step 2: Add a Comment to a Section Item
1. Scroll to a section item
2. Look for the comment section below the item content
3. Click "Add Comment" button
4. Type your comment in the rich text editor
5. Click "Post Comment"
6. Expected: Comment appears in the list

### Step 3: Reply to a Comment
1. Find a comment in the section
2. Click "Reply" button
3. Type your reply
4. Click "Post Comment"
5. Expected: Reply appears indented under the comment

### Step 4: Edit Your Comment
1. Find a comment you authored
2. Click "Edit" button
3. Modify the comment text
4. Click "Save"
5. Expected: Comment is updated

### Step 5: Resolve a Comment (Document Owner Only)
1. As the document owner, find a comment
2. Click "Resolve" button
3. Expected: Comment shows resolved badge

### Step 6: Delete a Comment
1. Find a comment you authored
2. Click "Delete" button
3. Confirm deletion
4. Expected: Comment is removed

---

## Part 2: Testing Internationalization & RTL

### Step 1: Access Language Switcher
1. On any main page (home, documents, categories, tags, search, document show)
2. Look at the top-right corner of the header
3. Find the globe icon with flag (🌍)
4. Click it to open language menu

### Step 2: Switch to Persian
1. Click language switcher
2. Select "فارسی" (Persian)
3. Expected changes:
   - Page refreshes/updates
   - Text direction changes to right-to-left
   - HTML element has `dir="rtl"` attribute
   - Text alignment changes to right-aligned
   - Navigation flows from right to left

### Step 3: Verify Search Input in Persian
1. Go to `/search` or search page
2. Switch to Persian using language switcher
3. Look at the search input in the hero section
4. Expected: 
   - Search icon appears on the RIGHT side
   - Input text aligns to the right
   - Placeholder text is right-aligned
   - Button is positioned correctly

### Step 4: Verify Document Page in Persian
1. Go to a document
2. Switch to Persian
3. Expected:
   - All text is right-aligned
   - Sidebar is on the left side (in RTL layout)
   - Comments section works properly
   - Language switcher remains accessible

### Step 5: Verify Navigation in Persian
1. On home page, switch to Persian
2. Navigate through menu items
3. Expected:
   - All navigation items are properly aligned
   - Links work correctly
   - No text overflow issues

### Step 6: Verify Persistence
1. Switch to Persian
2. Refresh the page (F5)
3. Expected: 
   - Language stays Persian
   - Direction is still RTL
   - localStorage shows `i18nextLng: "fa"`

### Step 7: Switch Back to English
1. Switch to English using language switcher
2. Expected:
   - Page direction changes back to LTR
   - Text aligns to the left
   - All content is in English
   - Language persists on refresh

---

## Part 3: Debugging

### If Language Doesn't Change
1. Open browser DevTools (F12)
2. Go to Console tab
3. Check for errors
4. Verify localStorage: Type `localStorage.getItem('i18nextLng')`
5. Should return 'en' or 'fa'

### If Direction Doesn't Change
1. Open DevTools
2. Right-click on `<html>` element
3. Select "Inspect"
4. Look for `dir` attribute
5. Should be `dir="rtl"` for Persian, `dir="ltr"` for English

### If Search Input Looks Wrong in RTL
1. Inspect the input element
2. Check computed styles
3. Verify `direction: rtl` is applied
4. Check margin/padding values

### If Comments Don't Load
1. Check Network tab for API calls to `/comments`
2. Verify document has sections in database
3. Check Console for JavaScript errors
4. Verify user is authenticated

---

## Expected Visual Changes in Persian (RTL)

| Element | English (LTR) | Persian (RTL) |
|---------|------------|------------|
| Text | Left-aligned | Right-aligned |
| Navigation | Left to right | Right to left |
| Sidebar | Right side | Left side |
| Margins | `ml-4` applies left | `ml-4` applies right |
| Search icon | Left of input | Right of input |
| Headers | Left flush | Right flush |

---

## Performance Considerations

- Language switching is instant (no page reload needed)
- Comments are loaded via existing API (no new endpoints)
- RTL rendering uses standard CSS (no performance impact)
- Font subsetting for Persian is optional (included Vazirmatn font)

---

## Troubleshooting Common Issues

### Issue: Language switcher not visible
**Solution:** Check that LanguageSwitcher component is imported and included in header JSX

### Issue: Comments not appearing
**Solution:** 
- Verify sections have items
- Check that user is authenticated
- Inspect API response in Network tab

### Issue: Text still LTR in Persian
**Solution:**
- Verify `dir="rtl"` on HTML element
- Check that page actually refreshed
- Clear browser cache and localStorage

### Issue: Search button overlaps input in RTL
**Solution:** 
- Verify `ltr:` and `rtl:` Tailwind modifiers are applied
- Check that Tailwind CSS is properly built
- Run `npm run build` to recompile

---

## Mobile Testing

Test on mobile devices or responsive mode:
1. Open DevTools
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Test on various screen sizes
4. Verify comment sections display correctly
5. Verify language switcher is accessible

---

## Keyboard Navigation Testing

1. Press Tab to navigate through elements
2. Verify focus order is logical
3. In RTL mode: Focus order should flow right-to-left
4. Test that all interactive elements are keyboard accessible

---

## Summary

All changes are **backward compatible** and **non-breaking**:
- Existing functionality remains unchanged
- No database migrations required
- No new dependencies added
- Works with existing comment system
- Supports all modern browsers


