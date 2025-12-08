#!/bin/bash

# Quick OAuth Test Script
# Tests OAuth configuration and opens login page

echo "🧪 OAuth Test Script for Miso's Care"
echo "====================================="
echo ""

# Check if dev server is running
echo "🔍 Checking if dev server is running..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Dev server is running on http://localhost:3000"
else
    echo "❌ Dev server is NOT running"
    echo ""
    echo "Starting dev server..."
    cd nextjs-app
    npm run dev &
    sleep 5
    cd ..
fi

echo ""
echo "📋 Checking Supabase configuration..."

# Check env variables
if [ -f "nextjs-app/.env.local" ]; then
    echo "✅ .env.local exists"

    if grep -q "NEXT_PUBLIC_SUPABASE_URL" nextjs-app/.env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL is missing"
    fi

    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" nextjs-app/.env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing"
    fi
else
    echo "❌ .env.local not found"
fi

echo ""
echo "🔗 Testing OAuth pages..."
echo ""

# Test login page
echo "Opening login page..."
open "http://localhost:3000/auth/login"
sleep 2

echo ""
echo "📝 Manual Test Steps:"
echo ""
echo "1. Click on 'Continue with Google' button"
echo "2. Check if you're redirected to Google login"
echo "3. Login with your Google account"
echo "4. Check if you're redirected back to app"
echo "5. Verify you end up at http://localhost:3000/dashboard"
echo ""
echo "Repeat for Facebook and GitHub."
echo ""
echo "💡 Tips:"
echo "- Open DevTools (F12) → Network tab to see OAuth requests"
echo "- Check Application → Cookies for session cookies"
echo "- Check Console for any errors"
echo ""
echo "📚 See OAUTH_SETUP_GUIDE.md for troubleshooting"
echo ""
echo "🔍 Useful URLs:"
echo "- Login: http://localhost:3000/auth/login"
echo "- Dashboard: http://localhost:3000/dashboard"
echo "- Supabase Auth Logs: https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs"
