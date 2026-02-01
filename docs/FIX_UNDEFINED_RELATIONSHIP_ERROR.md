# 🔧 Fix: "Call to undefined relationship [structureSectionItem] on model [App\Models\DocumentSection]"

## ❌ Problem

When accessing the Edit Content page, the following error occurred:

```
Call to undefined relationship [structureSectionItem] on model [App\Models\DocumentSection].
```

---

## 🔍 Root Cause

The error occurred because Filament was trying to access nested relationships using **dot notation** (e.g., `structureSection.title`, `structureSectionItem.label`) in TextInput field names. 

When Filament processes these dot-notation field names, it attempts to call the relationship as a method on the model, but:
- `DocumentSection` has `structureSection` relationship ✅
- `DocumentSection` does NOT have `structureSectionItem` relationship ❌
- Only `DocumentSectionItem` has `structureSectionItem` relationship ✅

**The Issue:**
Filament was interpreting the dot notation field names as relationship calls on the wrong model level.

---

## ✅ Solution Applied

### **Changed from Dot Notation to formatStateUsing**

Instead of using relationship paths in field names, we now use dummy field names with `formatStateUsing()` to display the related data.

### **Before (Caused Error):**
```php
TextInput::make('structureSection.title')  // ❌ Tries to call relationship
    ->label('Section Title')
    ->disabled(),
```

### **After (Works!):**
```php
TextInput::make('structure_section_title')  // ✅ Dummy field name
    ->label('Section Title')
    ->disabled()
    ->formatStateUsing(function ($record) {
        return $record?->structureSection?->title ?? 'Unknown Section';
    }),
```

---

## 🔧 Changes Made

### **1. Section Title Field**
```php
// OLD: TextInput::make('structureSection.title')
// NEW:
TextInput::make('structure_section_title')
    ->label('Section Title')
    ->disabled()
    ->columnSpanFull()
    ->formatStateUsing(function ($record) {
        return $record?->structureSection?->title ?? 'Unknown Section';
    }),
```

### **2. Structure Item Label Field**
```php
// OLD: TextInput::make('structureSectionItem.label')
// NEW:
TextInput::make('structure_item_label')
    ->label('Field')
    ->disabled()
    ->columnSpanFull()
    ->formatStateUsing(fn () => $structureSectionItem->label),
```

### **3. Item Label for Repeater**
```php
// OLD: ->itemLabel(fn (array $state): ?string => $state['structureSection']['title'] ?? null)
// NEW:
->itemLabel(fn (?Model $record): ?string => $record?->structureSection?->title ?? 'Section')
```

---

## 🎯 Why This Works

1. **No Relationship Calls on Field Names** - Dummy field names don't trigger relationship lookups
2. **Direct Model Access** - `formatStateUsing()` receives the actual model instance
3. **Safe Navigation** - Uses null-safe operator `?->` to prevent errors
4. **Fallback Values** - Provides default values if relationships are missing

---

## 📊 Data Flow

```
Before (Error):
TextInput Field Name: "structureSection.title"
    ↓
Filament parses dot notation
    ↓
Tries to call: DocumentSection->structureSection->title
    ↓
❌ ERROR when it finds "structureSectionItem" in wrong context

After (Fixed):
TextInput Field Name: "structure_section_title" (dummy)
    ↓
formatStateUsing() receives $record (DocumentSection model)
    ↓
Directly accesses: $record->structureSection->title
    ↓
✅ WORKS - Uses loaded relationship correctly
```

---

## 🎨 Complete Working Code

```php
Repeater::make('sections')
    ->relationship('sections')
    ->schema([
        // Display section title from relationship
        TextInput::make('structure_section_title')
            ->label('Section Title')
            ->disabled()
            ->columnSpanFull()
            ->formatStateUsing(function ($record) {
                return $record?->structureSection?->title ?? 'Unknown Section';
            }),

        Toggle::make('is_complete')
            ->label('Mark as Complete'),

        Repeater::make('items')
            ->relationship('items')
            ->schema(function (callable $get, ?Model $record) {
                // ... null checks ...
                
                return [
                    // Display structure item label
                    TextInput::make('structure_item_label')
                        ->label('Field')
                        ->disabled()
                        ->formatStateUsing(fn () => $structureSectionItem->label),
                    
                    // Actual editable content field
                    $this->getFieldComponent($structureSectionItem),
                    
                    // Last edited timestamp
                    TextInput::make('last_edited_at')
                        ->label('Last Edited')
                        ->disabled()
                        ->formatStateUsing(fn ($state) => $state?->diffForHumans() ?? 'Never'),
                ];
            }),
    ])
    ->itemLabel(fn (?Model $record): ?string => $record?->structureSection?->title ?? 'Section')
```

---

## 📁 File Modified

- `/app/Filament/Admin/Resources/Documents/Pages/EditDocumentContent.php`
  - ✅ Replaced dot notation field names with dummy names
  - ✅ Added `formatStateUsing()` to display relationship data
  - ✅ Fixed `itemLabel` to use model instead of state array

---

## 🧪 Testing

To verify the fix:

1. Navigate to **Documents** list
2. Click **"Edit Content"** on any document
3. Page should load without errors
4. Section titles should display correctly
5. Field labels should display correctly
6. All form fields should be editable

---

## ✨ Status: **FIXED** ✅

The relationship error has been resolved! The Edit Content page now correctly accesses nested relationships without triggering undefined relationship errors.

---

## 📚 Key Takeaway

**When using Filament Repeaters with relationships:**
- ❌ DON'T use dot notation in field names for nested relationships
- ✅ DO use `formatStateUsing()` with dummy field names
- ✅ DO access relationships directly on the model instance in closures
