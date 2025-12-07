# 🚀 SETUP GUIDE - Miso's Care Web App

Chi tiết từng bước để setup và chạy web app

---

## 📋 Checklist Trước Khi Bắt Đầu

- [ ] Node.js 18+ đã được cài đặt
- [ ] npm hoặc yarn có sẵn
- [ ] Có tài khoản Supabase (https://supabase.com)
- [ ] Có OpenAI API key (https://platform.openai.com)
- [ ] Code editor (VS Code khuyến nghị)

---

## 🔧 Bước 1: Cài Đặt Dependencies

```bash
cd /Users/tranhuykhiem/misos-care/nextjs-app

# Cài đặt tất cả packages
npm install

# Verify installation
npm list --depth=0
```

**Packages đã cài:**
- Next.js 14
- React 19
- Supabase JS + SSR
- React Query
- Zod
- Recharts
- Tailwind CSS
- TypeScript

---

## 🗄️ Bước 2: Setup Database trên Supabase

### 2.1. Tạo Project Supabase (Nếu chưa có)

1. Truy cập https://supabase.com
2. Click "New Project"
3. Điền thông tin:
   - **Project Name**: misos-care
   - **Database Password**: (Lưu lại password này!)
   - **Region**: Southeast Asia (Singapore)
4. Đợi ~2 phút để project được khởi tạo

### 2.2. Lấy API Credentials

1. Vào project dashboard
2. Click **Settings** → **API**
3. Copy 2 giá trị:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

### 2.3. Chạy Database Schema

**Option A: SQL Editor (Khuyến nghị cho lần đầu)**

1. Vào **SQL Editor** trong Supabase dashboard
2. Click **New Query**
3. Copy toàn bộ nội dung file `supabase/schema.sql`
4. Paste vào editor
5. Click **Run** (hoặc Ctrl+Enter)
6. Đợi ~10 giây
7. Kiểm tra kết quả - Should see: "Success. No rows returned"

8. Lặp lại với file `supabase/rls-policies.sql`

**Option B: Supabase CLI (Cho advanced users)**

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 2.4. Verify Database

Chạy query này trong SQL Editor:

```sql
-- Check all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Kết quả mong đợi** (14 tables):
```
booking_reviews
bookings
chat_messages
chat_sessions
community_groups
community_posts
crisis_alerts
group_members
mental_health_records
mentors
personality_profiles
post_reports
products
users
```

---

## 🔐 Bước 3: Configure Environment Variables

### 3.1. Tạo .env.local

```bash
cp .env.example .env.local
```

### 3.2. Điền Credentials

Mở `.env.local` và điền:

```env
# Supabase (Lấy từ Bước 2.2)
NEXT_PUBLIC_SUPABASE_URL=https://suzsukdrnoarzsixfycr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (Cho AI Chatbot - Tuần 5-6)
OPENAI_API_KEY=sk-...your-key-here

# Environment
NODE_ENV=development

# App Info
NEXT_PUBLIC_APP_NAME=Miso's Care
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### 3.3. Verify .env.local

```bash
# Check file exists
ls -la .env.local

# Verify not committed to git
git status  # Should not show .env.local
```

---

## 🎨 Bước 4: Setup shadcn/ui Components

shadcn/ui đã được pre-configured. Để add components:

```bash
# Example: Add Button component
npx shadcn@latest add button

# Add Card
npx shadcn@latest add card

# Add Form components
npx shadcn@latest add form input label

# Add Dialog
npx shadcn@latest add dialog
```

**Recommended components to install:**
```bash
npx shadcn@latest add button card input label textarea select checkbox radio-group dialog alert badge progress separator tabs
```

---

## 🚀 Bước 5: Run Development Server

```bash
npm run dev
```

**Kết quả mong đợi:**
```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.3s
```

Mở trình duyệt tại: **http://localhost:3000**

---

## 🧪 Bước 6: Test Supabase Connection

Tạo file test đơn giản:

```typescript
// app/test-db/page.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TestPage() {
  const [status, setStatus] = useState<string>('Testing...')
  const supabase = createClient()

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('count')
          .limit(1)

        if (error) throw error
        setStatus('✅ Database connected successfully!')
      } catch (error) {
        setStatus(`❌ Error: ${error}`)
      }
    }
    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Database Connection Test</h1>
      <p className="mt-4">{status}</p>
    </div>
  )
}
```

Truy cập: http://localhost:3000/test-db

**Kết quả mong đợi**: "✅ Database connected successfully!"

---

## 🎯 Bước 7: Enable Authentication

### 7.1. Configure Auth Providers

1. Vào Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email**:
   - Toggle ON
   - **Confirm email**: Optional (turn OFF for development)
3. Enable **Google OAuth** (Optional):
   - Toggle ON
   - Điền Client ID và Secret từ Google Cloud Console

### 7.2. Configure Email Templates (Optional)

Supabase → **Authentication** → **Email Templates**
- Customize Confirm Email template
- Customize Reset Password template

### 7.3. Configure Site URL

Supabase → **Authentication** → **URL Configuration**
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**:
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/**`

---

## 📦 Bước 8: Seed Sample Data (Optional)

Chạy queries này để thêm dữ liệu mẫu:

```sql
-- Insert sample mentor
INSERT INTO mentors (
  name,
  email,
  specialties,
  hourly_rate,
  bio,
  is_active
) VALUES (
  'Dr. Nguyễn Văn A',
  'dr.a@example.com',
  ARRAY['Career Counseling', 'Anxiety'],
  500000,
  'Chuyên gia tâm lý với 10 năm kinh nghiệm',
  true
);

-- Insert sample product
INSERT INTO products (
  name,
  description,
  category,
  price,
  is_active
) VALUES (
  'MBTI Keychain - INFP',
  'Móc khóa tính cách INFP',
  'keychain',
  99000,
  true
);

-- Insert sample community group
INSERT INTO community_groups (
  personality_type,
  name,
  description
) VALUES (
  'INFP',
  'INFP - The Mediators',
  'Cộng đồng dành cho những người có tính cách INFP'
);
```

---

## ✅ Bước 9: Verify Complete Setup

### Checklist:

- [ ] `npm run dev` chạy thành công
- [ ] http://localhost:3000 load được
- [ ] Database có đủ 14 tables
- [ ] .env.local đã được config đúng
- [ ] Test DB connection thành công
- [ ] No errors trong console

### Common Issues & Fixes:

**Issue 1: "Cannot find module '@/lib/supabase/client'"**
```bash
# Fix: Check tsconfig.json has correct paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Issue 2: "Failed to fetch from Supabase"**
- Check NEXT_PUBLIC_SUPABASE_URL is correct
- Check NEXT_PUBLIC_SUPABASE_ANON_KEY is correct
- Verify .env.local file exists

**Issue 3: "Row Level Security policy violation"**
- Make sure you ran `rls-policies.sql`
- Check if user is authenticated properly

---

## 🎉 Setup Complete!

Bạn đã hoàn thành setup cơ bản. Tiếp theo:

### Next Steps:

1. **Week 2-3**: Implement Personality Tests
   - Create test questions JSON files
   - Build test UI components
   - Implement scoring algorithms

2. **Explore codebase**:
   ```bash
   # Check project structure
   tree -L 2 -I node_modules

   # View types
   cat types/database.ts

   # View schema
   cat supabase/schema.sql
   ```

3. **Start building**:
   - Create pages in `app/`
   - Create components in `components/`
   - Create services in `services/`

---

## 📚 Useful Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Tailwind**: https://tailwindcss.com/docs
- **React Query**: https://tanstack.com/query/latest

---

## 🆘 Need Help?

- Check logs: `npm run dev` output
- Check browser console: F12 → Console tab
- Check Supabase logs: Dashboard → Logs

---

**Setup completed**: ✅
**Ready to build**: 🚀
**Have fun**: 😊
