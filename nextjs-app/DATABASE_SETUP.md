# 🗄️ DATABASE SETUP GUIDE

Hướng dẫn setup Supabase database cho Miso's Care

---

## 🚀 CÁCH 1: SETUP SIÊU NHANH (1 Click)

### Bước 1: Copy SQL vào clipboard
```bash
npm run setup:db:copy
```

###Bước 2: Mở Supabase và paste
1. Mở: https://supabase.com/dashboard
2. Chọn project của bạn
3. Click **SQL Editor** (menu bên trái)
4. Click **New query**
5. **Paste** (Cmd+V)
6. Click **RUN**

✅ Xong! Database đã sẵn sàng!

---

## 📋 CÁCH 2: SETUP THỦ CÔNG

### Bước 1: Mở file SQL
```bash
open supabase/migrations/00001_initial_schema.sql
```

### Bước 2: Copy toàn bộ nội dung

### Bước 3: Chạy trong Supabase
1. Vào https://supabase.com/dashboard
2. SQL Editor → New query
3. Paste và RUN

---

## 🔍 XÁC NHẬN SETUP THÀNH CÔNG

Sau khi chạy SQL, kiểm tra trong **Table Editor**:

✅ Bạn sẽ thấy 7 tables:
- `users`
- `personality_profiles`
- `mental_health_records`
- `user_goals`
- `action_plans`
- `action_completions`
- `test_reminders`

---

## 🧪 TEST DATABASE

1. Mở website: http://localhost:3001
2. Đăng nhập hoặc tạo tài khoản
3. Làm 1 bài test (ví dụ: PHQ-9)
4. Quay lại Supabase Table Editor
5. Click vào table `mental_health_records`
6. Bạn sẽ thấy record mới!

---

## ❓ NẾU GẶP LỖI

### Lỗi: "relation already exists"
→ Table đã tồn tại, không sao! Skip và tiếp tục.

### Lỗi: "permission denied"
→ Kiểm tra bạn đang dùng đúng project và có quyền admin.

### Lỗi: "foreign key constraint"
→ Chạy lại toàn bộ file SQL từ đầu.

---

## 📊 CẤU TRÚC DATABASE

```
users (bảng người dùng)
├── personality_profiles (tính cách MBTI, Big5)
├── mental_health_records (kết quả tests)
├── user_goals (mục tiêu cá nhân)
│   └── action_plans (kế hoạch hành động)
│       └── action_completions (hoàn thành hành động)
└── test_reminders (nhắc nhở làm test)
```

---

## 🔐 BẢO MẬT (RLS)

Row Level Security đã được bật tự động:
- Users chỉ xem được data của chính mình
- Không ai có thể xem data của người khác
- Authentication được xử lý bởi Supabase Auth

---

## ✨ TÍNH NĂNG ĐÃ CÓ

Sau khi setup database, bạn có thể sử dụng:

✅ **7 Personality & Mental Health Tests**
- MBTI (Myers-Briggs)
- Big5 (Personality)
- SISRI-24 (Spiritual Intelligence)
- PHQ-9 (Depression)
- GAD-7 (Anxiety)
- DASS-21 (Depression, Anxiety, Stress)
- PSS (Perceived Stress)

✅ **Profile System**
- View test history
- Track mental health trends
- Personality overview with charts

✅ **Goals & Action Plans**
- Create personal goals
- Set action plans with reminders
- Track progress and streaks

✅ **Dolphin Mascot**
- Gamification system
- Achievements & points
- Encouraging messages

---

## 🆘 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra file `.env.local` có đúng credentials
2. Xem lại hướng dẫn setup phía trên
3. Thử chạy lại từ đầu

---

**Chúc bạn thành công! 🎉**
