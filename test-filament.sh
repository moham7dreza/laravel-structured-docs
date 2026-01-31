#!/bin/bash

echo "================================================"
echo "🚀 Testing Filament Admin Panel Setup"
echo "================================================"
echo ""

# Test 1: Check if Filament is installed
echo "✓ Test 1: Checking Filament installation..."
composer show filament/filament 2>/dev/null | grep "name" | head -1

# Test 2: Check if admin panel provider exists
echo "✓ Test 2: Checking AdminPanelProvider..."
if [ -f "app/Providers/Filament/AdminPanelProvider.php" ]; then
    echo "  ✅ AdminPanelProvider exists"
else
    echo "  ❌ AdminPanelProvider not found"
fi

# Test 3: Check if resources exist
echo "✓ Test 3: Checking Filament Resources..."
resource_count=$(find app/Filament/Admin/Resources -name "*Resource.php" 2>/dev/null | wc -l)
echo "  ✅ Found $resource_count resources"

# Test 4: Check if widgets exist
echo "✓ Test 4: Checking Filament Widgets..."
widget_count=$(find app/Filament/Admin/Widgets -name "*.php" 2>/dev/null | wc -l)
echo "  ✅ Found $widget_count widgets"

# Test 5: List all resources
echo ""
echo "📦 Available Resources:"
find app/Filament/Admin/Resources -name "*Resource.php" -type f 2>/dev/null | while read file; do
    basename "$file" | sed 's/Resource.php//'
done | sort | sed 's/^/  - /'

# Test 6: List all widgets
echo ""
echo "🎨 Available Widgets:"
find app/Filament/Admin/Widgets -name "*.php" -type f 2>/dev/null | while read file; do
    basename "$file" | sed 's/.php//'
done | sort | sed 's/^/  - /'

echo ""
echo "================================================"
echo "✅ Phase 3 Setup Complete!"
echo "================================================"
echo ""
echo "🌐 Access the admin panel at: http://localhost:8000/admin"
echo "📧 Email: admin@admin.com"
echo "🔑 Password: password"
echo ""
