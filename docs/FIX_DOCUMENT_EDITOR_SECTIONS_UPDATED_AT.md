# 🔧 Fix: Missing updated_at Column in document_editor_sections

## ❌ Error
```
SQLSTATE[42S22]: Column not found: 1054 Unknown column 
'document_editor_sections.updated_at' in 'field list'
```

## 🔍 Root Cause

The `document_editor_sections` pivot table was created with only `created_at` timestamp, but the Laravel relationship uses `withTimestamps()` which expects both `created_at` and `updated_at` columns.

**Original Migration:**
```php
$table->timestamp('created_at')->nullable();  // ❌ Only created_at
```

**DocumentEditor Model:**
```php
public function sections(): BelongsToMany
{
    return $this->belongsToMany(StructureSection::class, 'document_editor_sections')
        ->withTimestamps();  // ← Expects both created_at AND updated_at
}
```

## ✅ Solution Applied

### **Step 1: Fixed Original Migration**
Updated the original migration to use `$table->timestamps()`:

**File:** `2026_01_31_085610_create_document_editor_sections_table.php`
```php
// Before:
$table->timestamp('created_at')->nullable();

// After:
$table->timestamps();  // ✅ Creates both created_at and updated_at
```

### **Step 2: Created Fix Migration**
Created a new migration to add the missing column to the existing table:

**File:** `2026_02_01_093320_add_updated_at_to_document_editor_sections_table.php`
```php
public function up(): void
{
    Schema::table('document_editor_sections', function (Blueprint $table) {
        $table->timestamp('updated_at')->nullable()->after('created_at');
    });
}

public function down(): void
{
    Schema::table('document_editor_sections', function (Blueprint $table) {
        $table->dropColumn('updated_at');
    });
}
```

### **Step 3: Ran Migration**
```bash
php artisan migrate --force
```

## 📊 Table Structure

### **Before (Broken):**
```sql
document_editor_sections
├─ id
├─ document_editor_id
├─ structure_section_id
├─ created_at        ← Only this one
└─ (missing updated_at) ❌
```

### **After (Fixed):**
```sql
document_editor_sections
├─ id
├─ document_editor_id
├─ structure_section_id
├─ created_at        ✓
└─ updated_at        ✓ Added!
```

## 🎯 Why This Happened

The original migration used `$table->timestamp('created_at')->nullable()` instead of `$table->timestamps()`, which is Laravel's helper method that creates **both** `created_at` and `updated_at` columns.

**When using `withTimestamps()` in relationships, Laravel expects BOTH columns to exist.**

## ✨ What Works Now

✅ **Editor section permissions can be assigned**  
✅ **No SQL column errors**  
✅ **Both timestamps are tracked**  
✅ **Relationship works correctly**  
✅ **Pivot table properly maintains timestamps**  

## 📁 Files Modified

1. ✅ `2026_01_31_085610_create_document_editor_sections_table.php` - Fixed to use `timestamps()`
2. ✅ `2026_02_01_093320_add_updated_at_to_document_editor_sections_table.php` - New migration to add missing column

## 💡 Lesson Learned

**For pivot tables with timestamps:**
- ❌ DON'T use: `$table->timestamp('created_at')->nullable();`
- ✅ DO use: `$table->timestamps();`

This ensures both columns are created and the `withTimestamps()` method works correctly.

## 🎉 Status: **FIXED!** ✅

The `document_editor_sections` table now has both `created_at` and `updated_at` columns, and the editor section permissions feature works without errors!
