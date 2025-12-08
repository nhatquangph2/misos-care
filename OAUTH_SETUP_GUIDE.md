# OAuth Setup Guide - Miso's Care

Hướng dẫn chi tiết cách setup OAuth cho Google, Facebook, và GitHub.

## 🎯 Tổng quan

App hiện đã có sẵn:
- ✅ Login page với OAuth buttons
- ✅ Callback route xử lý OAuth
- ✅ Middleware bảo vệ routes
- ✅ Supabase clients

Bạn cần:
- 🔧 Cấu hình OAuth providers trên Google, Facebook, GitHub
- 🔧 Kích hoạt providers trên Supabase
- 🔧 Test OAuth flow

## 🚀 Quick Start

```bash
# Run helper script to open all config pages
./setup-oauth.sh
```

## 📋 Redirect URLs cần dùng

**Production (Supabase):**
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

**Development (Local):**
```
http://localhost:3000/auth/callback
```

**⚠️ LƯU Ý:** Supabase tự động xử lý redirect đến callback endpoint của nó trước, sau đó mới redirect về app của bạn.

---

## 1️⃣ Google OAuth Setup

### Bước 1: Tạo OAuth Client trên Google Cloud Console

1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Tạo project mới hoặc chọn project có sẵn
3. Click **"Create Credentials"** → **"OAuth client ID"**
4. Chọn **"Web application"**
5. Đặt tên: `Miso's Care`

### Bước 2: Cấu hình Authorized Redirect URIs

Thêm các URLs sau:

```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

### Bước 3: Lưu Credentials

- Copy **Client ID**
- Copy **Client Secret**

### Bước 4: Kích hoạt trên Supabase

1. Truy cập: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
2. Tìm **Google**
3. Bật **Enable Sign in with Google**
4. Paste **Client ID** và **Client Secret**
5. Click **Save**

---

## 2️⃣ Facebook OAuth Setup

### Bước 1: Tạo Facebook App

1. Truy cập: https://developers.facebook.com/apps
2. Click **"Create App"**
3. Chọn **"Consumer"** (for login)
4. Đặt tên: `Miso's Care`
5. Thêm **Facebook Login** product

### Bước 2: Cấu hình Facebook Login

1. Vào **Facebook Login** → **Settings**
2. Trong **Valid OAuth Redirect URIs**, thêm:

```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

3. Click **Save Changes**

### Bước 3: Lấy Credentials

1. Vào **Settings** → **Basic**
2. Copy **App ID**
3. Copy **App Secret** (click Show)

### Bước 4: Chuyển App sang Live Mode

1. Vào **App Mode** ở góc trên
2. Chuyển từ **Development** sang **Live**
3. Điền thông tin Privacy Policy URL, Terms of Service URL nếu cần

### Bước 5: Kích hoạt trên Supabase

1. Truy cập: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
2. Tìm **Facebook**
3. Bật **Enable Sign in with Facebook**
4. Paste **App ID** vào **Facebook client ID**
5. Paste **App Secret** vào **Facebook client secret**
6. Click **Save**

---

## 3️⃣ GitHub OAuth Setup

### Bước 1: Tạo GitHub OAuth App

1. Truy cập: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Điền thông tin:
   - **Application name:** `Miso's Care`
   - **Homepage URL:** `http://localhost:3000` (hoặc domain production)
   - **Authorization callback URL:** `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`

### Bước 2: Lấy Credentials

1. Sau khi tạo, copy **Client ID**
2. Click **"Generate a new client secret"**
3. Copy **Client Secret** (chỉ hiện 1 lần!)

### Bước 3: Kích hoạt trên Supabase

1. Truy cập: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
2. Tìm **GitHub**
3. Bật **Enable Sign in with GitHub**
4. Paste **Client ID** và **Client Secret**
5. Click **Save**

---

## 4️⃣ Cấu hình Supabase URL Configuration

### Bước 1: Site URL

1. Truy cập: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/url-configuration
2. Set **Site URL:**
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### Bước 2: Redirect URLs

