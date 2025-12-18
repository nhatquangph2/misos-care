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

### Step 3: Environment Variables ⚠️ QUAN TRỌNG

**Bước 3.1: Lấy Supabase Credentials**

1. Truy cập: https://supabase.com/dashboard/project/_/settings/api
2. Copy 2 giá trị:
   - **Project URL** (ví dụ: `https://xxxxx.supabase.co`)
   - **Anon/Public Key** (key dài bắt đầu với `eyJhbGc...`)

**Bước 3.2: Thêm vào Vercel**

1. Vào [Vercel Project Settings](https://vercel.com/dashboard)
2. Chọn project `misos-care` (ID: `prj_tUgf8zaFP1zSumSGhqLfzEb6Yvrj`)
3. Click **Settings** → **Environment Variables**
4. Thêm từng biến với **tất cả 3 environments** (Production, Preview, Development):

   | Variable Name | Value | Where to Get |
   |---------------|-------|--------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase Settings → API → Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Supabase Settings → API → Project API keys → anon/public |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | URL của Vercel deployment (có thể để sau) |

5. Click **Save** cho mỗi biến

**Bước 3.3: Trigger Redeploy**

Sau khi thêm xong environment variables:
1. Vào tab **Deployments**
2. Click vào deployment mới nhất (commit `407a7f0`)
3. Click nút **Redeploy** ở góc phải
4. Chọn **Use existing Build Cache** (nhanh hơn)
5. Click **Redeploy**

> 💡 **Lưu ý**: Xem file `nextjs-app/.env.example` để biết format đúng của các biến môi trường.

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
