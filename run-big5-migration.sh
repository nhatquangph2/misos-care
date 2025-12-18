#!/bin/bash

# ============================================
# BIG-5 Raw Scores Migration Helper Script
# ============================================
#
# This script helps you run the BIG-5 migration that:
# 1. Adds raw score columns to personality_profiles
# 2. Creates bfi2_test_history table
# 3. Migrates existing percentage data to estimated raw scores
#
# Usage: ./run-big5-migration.sh
#
# ============================================

set -e  # Exit on error

MIGRATION_FILE="nextjs-app/supabase/migrations/20251218_add_big5_raw_scores.sql"

echo "============================================"
echo "BIG-5 RAW SCORES MIGRATION"
echo "============================================"
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "📄 Migration file found: $MIGRATION_FILE"
echo ""

# Check for .env.local file
if [ -f "nextjs-app/.env.local" ]; then
    echo "📋 Checking Supabase configuration..."
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" nextjs-app/.env.local; then
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" nextjs-app/.env.local | cut -d '=' -f 2-)
        echo "✅ Supabase URL found: $SUPABASE_URL"
    fi
else
    echo "⚠️  No .env.local found. Make sure you have Supabase configured."
fi

echo ""
echo "============================================"
echo "MIGRATION OPTIONS"
echo "============================================"
echo ""
echo "Choose how to run this migration:"
echo ""
echo "1. Copy SQL to clipboard (Supabase Dashboard)"
echo "2. Run via psql (local database)"
echo "3. Show migration preview only"
echo "4. Cancel"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📋 Copying SQL to clipboard..."

        if command -v pbcopy &> /dev/null; then
            cat "$MIGRATION_FILE" | pbcopy
            echo "✅ SQL copied to clipboard!"
            echo ""
            echo "Next steps:"
            echo "1. Go to Supabase Dashboard > SQL Editor"
            echo "2. Paste the SQL (Cmd+V)"
            echo "3. Click 'Run'"
            echo ""
            echo "Opening Supabase Dashboard..."
            sleep 2

            if [ ! -z "$SUPABASE_URL" ]; then
                PROJECT_REF=$(echo "$SUPABASE_URL" | sed 's/https:\/\///' | cut -d '.' -f 1)
                open "https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
            else
                open "https://supabase.com/dashboard"
            fi
        elif command -v xclip &> /dev/null; then
            cat "$MIGRATION_FILE" | xclip -selection clipboard
            echo "✅ SQL copied to clipboard!"
        else
            echo "⚠️  Clipboard command not found. Please copy manually:"
            echo ""
            echo "File location: $MIGRATION_FILE"
        fi
        ;;

    2)
        echo ""
        echo "🐘 Running migration via psql..."
        echo ""

        # Check if psql is installed
        if ! command -v psql &> /dev/null; then
            echo "❌ Error: psql not found. Please install PostgreSQL client."
            exit 1
        fi

        # Get database connection string
        read -p "Enter PostgreSQL connection string (or press Enter to use default from env): " DB_URL

        if [ -z "$DB_URL" ]; then
            echo "⚠️  No connection string provided. Please set it manually."
            exit 1
        fi

        echo ""
        echo "Running migration..."
        psql "$DB_URL" -f "$MIGRATION_FILE"

        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Migration completed successfully!"
        else
            echo ""
            echo "❌ Migration failed. Check errors above."
            exit 1
        fi
        ;;

    3)
        echo ""
        echo "============================================"
        echo "MIGRATION PREVIEW"
        echo "============================================"
        echo ""
        head -n 50 "$MIGRATION_FILE"
        echo ""
        echo "... (showing first 50 lines)"
        echo ""
        echo "Full file: $MIGRATION_FILE"
        ;;

    4)
        echo ""
        echo "❌ Migration cancelled."
        exit 0
        ;;

    *)
        echo ""
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "============================================"
echo "VERIFICATION"
echo "============================================"
echo ""
echo "After migration, verify by running:"
echo ""
echo "SELECT COUNT(*) FROM bfi2_test_history;"
echo "SELECT COUNT(*) FROM personality_profiles WHERE big5_openness_raw IS NOT NULL;"
echo ""
echo "============================================"
