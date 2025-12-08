# 🔧 Fix OAuth on Production

## ❌ Vấn đề hiện tại:
- Local (localhost:3001): OAuth works ✅
- Production (Vercel): OAuth fails ❌

## 🎯 Nguyên nhân:
Supabase chưa có production URL trong whitelist!

---

## ✅ GIẢI PHÁP - Làm ngay 3 bước:

### Bước 1: Update Supabase URL Configuration

**Đã mở tab:** https://app.supabase.com/project/suzsukdrnoarzsixfycr/auth/url-configuration

**Làm theo:**

1. **Site URL** - Thay đổi thành:
   ```
   https://nextjs-eie6yvqbf-nhatquangs-projects-d08dceef.vercel.app
   ```

2. **Redirect URLs** - Thêm vào list (giữ localhost, thêm production):
   ```
   http://localhost:3000/**
   http://localhost:3001/**
   https://nextjs-eie6yvqbf-nhatquangs-projects-d08dceef.vercel.app/**
   https://nextjs-eie6yvqbf-nhatquangs-projects-d08dceef.vercel.app/auth/callback
   ```

3. Click **Save**

---

### Bước 2: Update Google OAuth (nếu dùng Google)

**Mở:** https://console.cloud.google.com/apis/credentials

**Chọn OAuth Client ID** của bạn

**Authorized redirect URIs** - Thêm:
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

**Lưu ý:** URI này KHÔNG thay đổi dù deploy ở đâu, vì Supabase xử lý redirect trước!

✅ Nếu đã có rồi → OK, không cần sửa

---

### Bước 3: Update Facebook OAuth (nếu dùng Facebook)

**Mở:** https://developers.facebook.com/apps

**Chọn app** → **Facebook Login** → **Settings**

**Valid OAuth Redirect URIs** - Thêm (nếu chưa có):
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

**Save Changes**

---

### Bước 4: Update GitHub OAuth (nếu dùng GitHub)

**Mở:** https://github.com/settings/developers

**Chọn OAuth App**

**Authorization callback URL** - Phải là:
```
https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback
```

✅ Nếu đã đúng → OK

---

## 🧪 Test sau khi update:

1. Vào production: https://nextjs-eie6yvqbf-nhatquangs-projects-d08dceef.vercel.app/auth/login

2. Click "Continue with Google"

3. Kiểm tra flow:
   - ✅ Redirect đến Google
   - ✅ Login với Google
   - ✅ Redirect về app
   - ✅ Vào được `/dashboard`

---

## 📊 OAuth Flow Diagram (Production)

```
User clicks "Continue with Google" on Production
         ↓
Redirect to: https://accounts.google.com/...
         ↓
Google redirects to: https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback?code=xxx
         ↓
Supabase checks: Is "nextjs-eie6yvqbf..." in allowed redirect URLs? ← THIS MUST BE YES!
         ↓
Supabase redirects to: https://nextjs-eie6yvqbf.../auth/callback?code=xxx
         ↓
App exchanges code for session
         ↓
Redirect to: /dashboard
         ↓
SUCCESS! 🎉
```

---

## 🔍 Common Errors & Solutions

### Error: "redirect_uri_mismatch"
**Cause:** Supabase redirect URL not whitelisted
**Fix:** Add production URL to Supabase URL Configuration (Bước 1)

### Error: "Invalid redirect_uri"
**Cause:** OAuth provider (Google/Facebook/GitHub) doesn't have Supabase callback
**Fix:** Make sure `https://suzsukdrnoarzsixfycr.supabase.co/auth/v1/callback` is in provider settings

### Error: "Unauthorized redirect"
**Cause:** Site URL in Supabase doesn't match production
**Fix:** Update Site URL to production domain

---

## ✅ Checklist

Hoàn thành các bước sau:

- [ ] Supabase Site URL = Production URL
- [ ] Supabase Redirect URLs includes production domain
- [ ] Google OAuth has Supabase callback URL
- [ ] Facebook OAuth has Supabase callback URL
- [ ] GitHub OAuth has Supabase callback URL
- [ ] Tested login on production
- [ ] Successfully redirected to dashboard

---

## 💡 Pro Tips

### Khi deploy lên domain mới:
1. Update Supabase Site URL
2. Add domain to Redirect URLs
3. Test OAuth

### Khi dùng custom domain:
1. Sau khi add domain trên Vercel
2. Update Supabase với domain mới
3. Có thể remove Vercel auto-generated URL

### Development vs Production:
- Development: `http://localhost:3001`
- Production: `https://nextjs-eie6yvqbf-nhatquangs-projects-d08dceef.vercel.app`
- Both CÓ THỂ tồn tại cùng lúc trong Redirect URLs!

---

**Created:** 2025-12-08
**Issue:** OAuth works on localhost but not production
**Solution:** Add production URL to Supabase whitelist
