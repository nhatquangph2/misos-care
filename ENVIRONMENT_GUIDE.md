# Hướng Dẫn Hệ Thống Môi Trường & Mascot

## 🌟 Tổng Quan

Hệ thống Gamification mới của MisosCare tự động thay đổi môi trường và linh vật dựa trên kết quả MBTI của người dùng, tạo trải nghiệm cá nhân hóa độc đáo.

## 🎭 4 Môi Trường & Linh Vật

### 1. 🌊 **Ocean (Đại Dương)** - Explorers (SP)
**MBTI Types:** ISTP, ISFP, ESTP, ESFP

**Mascot:** Misos Cá Heo 🐬
- **Đặc điểm:** Năng động, linh hoạt, thích khám phá
- **Animation:** Bong bóng nổi từ dưới lên, hiệu ứng sóng biển
- **Màu sắc:** Xanh cyan → Xanh dương → Tím
- **Cảm giác:** Tươi mới, tự do, phiêu lưu

### 2. 🌳 **Forest (Rừng)** - Sentinels (SJ)
**MBTI Types:** ISTJ, ISFJ, ESTJ, ESFJ

**Mascot:** Misos Cú Mèo 🦉
- **Đặc điểm:** Đáng tin cậy, có tổ chức, khôn ngoan
- **Animation:** Đom đóm bay lượn và nhấp nháy
- **Màu sắc:** Xanh lá sáng → Xanh đậm → Đen
- **Cảm giác:** Ổn định, bình yên, tự nhiên

### 3. ☁️ **Sky (Bầu Trời)** - Diplomats (NF)
**MBTI Types:** INFJ, INFP, ENFJ, ENFP

**Mascot:** Misos Tinh Linh Mây ☁️
- **Đặc điểm:** Sáng tạo, lý tưởng, đồng cảm
- **Animation:** Những đám mây trôi ngang bầu trời
- **Màu sắc:** Xanh trời sáng → Tím nhạt → Tím đậm
- **Cảm giác:** Nhẹ nhàng, mơ mộng, tự do

### 4. 🌌 **Cosmos (Vũ Trụ)** - Analysts (NT)
**MBTI Types:** INTJ, INTP, ENTJ, ENTP

**Mascot:** Misos Mèo Vũ Trụ 🐱
- **Đặc điểm:** Logic, chiến lược, sáng tạo
- **Animation:** Các ngôi sao lấp lánh, tinh vân
- **Màu sắc:** Tím đậm → Đen tím → Đen
- **Cảm giác:** Huyền bí, vô tận, khám phá tri thức

## 🔧 Cấu Hình Kỹ Thuật

### Files Chính

1. **`lib/gamification-config.ts`**
   - Định nghĩa MBTI mappings
   - Cấu hình màu sắc & gradients
   - Thiết lập mascot

2. **`components/gamification/EnvironmentBackground.tsx`**
   - Render background động
   - Xử lý animations với GSAP
   - Tối ưu performance cho mobile

3. **`components/mascot/MascotAvatar.tsx`**
   - Render 4 loại mascot
   - Biểu cảm dựa trên mood
   - SVG animations

4. **`components/mascot/DolphinMascot.tsx`**
   - Điều khiển mascot chính
   - Tự động chọn mascot type

## 🧪 Test Các Môi Trường

### Cách 1: Hardcode trong Layout (Nhanh nhất cho demo)

Mở file `app/layout.tsx` và thay đổi dòng 53:

```typescript
// Thử các môi trường khác nhau
const initialEnvType: EnvironmentType = 'ocean'    // Đại dương
const initialEnvType: EnvironmentType = 'forest'   // Rừng
const initialEnvType: EnvironmentType = 'sky'      // Bầu trời
const initialEnvType: EnvironmentType = 'cosmos'   // Vũ trụ
```

### Cách 2: Set MBTI trong userStats (Realistic)

Trong `stores/mascotStore.ts`, update userStats:

```typescript
userStats: {
  testsCompleted: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastVisit: Date.now(),
  totalPoints: 0,
  level: 0,
  mbtiResult: {
    type: 'INTJ',  // Thử: INTJ, ENFP, ISTJ, ESTP, etc.
    completedAt: Date.now()
  }
}
```

## 🎨 Level System (5 Độ Sâu)

Mỗi môi trường có 5 level gradient từ sáng đến tối:

