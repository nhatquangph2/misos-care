# 🌸 Miso's Care - Mental Health & Personality Web App

**Version**: 1.0.0 (MVP)
**Tech Stack**: Next.js 14 + Supabase + TypeScript + Tailwind CSS
**Timeline**: 12 Weeks (3 Months)

---

## 📋 Project Overview

Miso's Care là một nền tảng sức khỏe tinh thần toàn diện, kết hợp:

- 🧠 **Đánh giá tính cách** (MBTI, Big5, Enneagram)
- 🩺 **Đánh giá sức khỏe tâm lý** (DASS-21, PHQ-9, GAD-7, PSS)
- 🤖 **AI Chatbot cá nhân hóa** (OpenAI GPT-4o-mini)
- 👥 **Cộng đồng theo tính cách** (16 personality groups)
- 💼 **Đặt lịch với chuyên gia** (Mentor booking system)
- 🛍️ **Cửa hàng merchandise** (MBTI-themed products)

---

## 🏗️ Project Structure

```
nextjs-app/
├── app/                      # Next.js App Router pages
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── features/            # Feature components
│   └── layouts/             # Layout components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── utils/               # Helper functions
│   └── validations/         # Zod schemas
├── types/                   # TypeScript types
│   ├── database.ts          # Database types (14 tables)
│   └── enums.ts             # Enum types
├── hooks/                   # Custom React hooks
├── services/                # Business logic
├── constants/               # Constants
├── supabase/
│   ├── schema.sql           # Database schema
│   └── rls-policies.sql     # RLS policies
└── public/                  # Static assets
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd /Users/tranhuykhiem/misos-care/nextjs-app
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://suzsukdrnoarzsixfycr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_key
```

### 3. Setup Database

**Option A: Supabase Dashboard**
1. Go to SQL Editor in Supabase
2. Run `supabase/schema.sql`
3. Run `supabase/rls-policies.sql`

**Option B: Supabase CLI**
```bash
supabase login
supabase link --project-ref your-project-ref
supabase db push
```

### 4. Run Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📊 Database Schema (14 Tables)

✅ **Core Tables:**
- `users` - User profiles
- `personality_profiles` - MBTI, Big5, Enneagram
- `mental_health_records` - Test results (DASS-21, PHQ-9, GAD-7)
- `chat_sessions` & `chat_messages` - AI chatbot
- `mentors` & `bookings` - Mentorship system
- `products` - Merchandise
- `community_groups`, `group_members`, `community_posts` - Community
- `crisis_alerts` - Crisis detection

---

## 🎯 Roadmap Progress

### ✅ Week 1: Setup Complete
- [x] Next.js 14 project
- [x] Supabase integration
- [x] Database schema (14 tables)
- [x] RLS policies
- [x] TypeScript types
- [x] Folder structure

### 🔄 Next: Week 2-3 (Personality Tests)
- [ ] MBTI test (60 questions)
- [ ] Big5 test (44 questions)
- [ ] DASS-21, PHQ-9, GAD-7
- [ ] Scoring algorithms
- [ ] Results visualization

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI GPT-4o-mini
- **State**: React Query + Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Deploy**: Vercel

---

## 📝 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## 🔐 Security Features

- ✅ Row Level Security (RLS) on all tables
- ✅ Authentication middleware
- ✅ Protected routes
- ✅ Crisis detection system
- ✅ Content moderation

---

## 📞 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Status**: Week 1 Complete ✅
**Next Step**: Implement Personality Tests (Week 2-3)

Built with ❤️ for Miso's Care
