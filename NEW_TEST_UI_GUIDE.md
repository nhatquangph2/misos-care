# 🎨 Modern Test UI - Implementation Guide

## Overview

Tôi đã tạo một UI hiện đại mới cho các bài test dựa trên thiết kế bạn yêu thích, với các ưu điểm:

✅ **Chú thích một lần ở đầu** - Không lặp lại nhãn nhiều lần
✅ **Màu sắc phân biệt rõ ràng** - Dễ nhận biết từng mức độ
✅ **Hiệu ứng smooth** - Animations mượt mà, chuyên nghiệp
✅ **Responsive** - Hoạt động tốt trên mọi thiết bị
✅ **Progress tracking** - Thanh tiến độ rõ ràng
✅ **Auto-advance** - Tự động chuyển câu sau khi chọn

## 📦 Components Created

### 1. **RadioScale Component** (`components/RadioScale.tsx`)

Component core hiển thị một câu hỏi với scale màu sắc:

**Features:**
- Progress bar with percentage
- Color-coded radio options
- Checkmark for selected option
- Tooltip on hover
- Smooth animations

**Props:**
```typescript
{
  question: string;              // Câu hỏi
  questionNumber: number;        // Số thứ tự (1-based)
  totalQuestions: number;        // Tổng số câu
  options: RadioScaleOption[];   // Các lựa chọn với màu sắc
  value: number | null;          // Giá trị đã chọn
  onChange: (value: number) => void;
  required?: boolean;
}
```

**Pre-defined Scales:**
- `LIKERT_5_SCALE` / `LIKERT_5_SCALE_VI` - 5 mức (Strongly Disagree → Strongly Agree)
- `FREQUENCY_4_SCALE` / `FREQUENCY_4_SCALE_VI` - 4 mức tần suất
- `SEVERITY_4_SCALE_VI` - 4 mức mức độ
- `PSS_5_SCALE_VI` - 5 mức cho PSS test

### 2. **ModernQuestionFlow Component** (`components/features/tests/ModernQuestionFlow.tsx`)

Flow quản lý nhiều câu hỏi, mỗi lần 1 câu:

**Features:**
- One question per screen
- Auto-advance after selection
- Previous/Next navigation
- Progress dots với jump-to capability
- Submit button when complete
- Smooth transitions

**Props:**
```typescript
{
  questions: ModernQuestion[];     // Danh sách câu hỏi
  scaleOptions: RadioScaleOption[]; // Scale sử dụng
  onComplete: (answers) => void;   // Callback khi hoàn thành
  testTitle: string;               // Tên bài test
  scaleInstruction?: string;       // Hướng dẫn scale
}
```

## 🎯 Example Usage - PHQ-9 Modern

Tôi đã tạo sẵn một example implementation cho PHQ-9:

**Route:** `/tests/phq9-modern`

**File:** `app/(dashboard)/tests/phq9-modern/page.tsx`

```tsx
<ModernQuestionFlow
  questions={modernQuestions}
  scaleOptions={FREQUENCY_4_SCALE_VI}
  onComplete={handleComplete}
  testTitle="PHQ-9 - Sàng lọc Trầm cảm"
  scaleInstruction="Trong 2 tuần qua, bạn có gặp phải các vấn đề sau với tần suất như thế nào?"
/>
```

## 🚀 How to Apply to Other Tests

### Step 1: Convert Questions Format

```typescript
const modernQuestions = YOUR_QUESTIONS.map(q => ({
  id: q.id,
  question: q.question,
  // Chỉ cần id và question, bỏ options
}));
```

### Step 2: Choose Appropriate Scale

```typescript
import {
  LIKERT_5_SCALE_VI,      // Cho personality tests
  FREQUENCY_4_SCALE_VI,   // Cho depression/anxiety
  PSS_5_SCALE_VI,         // Cho stress
} from '@/components/RadioScale';
```

### Step 3: Use ModernQuestionFlow

```typescript
<ModernQuestionFlow
  questions={modernQuestions}
  scaleOptions={LIKERT_5_SCALE_VI}  // Chọn scale phù hợp
  onComplete={handleComplete}
  testTitle="Tên Bài Test"
  scaleInstruction="Hướng dẫn cho người dùng"
/>
```

## 📝 Applying to All Tests

### Tests to Update:

