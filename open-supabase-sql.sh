#!/bin/bash

# Quick script to copy SQL and open Supabase SQL Editor
# Usage: ./open-supabase-sql.sh

set -e

MIGRATION_FILE="nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql"

echo "=================================================="
echo "📋 DASS-21 Migration - Quick Deploy"
echo "=================================================="
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found"
    exit 1
fi

echo "✅ Migration file found"
echo ""

# Copy SQL to clipboard (Mac)
if command -v pbcopy &> /dev/null; then
    cat "$MIGRATION_FILE" | pbcopy
    echo "✅ SQL copied to clipboard!"
    echo ""
    echo "📋 Next steps:"
    echo "1. The SQL is now in your clipboard"
    echo "2. Go to Supabase SQL Editor (opening in browser...)"
    echo "3. Click 'New Query'"
    echo "4. Paste (Cmd+V) and click 'Run'"
    echo ""

    # Try to get Supabase project URL from package.json or git remote
    if [ -f "nextjs-app/package.json" ]; then
        PROJECT_ID=$(grep -o '"supabase.*projectId.*:.*"[^"]*"' nextjs-app/package.json | grep -o '"[a-z0-9]*"$' | tr -d '"' || echo "")
        if [ ! -z "$PROJECT_ID" ]; then
            SUPABASE_URL="https://supabase.com/dashboard/project/${PROJECT_ID}/sql"
            echo "🌐 Opening: $SUPABASE_URL"
            sleep 2
            open "$SUPABASE_URL" 2>/dev/null || xdg-open "$SUPABASE_URL" 2>/dev/null || echo "Please open: $SUPABASE_URL"
        else
            echo "🌐 Please open: https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
        fi
    else
        echo "🌐 Please open: https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
    fi
else
    # Fallback for non-Mac
    echo "📋 Copy this SQL and paste it into Supabase SQL Editor:"
    echo ""
    echo "=================================================="
    cat "$MIGRATION_FILE"
    echo "=================================================="
    echo ""
    echo "🌐 Then go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
fi

echo ""
echo "=================================================="
echo "✨ After running, verify with:"
echo ""
echo "SELECT id, subscale_scores, total_score"
echo "FROM mental_health_records"
echo "WHERE test_type = 'DASS21'"
echo "ORDER BY completed_at DESC LIMIT 3;"
echo ""
echo "Expected: {\"depression\": 24, \"anxiety\": 16, \"stress\": 28}"
echo "=================================================="
