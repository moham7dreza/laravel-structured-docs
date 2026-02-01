# ✨ Dynamic Structure Selection Based on Category

## 🎯 Feature Overview

When creating or editing a **Document**, the available **Structures** are now dynamically filtered based on the selected **Category**. This ensures users only see relevant structure options and prevents selecting incompatible combinations.

---

## 🔄 How It Works

### **Step-by-Step User Flow:**

1. **User selects a Category** → Category field is active and populated
2. **Structure dropdown becomes enabled** → Shows only structures for that category
3. **User changes Category** → Structure selection is reset (cleared)
4. **User sees filtered structures** → Only active structures for the selected category

### **Smart Features:**

✅ **Category-Specific Filtering** - Only structures belonging to the selected category are shown  
✅ **Active Structures Only** - Inactive structures are automatically hidden  
✅ **Default Structure Highlighted** - Default structures show "(Default - v1)" label  
✅ **Version Display** - All structures show their version number  
✅ **Smart Ordering** - Default structures appear first, then alphabetically  
✅ **Auto-Reset** - Changing category clears the structure selection  
✅ **Disabled State** - Structure field is disabled until a category is selected  

---

## 🛠️ Implementation Details

### **File Modified:**
`/app/Filament/Admin/Resources/Documents/Schemas/DocumentForm.php`

### **Key Changes:**

#### 1. **Category Field Enhancement**
```php
Select::make('category_id')
    ->relationship('category', 'name')
    ->required()
    ->searchable()
    ->preload()
    ->live() // Makes field reactive
    ->afterStateUpdated(fn (callable $set) => $set('structure_id', null)) // Clear structure on change
    ->helperText('Select a category first to see available structures'),
```

#### 2. **Dynamic Structure Filtering**
```php
Select::make('structure_id')
    ->relationship(
        'structure',
        'title',
        fn ($query, callable $get) => $query
            ->when(
                $get('category_id'),
                fn ($q, $categoryId) => $q->where('category_id', $categoryId)
                    ->where('is_active', true)
            )
            ->orderBy('is_default', 'desc')
            ->orderBy('title')
    )
    ->getOptionLabelFromRecordUsing(fn ($record) => $record->is_default
        ? "{$record->title} (Default - v{$record->version})"
        : "{$record->title} (v{$record->version})")
    ->required()
    ->searchable()
    ->preload()
    ->disabled(fn (callable $get) => ! $get('category_id'))
    ->helperText('Select a category first to see available structures. Default structure is recommended.')
    ->live(),
```

---

## 📋 Query Logic Breakdown

### **Filtering Criteria:**
1. **Category Match**: `->where('category_id', $categoryId)`
2. **Active Only**: `->where('is_active', true)`
3. **Default First**: `->orderBy('is_default', 'desc')`
4. **Alphabetical**: `->orderBy('title')`

### **Example Output:**
If you select "API Documentation" category:
```
📘 API Documentation Structure (Default - v1)
📘 REST API Schema (v2)
📘 GraphQL API Schema (v1)
```

---

## 🎨 User Experience

### **Before Selection:**
- Category field: ✅ Active
- Structure field: 🔒 Disabled (grayed out)
- Helper text: "Select a category first to see available structures"

### **After Category Selection:**
- Category field: ✅ Active (selected)
- Structure field: ✅ Enabled
- Dropdown options: Filtered list of structures
- Helper text: "Select a category first to see available structures. Default structure is recommended."

### **After Category Change:**
- Structure field: 🔄 Reset to null
- Dropdown options: Updated to new category's structures

---

## 🔍 Database Relationships Used

```
Category (1) ──→ (Many) Structure
    ↓
Document selects from filtered list
```

### **SQL Query Example:**
```sql
SELECT * FROM structures
WHERE category_id = ? 
  AND is_active = 1
ORDER BY is_default DESC, title ASC
```

---

## ✅ Benefits

1. **Data Integrity** - Prevents selecting incompatible category-structure combinations
2. **Better UX** - Users see only relevant options, reducing confusion
3. **Clear Defaults** - Default structures are clearly marked and prioritized
4. **Version Awareness** - Users can see structure versions at a glance
5. **Automatic Validation** - Frontend validation before backend submission
6. **Reduced Errors** - Impossible to create invalid document configurations

---

## 🧪 Testing Scenarios

### **Test Case 1: Normal Flow**
1. Create new document
2. Select "API Documentation" category
3. Verify structure dropdown shows only API-related structures
4. Verify default structure appears first with "(Default)" label

### **Test Case 2: Category Change**
1. Create new document
2. Select "API Documentation" category
3. Select a structure
4. Change category to "User Guides"
5. Verify structure field is cleared
6. Verify dropdown now shows User Guide structures

### **Test Case 3: No Active Structures**
1. Select a category with no active structures
2. Verify structure dropdown is empty or shows appropriate message

### **Test Case 4: Edit Existing Document**
1. Edit a document
2. Verify category and structure are pre-selected
3. Change category
4. Verify structure resets as expected

---

## 📊 Related Models & Relationships

### **Document Model**
```php
public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}

public function structure(): BelongsTo
{
    return $this->belongsTo(Structure::class);
}
```

### **Structure Model**
```php
public function category(): BelongsTo
{
    return $this->belongsTo(Category::class);
}

public function documents(): HasMany
{
    return $this->hasMany(Document::class);
}
```

---

## 🚀 Future Enhancements

Potential improvements:
- [ ] Auto-select default structure when category is selected
- [ ] Show structure description in tooltip
- [ ] Display structure preview/schema overview
- [ ] Filter by structure version
- [ ] Show structure usage count

---

## 📝 Notes

- This feature uses Filament's **reactive forms** (`->live()` method)
- The `->preload()` ensures structures are loaded immediately
- The `->disabled()` provides visual feedback when category isn't selected
- The `->afterStateUpdated()` ensures consistency when category changes
- Version numbers help users identify the latest schema version

---

## ✨ Status: ✅ IMPLEMENTED & TESTED

The dynamic structure selection feature is now fully functional and ready to use!
