# Example Usage - Next.js Advanced Features

Hướng dẫn sử dụng các tính năng nâng cao đã triển khai.

## 📸 1. Image Optimization

### Sử dụng Miso Character
```tsx
import { MisoCharacter, FloatingMiso } from '@/components/MisoCharacter';

// Basic usage
<MisoCharacter emotion="happy" size="md" />

// With animation
<MisoCharacter emotion="celebrating" size="lg" animate />

// Floating animation
<FloatingMiso emotion="calm" size="xl" />
```

### Sử dụng User Avatar
```tsx
import Image from 'next/image';

<Image
  src={user.avatar_url || '/default-avatar.png'}
  alt={user.name}
  width={48}
  height={48}
  className="rounded-full"
  priority={false} // Lazy load
/>
```

### Responsive Background Image
```tsx
<div className="relative h-64 w-full">
  <Image
    src="/hero-background.jpg"
    alt="Hero"
    fill
    className="object-cover"
    priority={true}
  />
</div>
```

## ⏳ 2. Loading States

### Automatic Loading (No code needed!)
Khi user navigate, Next.js tự động hiển thị:
- `app/loading.tsx` - Root loading
- `app/(dashboard)/loading.tsx` - Dashboard loading

### Manual Suspense Boundaries
```tsx
import { Suspense } from 'react';

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile</h1>

      {/* This section loads immediately */}
      <BasicInfo />

      {/* This section shows skeleton while loading */}
      <Suspense fallback={<ChartSkeleton />}>
        <MentalHealthChart />
      </Suspense>

      <Suspense fallback={<TestHistorySkeleton />}>
        <TestHistory />
      </Suspense>
    </div>
  );
}
```

## 🔍 3. Dynamic Metadata

### Test Results Page
```tsx
// app/(dashboard)/tests/mbti/results/page.tsx
import { generateTestResultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

type Props = {
  searchParams: { type?: string };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const mbtiType = searchParams.type || 'Unknown';

  return generateTestResultMetadata({
    testType: 'MBTI',
    testName: 'MBTI - Myers Briggs Type Indicator',
    result: mbtiType,
    description: `Khám phá tính cách ${mbtiType} và nhận tư vấn cá nhân hóa`
  });
}

export default function MBTIResultsPage({ searchParams }: Props) {
  // Component code
}
```

**Kết quả khi share lên Facebook:**
```
[Beautiful OG Image with MBTI type]
Tôi thuộc nhóm INTJ - MBTI
Khám phá tính cách INTJ và nhận tư vấn cá nhân hóa
```

### Profile Page with User Info
```tsx
// app/(dashboard)/profile/page.tsx
import { generateProfileMetadata } from '@/lib/metadata';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return generateProfileMetadata(user?.user_metadata?.name);
}
```

### Custom Metadata
```tsx
export const metadata: Metadata = {
  title: 'Làm test PHQ-9',
  description: 'Bài test sàng lọc trầm cảm PHQ-9 - Chỉ mất 2-3 phút',
  openGraph: {
    title: 'Test PHQ-9 - Sàng lọc trầm cảm',
    description: 'Đánh giá mức độ trầm cảm với bài test PHQ-9 được khoa học chứng minh',
    images: ['/api/og?title=PHQ-9&type=mental-health'],
  },
};
```

## 📜 4. Script Optimization

### Add Analytics to Layout
```tsx
// app/layout.tsx
import { Analytics } from '@/components/analytics/Analytics';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics /> {/* Only loads in production */}
      </body>
    </html>
  );
}
```

### Add Custom Scripts
```tsx
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* Chat widget */}
      <Script
        src="https://chat-widget.com/script.js"
        strategy="lazyOnload" // Load when idle
      />

      {/* Critical script */}
      <Script
        src="/critical-feature.js"
        strategy="beforeInteractive" // Load before page interactive
      />
    </>
  );
}
```

## 🎬 5. Server Actions

### Create Goal Form
```tsx
import { GoalCreateForm } from '@/components/goals/GoalCreateForm';

export default function GoalsPage() {
  return (
    <div>
      <h1>Mục tiêu của tôi</h1>
      <GoalCreateForm />
    </div>
  );
}
```

### Update Goal Status
```tsx
'use client';

import { updateGoalStatus } from '@/app/actions/goals';
import { useTransition } from 'react';

export function GoalItem({ goal }) {
  const [isPending, startTransition] = useTransition();

  const handleComplete = () => {
    startTransition(async () => {
      await updateGoalStatus(goal.id, 'completed');
    });
  };

  return (
    <div>
      <h3>{goal.title}</h3>
      <button onClick={handleComplete} disabled={isPending}>
        {isPending ? 'Đang cập nhật...' : 'Hoàn thành'}
      </button>
    </div>
  );
}
```

