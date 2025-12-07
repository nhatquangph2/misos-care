#!/bin/bash

echo "🔍 OAuth Configuration Checker"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PRODUCTION_URL="https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app"
CALLBACK_URL="https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback"

echo "✅ Checklist - Bạn đã làm những điều sau chưa?"
echo ""

read -p "1. Google OAuth Client ID đã paste vào Supabase? (y/n): " google_id
read -p "2. Google OAuth Client Secret đã paste vào Supabase? (y/n): " google_secret
read -p "3. Google 'Authorized redirect URIs' = $CALLBACK_URL? (y/n): " google_redirect
echo ""

read -p "4. Facebook App ID đã paste vào Supabase? (y/n): " fb_id
read -p "5. Facebook App Secret đã paste vào Supabase? (y/n): " fb_secret
read -p "6. Facebook 'Valid OAuth Redirect URIs' = $CALLBACK_URL? (y/n): " fb_redirect
read -p "7. Facebook App đã switch sang LIVE mode? (y/n): " fb_live
echo ""

read -p "8. Supabase Site URL = $PRODUCTION_URL? (y/n): " site_url
read -p "9. Supabase Redirect URLs có chứa ${PRODUCTION_URL}/**? (y/n): " redirect_urls
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Kết quả:"
echo ""

# Count yes answers
yes_count=0
[[ "$google_id" == "y" ]] && ((yes_count++))
[[ "$google_secret" == "y" ]] && ((yes_count++))
[[ "$google_redirect" == "y" ]] && ((yes_count++))
[[ "$fb_id" == "y" ]] && ((yes_count++))
[[ "$fb_secret" == "y" ]] && ((yes_count++))
[[ "$fb_redirect" == "y" ]] && ((yes_count++))
[[ "$fb_live" == "y" ]] && ((yes_count++))
[[ "$site_url" == "y" ]] && ((yes_count++))
[[ "$redirect_urls" == "y" ]] && ((yes_count++))

echo "✓ Hoàn thành: $yes_count/9 bước"
echo ""

if [ $yes_count -eq 9 ]; then
    echo "🎉 Tất cả đã OK! Nếu vẫn không đăng nhập được:"
    echo ""
    echo "1. Clear browser cache và cookies"
    echo "2. Thử incognito mode"
    echo "3. Xem Supabase Auth Logs:"
    echo "   https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs"
    echo ""
    echo "4. Xem Browser Console (F12) để check lỗi JavaScript"
else
    echo "⚠️  Còn thiếu $(( 9 - yes_count )) bước!"
    echo ""
    echo "Các bước bạn trả lời 'n' cần được hoàn thành."
    echo ""

    # Show what's missing
    [[ "$google_id" != "y" ]] && echo "❌ Google Client ID chưa paste vào Supabase"
    [[ "$google_secret" != "y" ]] && echo "❌ Google Client Secret chưa paste vào Supabase"
    [[ "$google_redirect" != "y" ]] && echo "❌ Google Redirect URI chưa đúng"
    [[ "$fb_id" != "y" ]] && echo "❌ Facebook App ID chưa paste vào Supabase"
    [[ "$fb_secret" != "y" ]] && echo "❌ Facebook App Secret chưa paste vào Supabase"
    [[ "$fb_redirect" != "y" ]] && echo "❌ Facebook Redirect URI chưa đúng"
    [[ "$fb_live" != "y" ]] && echo "❌ Facebook App chưa switch sang LIVE mode"
    [[ "$site_url" != "y" ]] && echo "❌ Supabase Site URL chưa set"
    [[ "$redirect_urls" != "y" ]] && echo "❌ Supabase Redirect URLs chưa set"
    echo ""
    echo "Hãy hoàn thành các bước trên rồi thử lại!"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
