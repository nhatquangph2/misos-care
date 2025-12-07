# 🚀 Hướng dẫn Deploy lên Vercel

## Điều kiện tiên quyết

- ✅ Tài khoản GitHub (đã có code trong repo)
- ✅ Tài khoản Vercel (đăng ký miễn phí tại [vercel.com](https://vercel.com))
- ✅ Supabase project đã setup (có URL và ANON_KEY)

## Bước 1: Chuẩn bị Repository

### 1.1. Commit và Push code lên GitHub

```bash
cd /Users/tranhuykhiem/misos-care
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

## Bước 2: Deploy lên Vercel

### 2.1. Import Project từ GitHub

1. Truy cập [vercel.com/new](https://vercel.com/new)
2. Đăng nhập bằng GitHub
3. Click **"Import Git Repository"**
4. Chọn repository: `misos-care`
5. Click **"Import"**

### 2.2. Cấu hình Project Settings

**Root Directory:** `nextjs-app`

⚠️ **QUAN TRỌNG**: Vì code Next.js của bạn nằm trong thư mục `nextjs-app`, bạn phải set Root Directory trong Vercel.

**Framework Preset:** Next.js (sẽ tự động nhận diện)

**Build Command:** `npm run build` (đã có trong vercel.json)

**Output Directory:** `.next` (mặc định)

**Install Command:** `npm install` (đã có trong vercel.json)

### 2.3. Cấu hình Environment Variables

Trong phần **"Environment Variables"**, thêm các biến sau:

```
NEXT_PUBLIC_SUPABASE_URL=https://suzsukdrnoarzsixfycr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1enN1a2Rybm9hcnpzaXhmeWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTM1NTUsImV4cCI6MjA4MDIyOTU1NX0.TaMCw08hqrGsH5xe-x1W3xrSSpyQopfEjsUr-eZ33Gg
NEXT_PUBLIC_APP_NAME=Miso's Care
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

**Lưu ý:**
- OPENAI_API_KEY: Chỉ thêm khi bạn đã có key thật (hiện tại chưa cần)
- Đảm bảo chọn **"Production"**, **"Preview"**, và **"Development"** cho tất cả các biến

### 2.4. Deploy

1. Click **"Deploy"**
2. Đợi 2-3 phút để Vercel build và deploy
3. Sau khi hoàn thành, bạn sẽ nhận được URL production (ví dụ: `misos-care.vercel.app`)

## Bước 3: Cấu hình Supabase cho Production

### 3.1. Thêm Production URL vào Supabase

1. Truy cập [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Settings** → **Authentication** → **URL Configuration**
4. Thêm Vercel URL vào **Site URL** và **Redirect URLs**:
   ```
   Site URL: https://your-app.vercel.app
   Redirect URLs:
   - https://your-app.vercel.app
   - https://your-app.vercel.app/auth/callback
   ```

### 3.2. Cập nhật CORS (nếu cần)

Trong **Settings** → **API**:
- Thêm domain Vercel vào **Allowed Origins** nếu gặp lỗi CORS

## Bước 4: Testing Production

1. Truy cập URL production của bạn
2. Test các chức năng:
   - ✅ Đăng ký tài khoản mới
   - ✅ Đăng nhập
   - ✅ Làm các bài test (PHQ-9, GAD-7, etc.)
   - ✅ Xem kết quả
   - ✅ Trang Profile

## Bước 5: Custom Domain (Optional)

Nếu bạn muốn sử dụng domain riêng:

1. Trong Vercel Dashboard → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Nhập domain của bạn (ví dụ: `misoscare.com`)
4. Cấu hình DNS records theo hướng dẫn của Vercel

## Auto-Deploy

Sau khi setup xong, mỗi khi bạn push code lên GitHub:
- **main branch** → tự động deploy lên Production
- **other branches** → tự động tạo Preview deployments

## Troubleshooting

### Lỗi Build Failed

```bash
# Kiểm tra build locally trước
cd nextjs-app
npm run build
```

Nếu build thành công ở local nhưng failed trên Vercel:
- Kiểm tra Node version (Vercel mặc định dùng Node 18)
- Kiểm tra environment variables đã đầy đủ chưa

### Lỗi 404 khi truy cập

- Kiểm tra **Root Directory** đã set đúng `nextjs-app` chưa

### Lỗi Authentication

- Kiểm tra Supabase Redirect URLs đã cấu hình đúng chưa
- Kiểm tra environment variables trong Vercel

### Lỗi CORS

- Thêm Vercel domain vào Supabase Allowed Origins

## Monitoring

Vercel cung cấp:
- **Analytics**: Theo dõi traffic và performance
- **Logs**: Xem runtime logs
- **Speed Insights**: Đo performance

Truy cập tại: Dashboard → Project → Analytics/Logs

## Cost

- **Free tier** của Vercel đủ cho development và small projects
- Includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Serverless Functions
  - Automatic HTTPS

## Useful Commands

```bash
# Deploy từ CLI (sau khi cài Vercel CLI)
npm i -g vercel
vercel login
vercel --prod

# Xem logs
vercel logs

# Xem environment variables
vercel env ls
```

## Next Steps

Sau khi deploy thành công:

1. ✅ Test toàn bộ chức năng trên production
2. ✅ Setup monitoring và error tracking (ví dụ: Sentry)
3. ✅ Cấu hình custom domain (nếu có)
4. ✅ Setup analytics (Google Analytics, Mixpanel, etc.)
5. ✅ Cải thiện performance (Lighthouse score)

---

**Chúc bạn deploy thành công! 🎉**

Nếu gặp vấn đề, check Vercel deployment logs hoặc liên hệ support.
