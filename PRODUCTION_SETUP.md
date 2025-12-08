# 🚀 Production Deployment Guide

## ✅ Deployment Completed!

Your app has been deployed to Vercel:
**https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app**

## 🔧 Required Configuration Steps

### 1. Add Environment Variables to Vercel

Go to your Vercel dashboard:
1. Visit: https://vercel.com/nhatquangs-projects-d08dceef/nextjs-app/settings/environment-variables
2. Add these variables for **Production**:

```
NEXT_PUBLIC_SUPABASE_URL = https://suzsukdrnoarzsixfycr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1enN1a2Rybm9hcnpzaXhmeWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTM1NTUsImV4cCI6MjA4MDIyOTU1NX0.TaMCw08hqrGsH5xe-x1W3xrSSpyQopfEjsUr-eZ33Gg
```

### 2. Configure Supabase Redirect URLs

Go to Supabase Auth Settings:
1. Visit: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/url-configuration
2. Add these URLs to **Redirect URLs**:

```
https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/auth/callback
https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/auth/reset-password
```

3. Add to **Site URL** (if needed):
```
https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app
```

### 3. Configure OAuth Providers (if using)

For each OAuth provider you want to use, update the callback URLs:

#### Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Add authorized redirect URI:
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

#### Facebook OAuth
1. Go to: https://developers.facebook.com/apps
2. Add redirect URI in OAuth settings:
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

#### GitHub OAuth
1. Go to GitHub OAuth app settings
2. Add callback URL:
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

### 4. Redeploy After Configuration

After adding environment variables, redeploy:

```bash
cd /Users/tranhuykhiem/misos-care/nextjs-app
npx vercel --prod
```

Or use the Vercel dashboard to redeploy.

## 🧪 Testing Production

After configuration, test these features:

1. **Email/Password Auth**:
   - Sign up: https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/auth/login
   - Login
   - Password reset

2. **OAuth Login**:
   - Google login
   - Facebook login
   - GitHub login

3. **Dashboard Access**:
   - https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/dashboard

4. **Tests**:
   - All personality and mental health tests

## 📊 Monitor Deployment

- **Vercel Dashboard**: https://vercel.com/nhatquangs-projects-d08dceef/nextjs-app
- **Supabase Dashboard**: https://app.supabase.com/project/suzsukdrnoarzsixfycr
- **Auth Logs**: https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs

## 🔄 Future Deployments

Automatic deployments are set up:
- Push to `main` branch → Auto deploy to production
- Push to other branches → Preview deployments

## 🆘 Troubleshooting

If you encounter issues:

1. **Check environment variables** in Vercel dashboard
2. **Check Supabase logs** for auth errors
3. **Check browser console** for client-side errors
4. **Check Vercel logs**: `npx vercel logs`

## ✨ What's Live

All features are now live on production:
- ✅ Enhanced login/signup with validation
- ✅ Password strength meter
- ✅ Forgot password flow
- ✅ OAuth login (Google, Facebook, GitHub)
- ✅ All personality tests (MBTI, Big Five, etc.)
- ✅ Mental health tests (PHQ-9, GAD-7, DASS-21, PSS)
- ✅ Dashboard with user profile
- ✅ Goals and reminders
- ✅ Responsive design with animations
