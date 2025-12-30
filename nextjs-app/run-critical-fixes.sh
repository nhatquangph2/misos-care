#!/bin/bash

# =====================================================
# Script to apply critical fixes to Supabase
# Run this script to fix:
#   1. Missing chat_sessions table
#   2. Missing chat_messages table  
#   3. DASS-21 total_score inconsistencies
#   4. Users table RLS policies
# =====================================================

echo "🔧 MisosCare Database Fix Script"
echo "================================"
echo ""
echo "This script will copy the migration SQL to your clipboard."
echo "You need to paste it in the Supabase SQL Editor."
echo ""

# Check if migration file exists
MIGRATION_FILE="./supabase/migrations/20251229_fix_all_critical_issues.sql"

if [ -f "$MIGRATION_FILE" ]; then
    echo "✅ Found migration file: $MIGRATION_FILE"
    echo ""
    
    # Copy to clipboard (macOS)
    if command -v pbcopy &> /dev/null; then
        cat "$MIGRATION_FILE" | pbcopy
        echo "📋 SQL copied to clipboard!"
        echo ""
        echo "Next steps:"
        echo "  1. Go to Supabase Dashboard → SQL Editor"
        echo "  2. Create a new query"
        echo "  3. Paste the SQL (Cmd+V)"
        echo "  4. Click 'Run' to execute"
        echo ""
        echo "URL: https://supabase.com/dashboard/project/_/sql"
    else
        echo "❌ pbcopy not found. Please copy the SQL manually from:"
        echo "   $MIGRATION_FILE"
    fi
else
    echo "❌ Migration file not found: $MIGRATION_FILE"
    echo "   Please run this script from the nextjs-app directory"
    exit 1
fi

echo ""
echo "================================"
echo "After running the migration, refresh http://localhost:3001/api/debug/check-data"
echo "to verify the fixes were applied successfully."
