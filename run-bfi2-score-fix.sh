#!/bin/bash

# ============================================
# BFI2_SCORE Column Fix Script
# ============================================
#
# This script adds the missing bfi2_score JSONB column
# Run this if the first migration didn't create it
#
# Usage: ./run-bfi2-score-fix.sh
#
# ============================================

set -e

MIGRATION_FILE="nextjs-app/supabase/migrations/20251218_add_bfi2_score_column.sql"

echo "============================================"
echo "BFI2_SCORE COLUMN FIX"
echo "============================================"
echo ""

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "📄 Migration file found: $MIGRATION_FILE"
echo ""
echo "This will add the missing bfi2_score JSONB column to personality_profiles"
echo ""

read -p "Continue? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Cancelled."
    exit 0
fi

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
    open "https://supabase.com/dashboard"
else
    echo "⚠️  Clipboard command not found."
    echo ""
    echo "Please copy this SQL manually:"
    echo ""
    cat "$MIGRATION_FILE"
fi

echo ""
echo "============================================"
echo "After running, verify with:"
echo ""
echo "SELECT column_name, data_type"
echo "FROM information_schema.columns"
echo "WHERE table_name = 'personality_profiles'"
echo "  AND column_name = 'bfi2_score';"
echo ""
echo "Expected result: bfi2_score | jsonb"
echo "============================================"
