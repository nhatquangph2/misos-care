#!/bin/bash

# Script to deploy gamification tables to Supabase
# Usage: ./deploy-gamification.sh

set -e

MIGRATION_FILE="supabase/migrations/20251225_gamification.sql"

echo "=================================================="
echo "🎮 Gamification System Deployment"
echo "=================================================="
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
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

    # Try to open Supabase directly if we have project ID
    PROJECT_ID="suzsukdrnoarzsixfycr" 
    SUPABASE_URL="https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new"
    
    echo "🌐 Opening: $SUPABASE_URL"
    sleep 1
    open "$SUPABASE_URL" 2>/dev/null || xdg-open "$SUPABASE_URL" 2>/dev/null || echo "Please open: $SUPABASE_URL"

else
    # Fallback for non-Mac
    echo "📋 Copy this SQL and paste it into Supabase SQL Editor:"
    echo ""
    echo "=================================================="
    cat "$MIGRATION_FILE"
    echo "=================================================="
    echo ""
    echo "🌐 Then go to: https://supabase.com/dashboard/project/suzsukdrnoarzsixfycr/sql/new"
fi

echo ""
echo "=================================================="
echo "⚠️  IMPORTANT: After running the SQL query,"
echo "    go to Settings > API and click 'Reload Schema Cache' if errors persist."
echo "=================================================="