### With Form Data
```tsx
// Client Component
export function FeedbackForm() {
  return (
    <form action={submitFeedback}>
      <input name="message" required />
      <input name="rating" type="number" min="1" max="5" />
      <button type="submit">Gửi</button>
    </form>
  );
}

// Server Action
'use server';
export async function submitFeedback(formData: FormData) {
  const message = formData.get('message');
  const rating = formData.get('rating');

  // Validate
  if (!message) {
    return { error: 'Message is required' };
  }

  // Save to database
  await db.feedback.create({
    data: { message, rating: Number(rating) }
  });

  // Revalidate page
  revalidatePath('/feedback');

  return { success: true };
}
```

### With useFormState (Advanced)
```tsx
'use client';

import { useFormState } from 'react-dom';
import { createGoal } from '@/app/actions/goals';

const initialState = {
  message: '',
  errors: {},
};

export function GoalFormAdvanced() {
  const [state, formAction] = useFormState(createGoal, initialState);

  return (
    <form action={formAction}>
      <input name="title" />
      {state.errors?.title && (
        <p className="text-red-500">{state.errors.title}</p>
      )}

      <button type="submit">Create</button>

      {state.message && (
        <p className="text-green-500">{state.message}</p>
      )}
    </form>
  );
}
```

## 🎨 6. Custom OG Images

### Generate Test Result OG Image
```
/api/og?title=Tôi là INTJ&description=Khám phá tính cách INTJ&type=MBTI
```

### Generate Profile OG Image
```
/api/og?title=Hồ sơ của John Doe&description=Theo dõi sức khỏe tinh thần
```

### Generate Custom OG Image
```tsx
// In your metadata
openGraph: {
  images: [
    `/api/og?${new URLSearchParams({
      title: 'Custom Title',
      description: 'Custom Description',
      type: 'custom-badge'
    })}`
  ]
}
```

## 🚀 Complete Example: Test Result Page

```tsx
// app/(dashboard)/tests/phq9/results/page.tsx
import { Suspense } from 'react';
import { generateTestResultMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

// Dynamic Metadata
export async function generateMetadata({ searchParams }): Promise<Metadata> {
  const score = searchParams.score;

  return generateTestResultMetadata({
    testType: 'PHQ9',
    testName: 'PHQ-9 - Sàng lọc trầm cảm',
    score: Number(score),
    description: `Kết quả PHQ-9: ${score} điểm`
  });
}

// Server Component (SSR)
export default async function PHQ9ResultsPage({ searchParams }) {
  const score = Number(searchParams.score);

  // Fetch recommendations on server
  const recommendations = await getRecommendations(score);

  return (
    <div>
      <h1>Kết quả PHQ-9</h1>
      <p>Điểm số: {score}</p>

      {/* This loads immediately */}
      <ResultSummary score={score} />

      {/* This shows skeleton while loading */}
      <Suspense fallback={<ChartSkeleton />}>
        <TrendChart />
      </Suspense>

      {/* This is interactive */}
      <Recommendations data={recommendations} />

      {/* Server Action Form */}
      <SaveResultForm score={score} />
    </div>
  );
}
```

## 🎯 Best Practices

### 1. Image Optimization
- ✅ Always specify width & height
- ✅ Use `priority` for LCP images
- ✅ Use `fill` for responsive backgrounds
- ✅ Optimize alt text for accessibility

### 2. Loading States
- ✅ Create loading.tsx for each route segment
- ✅ Use Suspense for components that fetch data
- ✅ Show skeletons that match final content
- ✅ Keep loading states simple and fast

### 3. Metadata
- ✅ Use template for consistent titles
- ✅ Keep descriptions under 160 characters
- ✅ Use 1200x630px for OG images
- ✅ Test sharing on Facebook/Twitter

### 4. Scripts
- ✅ Use `afterInteractive` for most third-party scripts
- ✅ Use `lazyOnload` for non-critical scripts
- ✅ Only load analytics in production
- ✅ Minimize external script dependencies

### 5. Server Actions
- ✅ Validate input on server
- ✅ Use revalidatePath for cache updates
- ✅ Return clear error messages
- ✅ Use useTransition for pending states

---

**Happy coding! 🚀**
