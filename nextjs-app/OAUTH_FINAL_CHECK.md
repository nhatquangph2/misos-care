# 🔍 OAuth Final Check - Kiểm tra cuối cùng

## ✅ CÁC THÔNG TIN CHÍNH XÁC

### Production URLs:
```
Production URL: https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
Callback URL: https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

---

## 📋 CHECKLIST - Copy paste các giá trị này để check

### 1. GOOGLE CLOUD CONSOLE
**Link:** https://console.cloud.google.com/apis/credentials

**Cần kiểm tra:**
- [ ] OAuth 2.0 Client ID đã tạo
- [ ] Application type: Web application
- [ ] Authorized JavaScript origins:
  ```
  https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
  ```
- [ ] Authorized redirect URIs (CHÍNH XÁC):
  ```
  https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
  ```

**Cần copy:**
- Client ID: `_______________` (paste vào Supabase)
- Client Secret: `_______________` (paste vào Supabase)

---

### 2. FACEBOOK DEVELOPERS
**Link:** https://developers.facebook.com/apps

**Cần kiểm tra:**
- [ ] App đã tạo (tên: Miso's Care hoặc tên khác)
- [ ] **App Mode = LIVE** (rất quan trọng!)
  - Góc trên phải toggle phải là "Live" (xanh)
  - Không phải "Development" (xám)

**Facebook Login → Settings:**
- [ ] Valid OAuth Redirect URIs:
  ```
  https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
  ```

**Settings → Basic:**
- App ID: `_______________` (paste vào Supabase)
- App Secret: `_______________` (paste vào Supabase)

---

### 3. SUPABASE - AUTH PROVIDERS
**Link:** https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/providers

**Google Provider:**
- [ ] Toggle "Enable Sign in with Google" = ON
- [ ] Client ID đã paste (từ Google Console)
- [ ] Client Secret đã paste (từ Google Console)
- [ ] Đã click "Save"

**Facebook Provider:**
- [ ] Toggle "Enable Sign in with Facebook" = ON
- [ ] Facebook client ID đã paste (App ID từ Facebook)
- [ ] Facebook client secret đã paste (App Secret từ Facebook)
- [ ] Đã click "Save"

---

### 4. SUPABASE - URL CONFIGURATION
**Link:** https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/url-configuration

**Site URL:**
```
https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app
```

**Redirect URLs (paste cả 2 dòng):**
```
https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/**
https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/auth/callback
```

- [ ] Site URL đã set
- [ ] Redirect URLs đã set (cả 2)
- [ ] Đã click "Save"

---

## 🧪 TEST

**Test URL:** https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/auth/login

### Test Google OAuth:
1. Click "Tiếp tục với Google"
2. Chọn tài khoản Google
3. Cho phép quyền truy cập
4. **Kỳ vọng:** Redirect về app và đã đăng nhập

### Test Facebook OAuth:
1. Click "Tiếp tục với Facebook"
2. Đăng nhập Facebook
3. Cho phép quyền truy cập
4. **Kỳ vọng:** Redirect về app và đã đăng nhập

---

## 🐛 DEBUGGING

### Xem Auth Logs:
**Link:** https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs

**Các lỗi phổ biến:**

#### Error: "redirect_uri_mismatch"
**Nguyên nhân:** Callback URL không khớp
**Fix:**
- Google Console: Phải chính xác `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`
- Facebook: Phải chính xác `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback`

#### Error: "Invalid client credentials"
**Nguyên nhân:** Client ID hoặc Secret sai
**Fix:**
- Copy lại chính xác Client ID và Secret
- Paste lại vào Supabase
- Click Save

#### Error: "This app is in development mode" (Facebook)
**Nguyên nhân:** Facebook app chưa Live
**Fix:**
- Facebook Dashboard → Góc trên phải
- Switch từ "Development" → "Live"

#### Không redirect về app sau khi login
**Nguyên nhân:** Supabase Redirect URLs chưa set
**Fix:**
- Supabase URL Configuration
- Thêm đủ 2 redirect URLs
- Click Save

---

## 📝 INFORMATION TO PROVIDE FOR DEBUG

Nếu vẫn không hoạt động, cung cấp thông tin sau:

1. **Provider đang test:** Google / Facebook
2. **Error message:** (từ Auth Logs hoặc Browser Console)
3. **Điều gì xảy ra:**
   - [ ] Không redirect đến provider
   - [ ] Redirect đến provider nhưng lỗi
   - [ ] Login thành công nhưng không quay về app
   - [ ] Quay về app nhưng không đăng nhập được

4. **Browser Console Errors:** (F12 → Console tab)
   ```
   Copy paste error message ở đây
   ```

5. **Supabase Auth Logs:**
   ```
   Copy paste log message ở đây
   ```

---

## ✅ SUCCESS INDICATORS

Khi OAuth hoạt động đúng:

1. ✅ Click button → Redirect đến Google/Facebook
2. ✅ Đăng nhập thành công
3. ✅ Redirect về: `https://nextjs-3sr1d80ks-nhatquangs-projects-d08dceef.vercel.app/`
4. ✅ User đã đăng nhập (có thể test bằng cách vào `/profile`)
5. ✅ Supabase Auth Logs hiển thị "Signed in" event

---

## 🚨 QUICK FIXES

### Fix 1: Clear everything và setup lại
```bash
# Trong Supabase Providers
1. Disable Google → Save
2. Enable Google → Paste lại credentials → Save
3. Test lại
```

### Fix 2: Verify Callback URL
```bash
# Chính xác phải là (KHÔNG có dấu cách, KHÔNG có / cuối):
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

### Fix 3: Test với Incognito Mode
```bash
# Mở Incognito/Private window
# Test lại OAuth
# Loại trừ vấn đề cache/cookies
```

---

**Cập nhật:** $(date)