| Level | Tên           | Độ sáng | Use Case                    |
|-------|---------------|---------|------------------------------|
| 0     | Surface       | 100%    | Landing page, welcome        |
| 1     | Shallow       | 80%     | Người dùng mới               |
| 2     | Mid-depth     | 60%     | 100-300 bubbles              |
| 3     | Deep          | 40%     | 300-600 bubbles              |
| 4     | Abyss         | 20%     | 600+ bubbles, expert users   |

**Thay đổi level:**
```typescript
// Trong layout.tsx
const initialLevel: number = 0 // 0-4
```

## ⚡ Performance Optimization

### Mobile Detection
- **Tự động giảm 80% particles** trên mobile
- **Tắt God Rays** trên low-power devices
- **GPU acceleration** với `force3D: true`

### Low Power Mode Triggers
- Screen width < 768px
- CPU cores ≤ 4
- Device memory < 4GB

## 🚀 Roadmap - Dynamic Environment

### Phase 1 (Current): Static/Hardcoded
✅ Environment hardcoded trong layout
✅ Mascot tự động chọn từ userStats.mbtiResult

### Phase 2: Context API Integration
```typescript
// Tạo EnvironmentContext
export const EnvironmentContext = createContext<{
  environment: EnvironmentType
  setEnvironment: (env: EnvironmentType) => void
}>()

// Wrap trong layout
<EnvironmentProvider>
  <EnvironmentBackground />
  <MascotProvider />
</EnvironmentProvider>
```

### Phase 3: Supabase Integration
```typescript
// Fetch MBTI từ user profile
const { data: profile } = await supabase
  .from('profiles')
  .select('mbti_type')
  .single()

// Auto-update environment
const { env } = MBTI_ENVIRONMENTS[profile.mbti_type]
```

## 🎯 User Flow

1. **User chưa làm MBTI**
   - Environment: Ocean (default)
   - Mascot: Cá Heo
   - CTA: "Làm bài test MBTI để mở khóa môi trường của bạn!"

2. **User làm MBTI → INTJ**
   - ✨ Animation transition sang Cosmos
   - 🐱 Mascot đổi thành Mèo Vũ Trụ
   - 🎉 Celebration message: "Chào mừng đến Vũ Trụ của bạn!"

3. **User quay lại**
   - Auto-load Cosmos environment
   - Mèo Vũ Trụ chào đón: "Chào mừng trở lại, nhà chiến lược!"

## 📊 Analytics Tracking (TODO)

```typescript
// Track environment views
analytics.track('environment_viewed', {
  type: 'cosmos',
  mbti: 'INTJ',
  level: 0
})

// Track mascot interactions
analytics.track('mascot_clicked', {
  mascot: 'cat',
  mood: 'happy'
})
```

## 🐛 Troubleshooting

### Lỗi: Mascot không đổi
**Nguyên nhân:** `userStats.mbtiResult` chưa được set
**Fix:** Kiểm tra mascotStore, đảm bảo mbtiResult có giá trị

### Lỗi: Environment bị lag
**Nguyên nhân:** Quá nhiều particles trên low-end device
**Fix:** Kiểm tra isLowPowerMode detection

### Lỗi: TypeScript error về MascotMood
**Nguyên nhân:** Sử dụng mood không tồn tại
**Fix:** Chỉ dùng: idle, happy, encouraging, thinking, celebrating, concerned, sleeping, waving, excited

## 🎨 Customization Guide

### Thêm Environment Mới

1. Update `gamification-config.ts`:
```typescript
export type EnvironmentType = 'ocean' | 'forest' | 'sky' | 'cosmos' | 'desert'

MBTI_ENVIRONMENTS['CUSTOM'] = { env: 'desert', mascot: 'camel' }
```

2. Update `ENV_CONFIG`:
```typescript
desert: {
  gradients: [...],
  particleColor: 'bg-yellow-400/40',
  particleShape: 'rounded-sm'
}
```

3. Update `EnvironmentBackground.tsx`:
```typescript
else if (type === 'desert') {
  // Sand particles animation
}
```

## 📝 Notes

- **Animation Performance:** GSAP được ưu tiên vì GPU acceleration tốt hơn CSS
- **SVG vs Image:** Mascot dùng SVG để scale tốt mọi kích thước
- **Color Palette:** Tailwind colors để consistent với design system
- **Accessibility:** Tất cả animations có thể tắt qua `prefers-reduced-motion`

---

**Phát triển bởi:** MisosCare Team
**Version:** 1.0.0
**Last Updated:** 2025-12-16
