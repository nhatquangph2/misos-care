#!/bin/bash

# OAuth Setup Helper Script
# This script opens all necessary OAuth configuration pages

echo "🔧 OAuth Setup Helper for Miso's Care"
echo "======================================"
echo ""
echo "This script will open the following pages:"
echo "1. Supabase Auth Providers"
echo "2. Supabase URL Configuration"
echo "3. Google Cloud Console (for Google OAuth)"
echo "4. Facebook Developers (for Facebook OAuth)"
echo "5. GitHub Settings (for GitHub OAuth)"
echo ""
read -p "Press Enter to continue..."

# Supabase Project URL
SUPABASE_PROJECT_ID="suzsukdrnoarzsixfycr"

echo ""
echo "📱 Opening Supabase Auth Providers..."
open "https://app.supabase.com/project/${SUPABASE_PROJECT_ID}/auth/providers"
sleep 2

echo "🔗 Opening Supabase URL Configuration..."
open "https://app.supabase.com/project/${SUPABASE_PROJECT_ID}/auth/url-configuration"
sleep 2

echo "🌐 Opening Google Cloud Console..."
open "https://console.cloud.google.com/apis/credentials"
sleep 2

echo "📘 Opening Facebook Developers..."
open "https://developers.facebook.com/apps"
sleep 2

echo "🐙 Opening GitHub OAuth Apps..."
open "https://github.com/settings/developers"
sleep 2

echo ""
echo "✅ All pages opened!"
echo ""
echo "📝 Next steps:"
echo "1. Configure each OAuth provider"
echo "2. Add redirect URLs to each provider"
echo "3. Copy Client ID and Client Secret"
echo "4. Paste them into Supabase Auth Providers"
echo ""
echo "📖 See OAUTH_SETUP_GUIDE.md for detailed instructions"
