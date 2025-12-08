#!/bin/bash

# Setup Vercel Environment Variables
# This script adds all necessary environment variables to Vercel

echo "🚀 Setting up Vercel Environment Variables..."

# Read from .env.local
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d '=' -f2- | tr -d '"')
SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env.local | cut -d '=' -f2- | tr -d '"')

echo "📝 Found Supabase URL: ${SUPABASE_URL:0:30}..."
echo "📝 Found Supabase Anon Key: ${SUPABASE_ANON_KEY:0:30}..."

# Add to Vercel
echo "$SUPABASE_URL" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

echo "✅ Environment variables added to Vercel!"
echo ""
echo "🔄 Now redeploy with: npx vercel --prod"
