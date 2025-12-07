#!/bin/bash

# Script to add environment variables to Vercel

cd /Users/tranhuykhiem/misos-care/nextjs-app

# Add NEXT_PUBLIC_SUPABASE_URL
printf "https://suzsukdrnoarzsixfycr.supabase.co\nn\n" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production preview development

# Add NEXT_PUBLIC_SUPABASE_ANON_KEY
printf "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1enN1a2Rybm9hcnpzaXhmeWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTM1NTUsImV4cCI6MjA4MDIyOTU1NX0.TaMCw08hqrGsH5xe-x1W3xrSSpyQopfEjsUr-eZ33Gg\nn\n" | npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview development

# Add NEXT_PUBLIC_APP_NAME
printf "Miso's Care\nn\n" | npx vercel env add NEXT_PUBLIC_APP_NAME production preview development

# Add NEXT_PUBLIC_APP_VERSION
printf "1.0.0\nn\n" | npx vercel env add NEXT_PUBLIC_APP_VERSION production preview development

# Add NODE_ENV
printf "production\nn\n" | npx vercel env add NODE_ENV production

echo "✅ All environment variables added successfully!"