Thêm vào **Redirect URLs:**

```
http://localhost:3000/**
http://localhost:3000/auth/callback
https://your-domain.com/**
https://your-domain.com/auth/callback
```

⚠️ **Wildcard `**` pattern** cho phép tất cả các paths.

---

## 🧪 Testing OAuth Flow

### Test trên Development

1. Start dev server:
```bash
cd nextjs-app
npm run dev
```

2. Mở browser: `http://localhost:3000/auth/login`

3. Click vào một OAuth button (Google/Facebook/GitHub)

4. Kiểm tra flow:
   - ✅ Redirect đến OAuth provider
   - ✅ Login với account
   - ✅ Redirect về `http://localhost:3000/auth/callback`
   - ✅ Session được tạo
   - ✅ Auto redirect đến `/dashboard`

### Debug OAuth Issues

#### Issue 1: "Redirect URI mismatch"

**Nguyên nhân:** Redirect URI không khớp

**Giải pháp:**
- Check redirect URI trên OAuth provider phải là: `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`
- Không phải `http://localhost:3000/auth/callback`

#### Issue 2: "Provider not enabled"

**Nguyên nhân:** Provider chưa được kích hoạt trên Supabase

**Giải pháp:**
1. Vào Supabase Dashboard
2. Authentication → Providers
3. Bật provider tương ứng
4. Nhập Client ID và Secret

#### Issue 3: "Session not created"

**Nguyên nhân:** Cookie không được set

**Giải pháp:**
1. Check middleware đang chạy
2. Check callback route có xử lý `exchangeCodeForSession`
3. Check browser cookies (DevTools → Application → Cookies)

---

## 📊 OAuth Flow Diagram

```
User clicks "Continue with Google"
         ↓
App redirects to: https://accounts.google.com/...?redirect_uri=https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
         ↓
User logs in with Google
         ↓
Google redirects to: https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback?code=xxx
         ↓
Supabase exchanges code for session
         ↓
Supabase redirects to: http://localhost:3000/auth/callback?code=xxx
         ↓
App's callback route exchanges code for session
         ↓
Redirect to: http://localhost:3000/dashboard
         ↓
User is logged in! 🎉
```

---

## 🔐 Security Checklist

- ✅ Client Secrets được lưu trên Supabase (không hardcode trong code)
- ✅ Redirect URLs được whitelist
- ✅ HTTPS được dùng trên production
- ✅ Session cookies có httpOnly flag
- ✅ Middleware refresh tokens automatically

---

## 🚀 Deploy to Production

### Bước 1: Update Site URL

Trên Supabase → Authentication → URL Configuration:
- Site URL: `https://your-domain.com`
- Redirect URLs: Thêm production URLs

### Bước 2: Update OAuth Apps

Trên mỗi OAuth provider (Google/Facebook/GitHub):
- Thêm production redirect URI: `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`
- Thêm production homepage URL: `https://your-domain.com`

### Bước 3: Deploy

```bash
# Deploy to Vercel
cd nextjs-app
vercel --prod

# Or deploy to your platform of choice
```

---

## 📞 Support

Nếu gặp vấn đề:

1. **Check Supabase Logs:**
   - https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs

2. **Check Browser Console:**
   - F12 → Console tab
   - Network tab để xem OAuth requests

3. **Check Supabase Status:**
   ```bash
   cd nextjs-app
   npx supabase status
   ```

---

## ✅ Completion Checklist

- [ ] Google OAuth configured
- [ ] Facebook OAuth configured
- [ ] GitHub OAuth configured
- [ ] Supabase providers enabled
- [ ] Redirect URLs added to all providers
- [ ] Site URL configured on Supabase
- [ ] Tested Google login
- [ ] Tested Facebook login
- [ ] Tested GitHub login
- [ ] User session persists after refresh
- [ ] Protected routes work correctly

---

**Created:** 2025-12-08
**Project:** Miso's Care - Mental Health & Personality Test Platform