1. **PHQ-9** ✅ Done (`/tests/phq9-modern`)
2. **GAD-7** - Use `FREQUENCY_4_SCALE_VI`
3. **DASS-21** - Use `SEVERITY_4_SCALE_VI`
4. **PSS** - Use `PSS_5_SCALE_VI`
5. **Big Five** - Use `LIKERT_5_SCALE_VI`
6. **MBTI** - Use `LIKERT_5_SCALE_VI`
7. **SISRI-24** - Use `LIKERT_5_SCALE_VI`

### Template for Each Test:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModernQuestionFlow } from '@/components/features/tests/ModernQuestionFlow';
import { APPROPRIATE_SCALE } from '@/components/RadioScale';
import { TEST_QUESTIONS } from '@/constants/tests/...';

export default function TestModernPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const modernQuestions = TEST_QUESTIONS.map(q => ({
    id: q.id,
    question: q.question,
  }));

  const handleComplete = async (answers: { questionId: number; value: number }[]) => {
    setIsLoading(true);

    try {
      // Calculate scores
      // Save to localStorage
      // Navigate to results
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <ModernQuestionFlow
      questions={modernQuestions}
      scaleOptions={APPROPRIATE_SCALE}
      onComplete={handleComplete}
      testTitle="Test Title"
      scaleInstruction="Instructions"
    />
  );
}
```

## 🎨 Color Scheme

### Current Color Mappings:

**5-Level Scale (Likert):**
- 🔴 Strongly Disagree - `border-red-300`
- 🟠 Disagree - `border-orange-300`
- ⚪ Neutral - `border-gray-300`
- 🟢 Agree - `border-green-300`
- 🔵 Strongly Agree - `border-teal-500`

**4-Level Frequency Scale:**
- 🟢 Not at all - `border-green-300`
- 🟡 Several days - `border-yellow-300`
- 🟠 More than half - `border-orange-300`
- 🔴 Nearly every day - `border-red-400`

**5-Level PSS Scale:**
- 🟢 Never - `border-green-300`
- 🌿 Almost never - `border-lime-300`
- 🟡 Sometimes - `border-yellow-300`
- 🟠 Fairly often - `border-orange-300`
- 🔴 Very often - `border-red-400`

## 📱 Responsive Design

**Desktop:**
- Large radio buttons (w-16 h-16)
- Full legend with labels
- Side-by-side navigation

**Mobile:**
- Adjusted button sizes
- Stacked layout
- Touch-friendly targets

## ✨ Animations

**Included:**
- ✓ Scale-in on question load
- ✓ Smooth transitions between questions
- ✓ Progress bar animation
- ✓ Button hover/active states
- ✓ Checkmark appear animation
- ✓ Dot navigation indicators

## 🔄 Migration Strategy

### Option 1: Replace Existing (Recommended for new tests)
Create new routes with `-modern` suffix:
- `/tests/gad7-modern`
- `/tests/dass21-modern`
etc.

### Option 2: Update Existing
Replace `ScrollableQuestionFlow` with `ModernQuestionFlow` in existing pages.

### Option 3: User Choice
Add a toggle in test intro page to let users choose UI style.

## 📊 Benefits

**User Experience:**
- ⚡ Faster completion (one question focus)
- 🎯 Better clarity (no repetition)
- 🎨 More engaging (colors + animations)
- 📱 Mobile-friendly

**Developer Experience:**
- 🧩 Reusable components
- 🎛️ Easy to configure
- 📦 Pre-defined scales
- 🔧 Type-safe

## 🧪 Testing Checklist

- [ ] Test on desktop Chrome/Safari/Firefox
- [ ] Test on mobile iOS/Android
- [ ] Test all scale types (5-level, 4-level, etc.)
- [ ] Test navigation (Previous/Next/Dots)
- [ ] Test with slow network
- [ ] Test accessibility (keyboard navigation)
- [ ] Test with reduced motion preference

## 🚀 Next Steps

1. **Test PHQ-9 Modern**: Visit `/tests/phq9-modern` locally
2. **Apply to other tests**: Use template above
3. **Deploy**: Include in next production deployment
4. **Gather feedback**: See which UI users prefer
5. **Iterate**: Improve based on usage data

## 📸 Screenshot Reference

The design is inspired by professional personality assessment platforms with:
- Clean, minimal interface
- Color-coded options at top (once)
- Large, touch-friendly radio buttons
- Progress indication
- Modern animations

---

**Created:** 2025-12-08
**Status:** Ready for testing and deployment
**Files Added:**
- `components/RadioScale.tsx`
- `components/features/tests/ModernQuestionFlow.tsx`
- `app/(dashboard)/tests/phq9-modern/page.tsx`
