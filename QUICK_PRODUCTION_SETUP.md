# ⚡ Quick Production Setup (5 phút)

## 🎉 App đã deploy thành công!

**Production URL**: https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app

---

## ✅ Checklist Cấu Hình (Làm theo thứ tự)

### Bước 1: Thêm Environment Variables vào Vercel ⚙️

Trang đã mở: **Vercel Environment Variables**

Copy và paste 2 biến này vào Vercel (chọn **Production**):

```
NEXT_PUBLIC_SUPABASE_URL
```
Value:
```
https://suzsukdrnoarzsixfycr.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Value:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1enN1a2Rybm9hcnpzaXhmeWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTM1NTUsImV4cCI6MjA4MDIyOTU1NX0.TaMCw08hqrGsH5xe-x1W3xrSSpyQopfEjsUr-eZ33Gg
```

---

### Bước 2: Cấu Hình Supabase Redirect URLs 🔐

Trang đã mở: **Supabase URL Configuration**

Trong phần **Redirect URLs**, thêm 2 URLs này (mỗi URL một dòng):

```
https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/auth/callback
https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/auth/reset-password
```

Trong phần **Site URL**, thay thế bằng:
```
https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app
```

Click **Save** ở Supabase.

---

### Bước 3: Redeploy Vercel 🔄

Chạy lệnh này để deploy lại với environment variables mới:

```bash
cd /Users/tranhuykhiem/misos-care/nextjs-app
npx vercel --prod
```

Hoặc vào Vercel Dashboard → Deployments → Click "Redeploy"

---

### Bước 4: Test Production 🧪

Sau khi deploy xong, test các tính năng:

1. **Login Page**: https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/auth/login
   - ✅ Đăng ký tài khoản mới
   - ✅ Đăng nhập
   - ✅ Quên mật khẩu
   - ✅ OAuth login (Google/Facebook/GitHub)

2. **Dashboard**: https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/dashboard
   - ✅ Profile page
   - ✅ Tests

3. **Tests**: https://nextjs-he54zahe6-nhatquangs-projects-d08dceef.vercel.app/tests
   - ✅ MBTI
   - ✅ Big Five
   - ✅ PHQ-9
   - ✅ GAD-7
   - ✅ DASS-21
   - ✅ PSS
   - ✅ SISRI-24

---

## 🎨 Features Live on Production

Tất cả tính năng mới đã được deploy:

### 🔐 Authentication
- ✅ Email/password login with validation
- ✅ Password strength meter (Yếu/Trung bình/Tốt/Mạnh)
- ✅ Show/hide password toggle
- ✅ Forgot password flow với email reset
- ✅ Email confirmation support
- ✅ OAuth login (Google, Facebook, GitHub)
- ✅ Smooth animations và transitions
- ✅ Error handling với messages rõ ràng
- ✅ Success notifications
- ✅ Loading states cho tất cả actions

### 🧠 Personality & Mental Health Tests
- ✅ MBTI (Myers-Briggs Type Indicator)
- ✅ Big Five Personality Test
- ✅ PHQ-9 (Depression screening)
- ✅ GAD-7 (Anxiety screening)
- ✅ DASS-21 (Depression, Anxiety, Stress)
- ✅ PSS (Perceived Stress Scale)
- ✅ SISRI-24 (Spiritual Intelligence)

### 👤 User Features
- ✅ Dashboard với profile
- ✅ Goals and reminders
- ✅ Test history
- ✅ Responsive design

---

## 📊 Monitor & Manage

- **Vercel Dashboard**: https://vercel.com/nhatquangs-projects-d08dceef/nextjs-app
- **Supabase Dashboard**: https://app.supabase.com/project/suzsukdrnoarzsixfycr
- **Auth Logs**: https://app.supabase.com/project/suzsukdrnoarzsixfycr/logs/auth-logs

---

## 🔄 Auto Deployment

Mọi thay đổi push lên GitHub sẽ tự động deploy:
- `main` branch → Production deployment
- Other branches → Preview deployments

---

## 💡 Tips

1. **Custom Domain**: Có thể thêm domain riêng trong Vercel settings
2. **Analytics**: Enable Vercel Analytics để track visitors
3. **Performance**: Check Vercel Speed Insights
4. **Logs**: Dùng `npx vercel logs` để xem production logs

---

## ✨ Done!

Sau khi hoàn thành 3 bước trên, app của bạn sẽ chạy hoàn chỉnh trên production với tất cả tính năng authentication mới! 🎊
