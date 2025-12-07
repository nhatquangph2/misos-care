# 🚀 Profile Page - Quick Start Guide

## 📍 Location

**Main Page**: `app/(dashboard)/profile/page.tsx`
**Route**: `/profile`

---

## 🎯 Features at a Glance

### 1. Dashboard Stats (Top Cards)
```
🧠 MBTI Type    📊 Total Tests    📈 Tracking Days    💡 Recommendations
```

### 2. Four Main Tabs

#### 🎯 Tổng Quan (Overview)
- Left: Personality + Recommendations
- Right: Charts + Test History

#### 🧠 Tính Cách (Personality)
- MBTI Type with visual breakdown
- Big Five traits progress bars
- Detailed personality explanation

#### 📊 Sức Khỏe (Health)
- Mental health trends chart
- Current status cards
- Full test history timeline

#### 💡 Đề Xuất (Recommendations)
- Personalized suggestions
- Healthy habits checklist
- Resource links

---

## 🔧 How It Works

### Data Flow

```
User loads /profile
    ↓
ProfileService.getProfileSummary(userId)
    ↓
Fetches from Supabase:
  - personality_profiles
  - mental_health_records (last 30)
    ↓
Calculates:
  - Trends (group by date)
  - Recommendations (based on MBTI + severity)
    ↓
Displays in components
```

### Component Hierarchy

```
ProfilePage
  ├── Stats Cards (4)
  └── Tabs
      ├── Overview
      │   ├── PersonalityOverview
      │   ├── RecommendationsCard
      │   ├── MentalHealthChart
      │   └── TestHistory
      ├── Personality
      │   └── PersonalityOverview
      ├── Health
      │   ├── MentalHealthChart
      │   └── TestHistory
      └── Recommendations
          └── RecommendationsCard
```

---

## 📦 Files Created

```
nextjs-app/
├── types/profile.ts                          # TypeScript interfaces
├── services/profile.service.ts               # API & business logic
├── components/profile/
│   ├── PersonalityOverview.tsx              # MBTI & Big5 display
│   ├── MentalHealthChart.tsx                # Line chart with Recharts
│   ├── TestHistory.tsx                      # Test timeline
│   └── RecommendationsCard.tsx              # Suggestions
└── app/(dashboard)/profile/
    └── page.tsx                              # Main profile page
```

**Total Files**: 6
**Total Lines**: ~1,500

---

## 🎨 Key Components

### PersonalityOverview
- Shows MBTI type (16 types supported)
- Big Five traits (0-100% bars)
- Visual breakdown of 4 dimensions
- Last test date

### MentalHealthChart
- Line chart (Depression, Anxiety, Stress)
- Current status cards
- Average calculations
- Severity color coding

### TestHistory
- All test records
- Severity badges
- Chronological order
- Date formatting (Vietnamese)

### RecommendationsCard
- Priority-sorted list
- MBTI-specific tips
- Action buttons
- Resource links

---

## 🚀 Quick Setup

### 1. Install Dependencies (Already Done)
```bash
npm install recharts date-fns
```

### 2. Environment Variables (Already Set)
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Database Tables Required
- `personality_profiles`
- `mental_health_records`

### 4. Run Development Server
```bash
npm run dev
# Navigate to http://localhost:3000/profile
```

---

## 🧪 Testing

### With Mock Data

Replace in `page.tsx`:
```typescript
const userId = 'demo-user-id';
```

With actual user ID from auth session.

### Manual Test Checklist

- [ ] Page loads without errors
- [ ] Loading spinner appears
- [ ] Stats cards show correct numbers
- [ ] All 4 tabs are clickable
- [ ] Charts render correctly
- [ ] Test history displays
- [ ] Recommendations appear
- [ ] Responsive on mobile
- [ ] Empty states work

---

## 💡 Customization Tips

### Change Colors

