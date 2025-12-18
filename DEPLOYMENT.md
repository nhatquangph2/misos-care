# 🚀 Deployment Guide

## Vercel Project
- **Project ID**: `prj_tUgf8zaFP1zSumSGhqLfzEb6Yvrj`
- **Framework**: Next.js
- **Region**: Singapore (sin1)

## Automatic Deployment Setup

### Step 1: Connect GitHub to Vercel

1. Truy cập [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn project với ID: `prj_tUgf8zaFP1zSumSGhqLfzEb6Yvrj`
3. Vào **Settings** → **Git**
4. Connect với repository: `nhatquangph2/misos-care`

### Step 2: Configure Build Settings

Vercel đã được cấu hình sẵn trong `vercel.json`:
```json
{
  "buildCommand": "cd nextjs-app && npm run build",
  "devCommand": "cd nextjs-app && npm run dev",
  "installCommand": "cd nextjs-app && npm install",
  "framework": null,
  "outputDirectory": "nextjs-app/.next"
}
```

### Step 3: Environment Variables

Đảm bảo đã set các biến môi trường sau trong Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

### Step 4: Deploy

Sau khi setup xong, mỗi lần push code lên branch `claude/deploy-app-9igkH` hoặc main branch, Vercel sẽ tự động:
1. Pull code mới nhất
2. Install dependencies
3. Build Next.js app
4. Deploy lên production

## Manual Deployment (CLI)

Nếu bạn muốn deploy thủ công:

```bash
# Login to Vercel
npx vercel login

# Deploy to production
npx vercel --prod

# Or deploy to preview
npx vercel
```

## Deployment Status

Kiểm tra deployment status tại:
- Dashboard: https://vercel.com/dashboard
- Project URL: Sẽ được cung cấp sau khi deploy

## Troubleshooting

### Build Errors
Nếu gặp lỗi Google Fonts trong môi trường local, đừng lo lắng - Vercel sẽ build thành công trên server của họ.

### Environment Variables
Đảm bảo tất cả env variables được set trong Vercel Dashboard, không dùng `.env.local` trên production.

---

**Last Updated**: 2025-12-18
