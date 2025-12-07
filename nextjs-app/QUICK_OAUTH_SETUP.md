# ⚡ Quick OAuth Setup - 5 phút hoàn thành!

## 🎯 Làm theo đúng thứ tự này:

### ✅ BƯỚC 1: Mở Supabase Dashboard

```bash
# Click vào link này:
open https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
```

Hoặc truy cập: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers

---

## 🔵 GOOGLE OAUTH (2 phút)

### 1. Tạo Google OAuth App

```bash
# Click để mở Google Cloud Console:
open https://console.cloud.google.com/apis/credentials
```

### 2. Làm theo:
1. Click **"Create Credentials"** → **"OAuth client ID"**
2. Nếu chưa có OAuth consent screen, click **"Configure Consent Screen"**:
   - Chọn **External** → Next
   - App name: `Miso's Care`
   - User support email: *email của bạn*
   - Developer contact: *email của bạn*
   - Click **Save and Continue** (bỏ qua các bước còn lại)

3. Quay lại **Credentials**, click **"Create Credentials"** → **"OAuth client ID"**
4. Application type: **Web application**
5. Name: `Miso's Care`

6. **Authorized JavaScript origins**:
   ```
   https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
   ```

7. **Authorized redirect URIs**:
   ```
   https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
   ```

8. Click **Create**
9. **Copy Client ID và Client Secret** (giữ lại để paste vào Supabase)

### 3. Cấu hình trong Supabase:

1. Quay lại Supabase: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
2. Tìm **Google**, click để expand
3. Toggle **Enable Sign in with Google** = ON
4. Paste **Client ID** (from Google)
5. Paste **Client Secret** (from Google)
6. Click **Save**

✅ **Google OAuth xong!**

---

## 🔴 GITHUB OAUTH (1 phút - Dễ nhất!)

### 1. Tạo GitHub OAuth App

```bash
# Click để mở GitHub Developer Settings:
open https://github.com/settings/applications/new
```

### 2. Điền form:
- **Application name**: `Miso's Care`
- **Homepage URL**:
  ```
  https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
  ```
- **Authorization callback URL**:
  ```
  https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
  ```

3. Click **Register application**
4. Copy **Client ID**
5. Click **Generate a new client secret** → Copy **Client Secret**

### 3. Cấu hình trong Supabase:

1. Quay lại Supabase: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
2. Tìm **GitHub**, click để expand
3. Toggle **Enable Sign in with GitHub** = ON
4. Paste **Client ID** (from GitHub)
5. Paste **Client Secret** (from GitHub)
6. Click **Save**

✅ **GitHub OAuth xong!**

---

## 🔴 FACEBOOK OAUTH (3 phút)

### 1. Tạo Facebook App

```bash
# Click để mở Facebook Developers:
open https://developers.facebook.com/apps/create/
```

### 2. Làm theo:
1. Click **Create App**
2. Use case: Chọn **Authenticate and request data from users with Facebook Login**
3. Click **Next**
4. App type: **Consumer** → Next
5. App name: `Miso's Care`
6. Contact email: *email của bạn*
7. Click **Create App**

### 3. Setup Facebook Login:

1. Trong App Dashboard, tìm **Add Products to Your App**
2. Tìm **Facebook Login** → Click **Set up**
3. Chọn platform: **Web**
4. Site URL:
   ```
   https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
   ```
5. Click **Save** → **Continue**

### 4. Cấu hình Redirect URI:

1. Sidebar: **Facebook Login** → **Settings**
2. Trong **Valid OAuth Redirect URIs**, paste:
   ```
   https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
   ```
3. Click **Save Changes**

### 5. Get App ID và Secret:

1. Sidebar: **Settings** → **Basic**
2. Copy **App ID**
3. Click **Show** bên cạnh **App Secret** → Copy **App Secret**

### 6. Cấu hình trong Supabase:

1. Quay lại Supabase: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers
2. Tìm **Facebook**, click để expand
3. Toggle **Enable Sign in with Facebook** = ON
4. Paste **Facebook client ID** (App ID from Facebook)
5. Paste **Facebook client secret** (App Secret from Facebook)
6. Click **Save**

### 7. Switch to Live Mode (QUAN TRỌNG!):

1. Quay lại Facebook App Dashboard
2. Góc trên phải, toggle từ **Development** → **Live**
3. Nếu yêu cầu Privacy Policy, dùng tạm:
   ```
   https://www.termsfeed.com/live/your-privacy-policy
   ```
4. Click **Switch Mode**

✅ **Facebook OAuth xong!**

---

## 🔧 BƯỚC CUỐI: Cấu hình Supabase URLs

1. Vào: https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/url-configuration
2. **Site URL**:
   ```
   https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
   ```
3. **Redirect URLs** (paste cả 2):
   ```
   https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/**
   https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/auth/callback
   ```
4. Click **Save**

---

## ✅ TEST NGAY!

1. Truy cập: https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/auth/login
2. Click **"Tiếp tục với Google"** / **"GitHub"** / **"Facebook"**
3. Đăng nhập và cho phép quyền
4. Bạn sẽ được redirect về app!

---

## 🐛 Nếu gặp lỗi:

### "redirect_uri_mismatch"
→ Kiểm tra lại redirect URI, phải chính xác:
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

### "This app is in development mode" (Facebook)
→ Switch sang **Live mode** trong Facebook App Dashboard

### Không redirect sau khi đăng nhập
→ Kiểm tra Supabase Redirect URLs đã add chưa

### Check logs để debug:
```bash
# Mở Supabase Logs:
open https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs
```

---

## 📋 CHECKLIST HOÀN THÀNH

- [ ] Google OAuth credentials created
- [ ] Google OAuth enabled in Supabase
- [ ] GitHub OAuth app created
- [ ] GitHub OAuth enabled in Supabase
- [ ] Facebook App created
- [ ] Facebook Login configured
- [ ] Facebook app switched to Live mode
- [ ] Facebook OAuth enabled in Supabase
- [ ] Supabase Site URL updated
- [ ] Supabase Redirect URLs updated
- [ ] Tested login with Google ✓
- [ ] Tested login with GitHub ✓
- [ ] Tested login with Facebook ✓

---

## 🎉 HOÀN THÀNH!

Giờ người dùng có thể đăng nhập bằng Google, Facebook hoặc GitHub!

**Lưu ý**:
- Google và GitHub sẽ hoạt động ngay
- Facebook cần switch sang Live mode mới hoạt động với user ngoài
