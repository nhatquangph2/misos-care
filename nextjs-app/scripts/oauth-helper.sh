#!/bin/bash

# OAuth Setup Helper Script
# Tạo sẵn các URLs và commands để bạn copy/paste nhanh

echo "🔐 OAuth Setup Helper - Miso's Care"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PRODUCTION_URL="https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app"
SUPABASE_PROJECT_ID="suzsukdrnoarzsixfycr"
CALLBACK_URL="https://${SUPABASE_PROJECT_ID}.supabase.co/auth/v1/callback"

echo "📱 Production URL:"
echo "$PRODUCTION_URL"
echo ""

echo "🔗 Supabase Callback URL (dùng cho TẤT CẢ providers):"
echo "$CALLBACK_URL"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to open URLs
function open_urls() {
    case $1 in
        google)
            echo "🔵 Opening Google Cloud Console..."
            open "https://console.cloud.google.com/apis/credentials"
            ;;
        github)
            echo "⚫ Opening GitHub Developer Settings..."
            open "https://github.com/settings/applications/new"
            ;;
        facebook)
            echo "🔴 Opening Facebook Developers..."
            open "https://developers.facebook.com/apps/create/"
            ;;
        supabase)
            echo "🟢 Opening Supabase Auth Providers..."
            open "https://app.supabase.com/project/${SUPABASE_PROJECT_ID}/auth/providers"
            ;;
        *)
            echo "Usage: $0 [google|github|facebook|supabase]"
            ;;
    esac
}

# Main menu
echo "Chọn OAuth provider để setup:"
echo "1) Google OAuth"
echo "2) GitHub OAuth"
echo "3) Facebook OAuth"
echo "4) Mở Supabase Dashboard"
echo "5) Copy tất cả URLs"
echo "6) Test OAuth login"
echo "0) Exit"
echo ""
read -p "Nhập số (0-6): " choice

case $choice in
    1)
        echo ""
        echo "🔵 GOOGLE OAUTH SETUP"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Mở Google Cloud Console..."
        open_urls google
        echo ""
        echo "2. Copy các URLs sau để paste vào Google Console:"
        echo ""
        echo "   Authorized JavaScript origins:"
        echo "   $PRODUCTION_URL"
        echo ""
        echo "   Authorized redirect URIs:"
        echo "   $CALLBACK_URL"
        echo ""
        echo "3. Sau khi tạo xong, mở Supabase để paste credentials:"
        read -p "Nhấn Enter để mở Supabase..."
        open_urls supabase
        ;;
    2)
        echo ""
        echo "⚫ GITHUB OAUTH SETUP"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Mở GitHub Developer Settings..."
        open_urls github
        echo ""
        echo "2. Copy các URLs sau để paste vào GitHub:"
        echo ""
        echo "   Homepage URL:"
        echo "   $PRODUCTION_URL"
        echo ""
        echo "   Authorization callback URL:"
        echo "   $CALLBACK_URL"
        echo ""
        echo "3. Sau khi tạo xong, mở Supabase để paste credentials:"
        read -p "Nhấn Enter để mở Supabase..."
        open_urls supabase
        ;;
    3)
        echo ""
        echo "🔴 FACEBOOK OAUTH SETUP"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "1. Mở Facebook Developers..."
        open_urls facebook
        echo ""
        echo "2. Copy các URLs sau để paste vào Facebook:"
        echo ""
        echo "   Site URL:"
        echo "   $PRODUCTION_URL"
        echo ""
        echo "   Valid OAuth Redirect URIs:"
        echo "   $CALLBACK_URL"
        echo ""
        echo "⚠️  ĐỪng quên: Switch app sang LIVE MODE sau khi setup!"
        echo ""
        echo "3. Sau khi tạo xong, mở Supabase để paste credentials:"
        read -p "Nhấn Enter để mở Supabase..."
        open_urls supabase
        ;;
    4)
        echo ""
        echo "🟢 Opening Supabase Dashboard..."
        open_urls supabase
        ;;
    5)
        echo ""
        echo "📋 COPY TẤT CẢ URLs CẦN THIẾT"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Production URL:"
        echo "$PRODUCTION_URL" | pbcopy
        echo "✓ Đã copy vào clipboard: $PRODUCTION_URL"
        sleep 1
        echo ""
        echo "Callback URL:"
        echo "$CALLBACK_URL" | pbcopy
        echo "✓ Đã copy vào clipboard: $CALLBACK_URL"
        echo ""
        echo "Supabase URLs để paste vào URL Configuration:"
        echo "Site URL: $PRODUCTION_URL"
        echo "Redirect URLs:"
        echo "  ${PRODUCTION_URL}/**"
        echo "  ${PRODUCTION_URL}/auth/callback"
        ;;
    6)
        echo ""
        echo "🧪 Opening test login page..."
        open "${PRODUCTION_URL}/auth/login"
        echo ""
        echo "Thử đăng nhập với:"
        echo "- Google"
        echo "- GitHub"
        echo "- Facebook"
        ;;
    0)
        echo "Bye! 👋"
        exit 0
        ;;
    *)
        echo "Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Done! Nếu cần help, xem file QUICK_OAUTH_SETUP.md"
echo ""
