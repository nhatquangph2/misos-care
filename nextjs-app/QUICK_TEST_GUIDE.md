# 🚀 QUICK TEST GUIDE - See Your Animations!

**5 phút để xem UI/UX tuyệt đẹp với GSAP!**

---

## ⚡ Quick Start (3 Steps)

### Step 1: Start Server

```bash
cd /Users/tranhuykhiem/misos-care/nextjs-app
npm run dev
```

Wait for: `✓ Ready in X.Xs`

### Step 2: Open Browser

```
http://localhost:3000/tests
```

### Step 3: Enjoy! 🎉

Watch the magic:
- ✨ Cards fade in with stagger effect (0.15s delay)
- 🎨 Hover over cards → smooth scale + lift
- 🎯 Stats cards at top
- 💫 Smooth 60fps animations

---

## 🎭 What You'll See

### Test Selection Page

**Visual Features:**
1. **Hero Section**
   - Gradient title (Purple → Pink)
   - Animated subtitle

2. **Stats Cards**
   - 3 cards showing test info
   - Icons: Brain, Heart, Activity
   - Shadow effects

3. **Test Grid** (6 Cards)
   - MBTI ⭐ (Recommended)
   - PHQ-9 ⭐ (Recommended)
   - Big Five
   - GAD-7
   - DASS-21
   - PSS

4. **Card Effects**
   - Gradient backgrounds (Purple/Pink or Blue/Teal)
   - Hover: Scale 1.05x + lift -10px
   - Icons with rounded backgrounds
   - Difficulty badges
   - Time estimates
   - Decorative blur circles

---

## 🎨 Animation Showcase

### On Page Load
1. **Page Transition**
   ```
   Fade in + Slide up (0.5s)
   ```

2. **Grid Stagger**
   ```
   Card 1: 0s
   Card 2: 0.15s
   Card 3: 0.30s
   Card 4: 0.45s
   Card 5: 0.60s
   Card 6: 0.75s
   ```

### On Hover (Any Card)
```css
transform: scale(1.05) translateY(-10px);
transition: 0.3s power2.out;
box-shadow: 0 20px 40px rgba(0,0,0,0.1);
```

### On Button Click
```css
transform: scale(0.95);
transition: 0.1s;
/* Then bounces back */
```

---

## 🔧 Troubleshooting

### Issue 1: "Cannot GET /tests"

**Fix:** Dashboard layout might be missing

```bash
# Check if file exists
ls app/\(dashboard\)/layout.tsx

# Should see: app/(dashboard)/layout.tsx
```

If not, create it:
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return <div className="min-h-screen">{children}</div>
}
```

### Issue 2: "Module not found @/hooks/useGSAP"

**Fix:** TypeScript path mapping issue

```bash
# Check tsconfig.json has:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Restart dev server: `npm run dev`

### Issue 3: Animations not smooth

**Fix:** Check browser performance

- Open DevTools (F12)
- Go to Performance tab
- Look for frame drops
- GSAP should run at 60fps

### Issue 4: Cards not showing

**Fix:** Check for console errors

```bash
# In browser console (F12)
# Look for errors in red

# Common fix: Clear cache
Ctrl+Shift+R (Windows)
Cmd+Shift+R (Mac)
```

---

## 🎮 Interactive Testing

### Test Card Hover
1. Move mouse slowly over any card
2. Watch it:
   - Scale up (1.05x)
   - Lift up (10px)
   - Shadow increases
3. Move mouse away
4. Watch smooth return

### Test Button Press
1. Click any "Bắt đầu test" button
2. Watch it:
   - Press down (scale 0.95)
   - Bounce back
   - (Currently goes to 404, that's OK!)

### Test Grid Animation
1. Refresh page (F5)
2. Watch cards appear:
   - Top-left first
   - Bottom-right last
   - Smooth stagger timing

---

## 📸 Screenshots Checklist

Take screenshots of:
- [ ] Full page view
- [ ] Hover effect on MBTI card
- [ ] Stats cards section
- [ ] Mobile responsive view (resize browser)
- [ ] Dark mode (if implemented)

---

## 🎯 Next: Try These

### Experiment with Animations

1. **Change Stagger Speed**
```typescript
// In app/(dashboard)/tests/page.tsx
const gridRef = useStagger(0.15) // Try: 0.3, 0.5, 1.0
```

2. **Change Hover Effect**
```typescript
// In lib/gsap-config.ts
cardHover: {
  scale: 1.05,  // Try: 1.1, 1.2
  y: -10,       // Try: -20, -30
  duration: 0.3,
}
```

3. **Add More Animations**
```typescript
import { useFadeIn, useSlideIn } from '@/hooks/useGSAP'

// In your component:
const heroRef = useSlideIn('down')
<div ref={heroRef}>Hero Content</div>
```

---

## 📊 Performance Metrics

### Expected Performance
- **First Paint**: < 1s
- **Interactive**: < 2s
- **Animations**: 60fps
- **Hover Response**: < 16ms

### Check Performance
```
DevTools → Performance → Record
Refresh page
Stop recording
Check FPS graph
```

Should see: Consistent green line at 60fps

---

## 🎨 Color Scheme Reference

### Personality Tests (Purple-Pink)
```
from-purple-500/10 to-pink-500/10
border-purple-200
```

### Mental Health Tests (Blue-Teal)
```
from-blue-500/10 to-teal-500/10
border-blue-200
```

### Gradients
```css
Hero Title: from-purple-600 to-pink-600
Button: from-purple-500 to-pink-500
Background: from-gray-50 to-gray-100
```

---

## ✅ Success Criteria

Your setup is working if:
- [x] Page loads without errors
- [x] 6 test cards visible
- [x] Cards animate on load (stagger)
- [x] Hover effects work smoothly
- [x] Stats cards show at top
- [x] "Lưu ý quan trọng" section at bottom
- [x] Mobile responsive (resize browser)
- [x] No console errors (F12)

---

## 🚀 Ready for More?

Once you confirm everything works:
1. Read `WEEK_2_PROGRESS.md` for full details
2. Next: Build QuestionFlow component
3. Then: Implement individual test pages
4. Finally: Results pages with charts

---

## 🆘 Need Help?

### Check These Files
1. `app/(dashboard)/tests/page.tsx` - Main test page
2. `components/features/tests/TestSelectionCard.tsx` - Card component
3. `hooks/useGSAP.ts` - Animation hooks
4. `lib/gsap-config.ts` - GSAP configuration

### Common Commands
```bash
# Restart server
Ctrl+C (stop)
npm run dev (start)

# Clear cache
rm -rf .next
npm run dev

# Check for errors
npm run build
```

---

**Have fun testing! 🎉**

The UI should feel buttery smooth with all the GSAP animations!

---

Built with 💜 GSAP for Miso's Care