Edit `PersonalityOverview.tsx`:
```typescript
const MBTI_INFO: Record<string, { name: string; color: string; icon: string }> = {
  INTJ: { name: 'Nhà Kiến Trúc', color: 'bg-purple-500', icon: '🏛️' },
  // Add your custom colors here
};
```

### Add New Recommendations

Edit `profile.service.ts`:
```typescript
private generateRecommendations(...) {
  recommendations.push({
    id: 'your-id',
    type: 'activity',
    title: 'Your Title',
    description: 'Your description',
    priority: 'medium',
    icon: '🎯',
  });
}
```

### Modify Chart Appearance

Edit `MentalHealthChart.tsx`:
```typescript
<Line
  type="monotone"
  dataKey="Trầm Cảm"
  stroke="#3b82f6"  // Change color
  strokeWidth={2}    // Change width
/>
```

---

## 📊 Recommendation Algorithm

### Input
- User's MBTI type
- Recent mental health records (last 3)
- Last test date

### Logic

1. **Check Severity**
   - If any recent test is severe → Add "Seek Professional Help" (high priority)

2. **MBTI-Based**
   - Introvert (I) → Add "Quiet Time"
   - Extrovert (E) → Add "Social Activities"
   - Feeling (F) → Add "Emotional Expression"
   - Judging (J) → Add "Planning"

3. **General Wellness**
   - Always add: Journaling, Mindfulness, Exercise, Social Connection

4. **Retake Reminder**
   - If > 90 days since last test → Add "Retake Test"

### Output
Array of `Recommendation` objects sorted by priority

---

## 🎨 Design System

### Colors

**Gradients**:
```css
from-purple-500 to-pink-500    /* Primary */
from-blue-500 to-blue-600      /* Info */
from-green-500 to-green-600    /* Success */
from-red-500 to-red-600        /* Danger */
```

**Text**:
```css
text-gray-900    /* Headings */
text-gray-700    /* Body */
text-gray-600    /* Secondary */
text-gray-400    /* Disabled */
```

### Spacing
- `p-4`: Small padding
- `p-6`: Medium padding
- `p-8`: Large padding
- `gap-4`: Grid/flex gap

### Border Radius
- `rounded-lg`: 8px
- `rounded-xl`: 12px
- `rounded-2xl`: 16px

---

## 🔍 Troubleshooting

### Charts Not Showing
- Check if `trends` array has data
- Verify Recharts is installed
- Check console for errors

### Empty States
- Normal if no data exists
- Guide user to take tests
- Show call-to-action buttons

### TypeScript Errors
- Check import paths
- Verify type definitions in `types/profile.ts`
- Run `npm run build` to check

### Data Not Loading
- Check Supabase connection
- Verify user ID is correct
- Check browser console
- Check network tab

---

## 📈 Performance

### Optimization Tips

1. **Lazy Load Charts**
   ```typescript
   const MentalHealthChart = dynamic(() => import('@/components/profile/MentalHealthChart'));
   ```

2. **Memoize Calculations**
   ```typescript
   const trends = useMemo(() => calculateTrends(records), [records]);
   ```

3. **Limit Data**
   - Only fetch last 30 days
   - Paginate test history

---

## 🎓 Next Steps

### Enhancements to Consider

1. **Export to PDF**
   - Use jsPDF or react-pdf
   - Generate personality report

2. **Share with Mentor**
   - Generate shareable link
   - Set expiration date

3. **Goals Tracking**
   - Add goals section
   - Track progress over time

4. **Mood Journal**
   - Daily mood entries
   - Correlate with test results

---

## 📞 Support

### Documentation
- Full docs: `/USER_PROFILE_SYSTEM_COMPLETE.md`
- Test system docs: `/PERSONALITY_TEST_SYSTEM_COMPLETE.md`

### Need Help?
- Check Next.js docs
- Review Recharts examples
- Check Supabase guides

---

**Ready to launch! 🚀**

Access your profile at: `http://localhost:3000/profile`
