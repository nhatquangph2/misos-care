# 🔐 Hướng dẫn Setup OAuth Login (Google, Facebook, GitHub)

## 📋 Tổng quan

Hướng dẫn này sẽ giúp bạn cấu hình đăng nhập bằng Google, Facebook và GitHub cho ứng dụng Miso's Care.

**Production URL**: `https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app`
**Callback URL**: `https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app/auth/callback`

---

## 🔵 1. Google OAuth Setup

### Bước 1: Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Tên project: `Miso's Care` (hoặc tùy chọn)

### Bước 2: Enable Google+ API

1. Vào **APIs & Services** → **Library**
2. Tìm "Google+ API"
3. Click **Enable**

### Bước 3: Tạo OAuth Credentials

1. Vào **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Chọn **Application type**: Web application
4. Đặt tên: `Miso's Care Web`

5. **Authorized JavaScript origins**:
   ```
   https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app
   ```

6. **Authorized redirect URIs**:
   ```
   https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
   ```

7. Click **Create**
8. Sao chép **Client ID** và **Client Secret**

### Bước 4: Cấu hình trong Supabase

1. Truy cập [Supabase Dashboard](https://app.supabase.com)
2. Chọn project của bạn
3. Vào **Authentication** → **Providers**
4. Tìm **Google** và click để mở
5. Bật **Enable Sign in with Google**
6. Paste **Client ID** và **Client Secret** vừa copy
7. Click **Save**

---

## 🔴 2. Facebook OAuth Setup

### Bước 1: Tạo Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** → **Create App**
3. Chọn **Consumer** → **Next**
4. Đặt tên app: `Miso's Care`
5. Contact Email: email của bạn
6. Click **Create App**

### Bước 2: Setup Facebook Login

1. Trong dashboard của app, tìm **Facebook Login**
2. Click **Set Up**
3. Chọn **Web**
4. Site URL: `https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app`

### Bước 3: Configure OAuth Redirect URIs

1. Vào **Facebook Login** → **Settings**
2. Trong **Valid OAuth Redirect URIs**, thêm:
   ```
   https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
   ```
3. Click **Save Changes**

### Bước 4: Get App ID và App Secret

1. Vào **Settings** → **Basic**
2. Copy **App ID**
3. Click **Show** bên cạnh **App Secret** → Copy

### Bước 5: Cấu hình trong Supabase

1. Truy cập [Supabase Dashboard](https://app.supabase.com)
2. Vào **Authentication** → **Providers**
3. Tìm **Facebook** và click để mở
4. Bật **Enable Sign in with Facebook**
5. Paste **Facebook client ID** (App ID)
6. Paste **Facebook client secret** (App Secret)
7. Click **Save**

### Bước 6: Switch to Live Mode (Quan trọng!)

1. Trong Facebook App Dashboard
2. Góc trên cùng, switch từ **Development** sang **Live**
3. Điền thông tin cần thiết (Privacy Policy URL, etc.)

**Privacy Policy URL** (tạm thời có thể dùng):
```
https://www.termsfeed.com/live/your-privacy-policy-url
```

---

## ⚫ 3. GitHub OAuth Setup

### Bước 1: Tạo GitHub OAuth App

1. Truy cập [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**

### Bước 2: Điền thông tin

- **Application name**: `Miso's Care`
- **Homepage URL**:
  ```
  https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app
  ```
- **Authorization callback URL**:
  ```
  https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
  ```

3. Click **Register application**

### Bước 3: Get Client ID và Secret

1. Sau khi tạo, copy **Client ID**
2. Click **Generate a new client secret**
3. Copy **Client Secret** (chỉ hiện 1 lần!)

### Bước 4: Cấu hình trong Supabase

1. Truy cập [Supabase Dashboard](https://app.supabase.com)
2. Vào **Authentication** → **Providers**
3. Tìm **GitHub** và click để mở
4. Bật **Enable Sign in with GitHub**
5. Paste **GitHub client ID**
6. Paste **GitHub client secret**
7. Click **Save**

---

## 🔧 4. Cấu hình Supabase Redirect URLs

Sau khi cấu hình xong OAuth providers, cần thêm production URL:

1. Vào **Authentication** → **URL Configuration**
2. **Site URL**:
   ```
   https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app
   ```
3. **Redirect URLs** (thêm):
   ```
   https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app/**
   https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app/auth/callback
   ```
4. Click **Save**

---

## ✅ 5. Testing

### Test Flow:

1. Truy cập: `https://nextjs-d0ik4zflq-nhatquangs-projects-d08dceef.vercel.app/auth/login`
2. Click "Tiếp tục với Google" / "Facebook" / "GitHub"
3. Đăng nhập với tài khoản của bạn
4. Cho phép quyền truy cập
5. Bạn sẽ được redirect về app và đã đăng nhập

### Debug OAuth Issues:

Nếu gặp lỗi, kiểm tra:

1. **Supabase Logs**:
   - Dashboard → Logs → Auth Logs
   - Xem chi tiết lỗi

2. **Callback URL đúng chưa**:
   - Phải là: `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`

3. **Redirect URL trong provider settings**:
   - Google: Authorized redirect URIs
   - Facebook: Valid OAuth Redirect URIs
   - GitHub: Authorization callback URL

4. **App đang ở Live mode chưa** (Facebook):
   - Development mode không hoạt động với user ngoài

---

## 📝 Quick Reference

| Provider | Dashboard URL | Callback URL |
|----------|---------------|--------------|
| Google | [console.cloud.google.com](https://console.cloud.google.com/) | `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback` |
| Facebook | [developers.facebook.com](https://developers.facebook.com/) | `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback` |
| GitHub | [github.com/settings/developers](https://github.com/settings/developers) | `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback` |

---

## 🎯 Sau khi setup xong

1. ✅ Test đăng nhập với cả 3 providers
2. ✅ Kiểm tra user được tạo trong Supabase Auth
3. ✅ Kiểm tra profile được tạo trong `users` table
4. ✅ Test logout và đăng nhập lại

---

## 🆘 Troubleshooting

### Lỗi: "redirect_uri_mismatch"
- Kiểm tra lại redirect URI trong OAuth app settings
- Phải chính xác: `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`

### Lỗi: "This app is in development mode"
- Facebook: Switch sang Live mode trong App Dashboard
- Thêm Privacy Policy URL

### Lỗi: "Invalid state parameter"
- Clear cookies và thử lại
- Kiểm tra Supabase Site URL đã đúng chưa

### User được tạo nhưng không redirect
- Kiểm tra `auth/callback/route.ts` đã tồn tại chưa
- Check Supabase Redirect URLs đã thêm production URL chưa

---

**Chúc bạn setup thành công! 🎉**

Nếu cần hỗ trợ, check Supabase Auth Logs để xem chi tiết lỗi.
