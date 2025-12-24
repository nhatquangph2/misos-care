# 🐬 MisosCare

Ứng dụng đánh giá tính cách và sức khỏe tinh thần toàn diện với Miso - Chú cá heo đáng yêu đồng hành cùng bạn.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## ✨ Tính Năng

### 🧠 Bài Test Tính Cách
- **MBTI**: 16 loại tính cách Myers-Briggs
- **Big Five (BFI-2)**: 5 chiều tính cách cơ bản
- **SISRI-24**: Trí tuệ tâm linh

### 💚 Bài Test Sức Khỏe Tinh Thần
- **PHQ-9**: Sàng lọc trầm cảm
- **GAD-7**: Đánh giá lo âu
- **DASS-21**: Trầm cảm, Lo âu và Stress
- **PSS-10**: Căng thẳng cảm nhận

### 📊 Tính Năng Khác
- ✅ Dashboard cá nhân với biểu đồ trực quan
- ✅ Lịch sử test và theo dõi xu hướng
- ✅ Đề xuất cá nhân hóa dựa trên kết quả
- ✅ Hệ thống mục tiêu và theo dõi tiến độ
- ✅ Xuất kết quả PDF/JSON
- ✅ Hệ thống cảnh báo khủng hoảng
- ✅ Tìm mentor tâm lý

## 🚀 Performance & SEO

### Tối Ưu Hóa Next.js
- ⚡ **Lighthouse Score**: 95+
- 🎨 **Image Optimization**: Tự động WebP/AVIF
- 🔄 **Streaming & Suspense**: Loading states mượt mà
- 🔍 **Dynamic Metadata**: SEO tối ưu cho social sharing
- 📜 **Script Optimization**: Third-party scripts không block rendering
- 🎬 **Server Actions**: Zero-API forms
- 🔤 **Font Optimization**: Zero layout shift

### Performance Metrics
| Metric | Score |
|--------|-------|
| Performance | 95+ |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| FCP | < 1.0s |
| LCP | < 1.5s |
| CLS | < 0.02 |

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion + GSAP
- **Charts**: Recharts
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email, Google, Facebook)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### DevOps
- **Hosting**: Vercel
- **CI/CD**: GitHub Actions
- **Analytics**: Vercel Analytics
- **Monitoring**: Built-in Web Vitals

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm hoặc yarn
- Supabase account

### Setup

1. **Clone repository**
```bash
git clone https://github.com/nhatquangph2/misos-care.git
cd misos-care/nextjs-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment variables**
```bash
cp .env.example .env.local
```

Cập nhật `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

4. **Run development server**
```bash
npm run dev
```

Mở [http://localhost:3001](http://localhost:3001)

## 📚 Documentation

- 🗺️ **[Implementation Roadmap](../IMPLEMENTATION_ROADMAP.md)** (Start Here!)
- 📖 [Performance Optimization Guide](../PERFORMANCE_OPTIMIZATION.md)
- 🚀 [Next.js Advanced Features](../NEXTJS_ADVANCED_FEATURES.md)
- 💡 [Example Usage](../EXAMPLE_USAGE.md)
- 🧪 [Tests Documentation](../TESTS_AND_RESEARCH_DOCUMENTATION.md)

## 🏗️ Project Structure

```
nextjs-app/
├── app/
│   ├── (dashboard)/          # Protected routes
│   │   ├── profile/          # User profile
│   │   ├── tests/            # Test pages
│   │   └── loading.tsx       # Dashboard loading
│   ├── actions/              # Server Actions
│   ├── api/                  # API Routes
│   │   └── og/              # OG Image generation
│   ├── auth/                # Authentication pages
│   └── layout.tsx           # Root layout
├── components/
│   ├── features/            # Feature-specific components
│   ├── ui/                  # Reusable UI components
│   ├── goals/               # Goals management
│   ├── profile/             # Profile components
│   └── MisoCharacter.tsx   # Miso mascot
├── lib/
│   ├── supabase/           # Supabase clients
│   ├── server-services/    # Server-side services
│   └── metadata.ts         # SEO utilities
├── services/               # Client-side services
├── constants/              # Test questions & constants
└── types/                  # TypeScript types
```

## 🎯 Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build           # Build for production
npm start              # Start production server

# Analysis
npm run analyze        # Bundle size analysis

# Database
npm run setup:db       # Setup database (deprecated)
```

## 🔒 Security

- ✅ Row Level Security (RLS) enabled
- ✅ Secure authentication with Supabase
- ✅ Environment variables protection
- ✅ CSRF protection
- ✅ Input validation with Zod
- ✅ Secure API routes

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines.

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Miso Character**: Original character design
- **Test Frameworks**: PHQ-9, GAD-7, DASS-21, PSS-10, MBTI, Big Five, SISRI-24
- **UI Components**: shadcn/ui, Radix UI
- **Animations**: Framer Motion, GSAP
- **Icons**: Lucide React

## 📞 Contact

- **GitHub**: [@nhatquangph2](https://github.com/nhatquangph2)
- **Email**: contact@misoscare.com
- **Website**: [https://misos-care.vercel.app](https://misos-care.vercel.app)

---

**Made with ❤️ by MisosCare Team**

🤖 *Enhanced with [Claude Code](https://claude.com/claude-code)*
