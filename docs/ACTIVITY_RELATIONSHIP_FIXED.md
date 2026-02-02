# ✅ Activity Relationship Error Fixed

## Issue

When accessing user profile pages, the following error occurred:

```
Illuminate\Database\Eloquent\RelationNotFoundException
Call to undefined relationship [document] on model [App\Models\Activity].
```

**Location**: `app/Http/Controllers/UserProfileController.php:37`

---

## 🐛 Root Cause

The `UserProfileController` was trying to eager load a `document` relationship that doesn't exist on the `Activity` model.

**Problematic Code**:
```php
$activities = $user->activities()
    ->with(['document', 'subject'])  // ❌ 'document' doesn't exist
    ->latest()
    ->limit(10)
    ->get();
```

**Activity Model Structure**:
- ✅ Has `user()` relationship (BelongsTo)
- ✅ Has `subject()` relationship (MorphTo - polymorphic)
- ❌ Does NOT have `document()` relationship

The `subject()` morphTo relationship can point to different models (Document, Comment, etc.), but there's no direct `document` relationship.

---

## 🔧 Solution

Removed the non-existent `document` relationship from the eager loading.

**Fixed Code**:
```php
$activities = $user->activities()
    ->with(['subject'])  // ✅ Only load 'subject' (polymorphic)
    ->latest()
    ->limit(10)
    ->get();
```

---

## 📝 File Modified

**File**: `app/Http/Controllers/UserProfileController.php`

**Line**: 34

**Change**: 
- **Before**: `->with(['document', 'subject'])`
- **After**: `->with(['subject'])`

---

## 🔍 How Activity Relationships Work

### Activity Model Relationships

```php
class Activity extends Model
{
    // Direct relationship to user who performed the action
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Polymorphic relationship to the subject of the activity
    // Can be Document, Comment, or any other model
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }
}
```

### Activity Table Structure
- `user_id` - User who performed the activity
- `subject_type` - Type of model (e.g., "App\Models\Document")
- `subject_id` - ID of the subject model
- `action` - Action performed (created, updated, etc.)
- `description` - Human-readable description
- `meta` - Additional JSON data

---

## ✅ Result

### Before (Error)
```
❌ RelationNotFoundException: Call to undefined relationship [document]
```

### After (Working)
```
✅ Profile page loads successfully
✅ Activities are loaded with their polymorphic subject
✅ No relationship errors
```

---

## 🎯 Testing

The fix ensures that:
- ✅ Profile pages load without errors
- ✅ Activities are properly eager loaded
- ✅ Polymorphic relationships work correctly
- ✅ No N+1 query issues

---

## 📊 Activity Display on Profile

When activities are displayed on the user profile:

```tsx
{activities.map((activity, index) => (
    <div key={index}>
        <p>{activity.description}</p>
        <p>{new Date(activity.created_at).toLocaleString()}</p>
    </div>
))}
```

The activity description already contains the formatted information, so we don't need to access the document directly.

---

## 🚀 Status

**Error**: ✅ **FIXED**  
**File**: `UserProfileController.php`  
**Change**: Removed invalid `document` relationship  
**Testing**: Profile pages now load correctly  
**Impact**: All user profile pages work properly  

---

## 💡 Future Enhancement

If you need to access document-specific information in activities:

**Option 1**: Access through polymorphic subject
```php
if ($activity->subject_type === Document::class) {
    $document = $activity->subject; // This is the document
}
```

**Option 2**: Add accessor to Activity model
```php
public function getDocumentAttribute()
{
    return $this->subject_type === Document::class 
        ? $this->subject 
        : null;
}
```

**Option 3**: Filter activities by subject type
```php
$activities = $user->activities()
    ->where('subject_type', Document::class)
    ->with(['subject'])
    ->latest()
    ->limit(10)
    ->get();
```

For now, the `subject` relationship provides all needed information! ✅

---

## ✨ Summary

**Problem**: Undefined relationship error  
**Cause**: Loading non-existent `document` relationship  
**Solution**: Removed invalid relationship, kept `subject`  
**Status**: ✅ **RESOLVED**

User profile pages now work perfectly! 🎉
