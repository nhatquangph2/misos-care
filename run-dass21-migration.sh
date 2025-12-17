#!/bin/bash

# DASS-21 Data Migration Runner
# This script runs the DASS-21 normalization migration
# Date: 2025-12-18

set -e  # Exit on error

echo "=================================================="
echo "DASS-21 Data Normalization Migration"
echo "=================================================="
echo ""

# Check if migration file exists
MIGRATION_FILE="nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql"
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file found: $MIGRATION_FILE"
echo ""

# Method 1: Using Supabase CLI (recommended)
echo "🔧 METHOD 1: Using Supabase CLI (Recommended)"
echo "Run this command:"
echo ""
echo "  supabase db reset"
echo ""
echo "or apply just this migration:"
echo ""
echo "  supabase migration up"
echo ""
echo "=================================================="
echo ""

# Method 2: Using psql directly
echo "🔧 METHOD 2: Using psql directly"
echo ""
echo "You need your Supabase database connection string."
echo "Get it from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/database"
echo ""
echo "Then run:"
echo ""
echo '  psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres" -f nextjs-app/supabase/migrations/20251218_normalize_dass21_scores.sql'
echo ""
echo "=================================================="
echo ""

# Method 3: Using Supabase SQL Editor
echo "🔧 METHOD 3: Using Supabase SQL Editor (Easiest)"
echo ""
echo "1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
echo "2. Click 'New Query'"
echo "3. Copy-paste the contents of:"
echo "   $MIGRATION_FILE"
echo "4. Click 'Run'"
echo ""
echo "=================================================="
echo ""

# Ask which method to use
echo "Which method would you like to use?"
echo "1) Supabase CLI (supabase migration up)"
echo "2) psql (I'll provide connection string)"
echo "3) Manual (I'll copy SQL to clipboard)"
echo "4) Exit"
echo ""
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "Running: supabase migration up"
        echo ""
        if command -v supabase &> /dev/null; then
            cd nextjs-app
            supabase migration up
            echo ""
            echo "✅ Migration completed!"
        else
            echo "❌ Supabase CLI not found. Install it first:"
            echo "   npm install -g supabase"
            exit 1
        fi
        ;;
    2)
        echo ""
        read -p "Enter your Supabase connection string: " conn_string
        if [ -z "$conn_string" ]; then
            echo "❌ No connection string provided"
            exit 1
        fi
        echo ""
        echo "Running migration..."
        psql "$conn_string" -f "$MIGRATION_FILE"
        echo ""
        echo "✅ Migration completed!"
        ;;
    3)
        echo ""
        echo "📋 SQL content copied below. Copy and paste into Supabase SQL Editor:"
        echo "=================================================="
        cat "$MIGRATION_FILE"
        echo "=================================================="
        echo ""
        echo "ℹ️  Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql"
        ;;
    4)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=================================================="
echo "VERIFICATION"
echo "=================================================="
echo ""
echo "After running the migration, verify with:"
echo ""
echo "SELECT"
echo "  id,"
echo "  subscale_scores,"
echo "  total_score,"
echo "  completed_at"
echo "FROM mental_health_records"
echo "WHERE test_type = 'DASS21'"
echo "ORDER BY completed_at DESC"
echo "LIMIT 5;"
echo ""
echo "Expected format:"
echo '{"depression": 24, "anxiety": 16, "stress": 28}'
echo ""
