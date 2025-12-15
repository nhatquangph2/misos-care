#!/bin/bash

# Script to setup Gamification System - "Đại dương của Miso"
# This script will guide you through setting up the database

echo "🌊 Đại dương của Miso - Gamification Setup"
echo "=========================================="
echo ""

# Check if migration file exists
MIGRATION_FILE="./supabase/migrations/20241215_gamification_ocean_system.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file found"
echo ""
echo "📋 Bước 1: Mở Supabase Dashboard"
echo "   1. Truy cập: https://app.supabase.com"
echo "   2. Chọn project của bạn"
echo "   3. Vào SQL Editor"
echo ""
echo "📋 Bước 2: Copy SQL migration"
echo "   SQL đã được copy vào clipboard!"
echo ""

# Copy SQL to clipboard (works on macOS)
cat "$MIGRATION_FILE" | pbcopy

echo "📋 Bước 3: Paste và chạy trong Supabase SQL Editor"
echo "   1. Paste SQL vào editor"
echo "   2. Click 'Run' để thực thi"
echo ""
echo "✅ Sau khi chạy xong, bạn sẽ có:"
echo "   - Bảng user_gamification"
echo "   - Functions: increment_bubbles, update_streak_days, calculate_ocean_level"
echo "   - Triggers tự động update ocean level"
echo "   - RLS policies để bảo mật dữ liệu"
echo ""
echo "🎉 Gamification system ready to use!"
