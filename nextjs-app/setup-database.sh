#!/bin/bash

# =====================================================
# MISO'S CARE - AUTOMATIC DATABASE SETUP SCRIPT
# This script will automatically setup your Supabase database
# =====================================================

echo "🚀 Miso's Care - Database Setup"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Read environment variables
if [ -f .env.local ]; then
    export $(cat .env.local | grep -v '#' | awk '/=/ {print $1}')
fi

# Check if Supabase URL and key are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Error: Supabase credentials not found in .env.local${NC}"
    echo "Please make sure .env.local contains:"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    exit 1
fi

echo -e "${BLUE}📍 Supabase Project:${NC} $NEXT_PUBLIC_SUPABASE_URL"
echo ""

# Read the SQL file
SQL_FILE="supabase/migrations/00001_initial_schema.sql"

if [ ! -f "$SQL_FILE" ]; then
    echo -e "${RED}❌ Error: Migration file not found: $SQL_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}⚠️  IMPORTANT: You need to run this SQL manually in Supabase Dashboard${NC}"
echo ""
echo "Steps to setup database:"
echo ""
echo "1. Open Supabase Dashboard: https://supabase.com/dashboard"
echo "2. Go to your project: $NEXT_PUBLIC_SUPABASE_URL"
echo "3. Click 'SQL Editor' in the left menu"
echo "4. Click 'New query'"
echo "5. Copy the contents of this file:"
echo "   ${BLUE}$SQL_FILE${NC}"
echo "6. Paste into SQL Editor and click 'RUN'"
echo ""
echo -e "${GREEN}✅ If you see 'Success', your database is ready!${NC}"
echo ""

# Ask user if they want to open the file
echo -n "Would you like me to open the SQL file for you? (y/n): "
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    if command -v code &> /dev/null; then
        code "$SQL_FILE"
        echo -e "${GREEN}✅ Opened in VS Code${NC}"
    elif command -v open &> /dev/null; then
        open "$SQL_FILE"
        echo -e "${GREEN}✅ Opened file${NC}"
    else
        cat "$SQL_FILE"
    fi
fi

echo ""
echo -e "${BLUE}📋 Quick Copy:${NC}"
echo "Run this command to copy the SQL to clipboard (macOS):"
echo "  ${YELLOW}pbcopy < $SQL_FILE${NC}"
echo ""
echo "Or view the file:"
echo "  ${YELLOW}cat $SQL_FILE${NC}"
echo ""
echo -e "${GREEN}🎉 After running the SQL, your app will be fully functional!${NC}"
echo ""
