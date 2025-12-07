# Tính năng Mục tiêu và Nhắc nhở

Tài liệu này mô tả các tính năng mới được thêm vào ứng dụng Miso's Care.

## 📊 Tính năng 1: Biểu đồ Tiến độ Mục tiêu theo Thời gian

### Mô tả
Hiển thị biểu đồ Area Chart để theo dõi tiến độ thực tế so với tiến độ mục tiêu theo thời gian.

### Component
- **Location**: `components/goals/GoalProgressChart.tsx`
- **Props**:
  - `goal`: UserGoal - Mục tiêu cần theo dõi
  - `completions`: ActionCompletion[] - Danh sách lần hoàn thành
  - `viewMode`: 'daily' | 'weekly' | 'monthly' - Chế độ xem

### Tính năng chính
- ✅ Hiển thị 2 đường: Tiến độ thực tế vs Tiến độ mục tiêu
- ✅ Tooltip hiển thị chi tiết khi hover
- ✅ Hỗ trợ 3 chế độ xem: Ngày, Tuần, Tháng
- ✅ Tính toán tự động phần trăm hoàn thành
- ✅ Gradient màu cho Area Chart
- ✅ Responsive design

### Cách sử dụng
```tsx
import { GoalProgressChart } from '@/components/goals/GoalProgressChart';

<GoalProgressChart
  goal={myGoal}
  completions={myCompletions}
  viewMode="daily"
/>
```

---

## 🔔 Tính năng 2: UI Quản lý Nhắc nhở Test

### Mô tả
Giao diện đầy đủ để quản lý nhắc nhở làm các bài test định kỳ (DASS-21, PHQ-9, GAD-7, PSS, MBTI, Big Five, SISRI-24).

### Components

#### 1. TestRemindersManager
- **Location**: `components/goals/TestRemindersManager.tsx`
- **Props**: `userId: string`
- **Tính năng**:
  - ✅ Hiển thị danh sách tất cả nhắc nhở
  - ✅ CRUD operations (Create, Read, Update, Delete)
  - ✅ Bật/tắt nhắc nhở
  - ✅ Grid layout responsive

#### 2. TestReminderCard
- **Location**: `components/goals/TestReminderCard.tsx`
- **Props**:
  - `reminder`: TestReminder
  - `onEdit`, `onDelete`, `onToggle`: Callback functions
- **Tính năng**:
  - ✅ Hiển thị thông tin nhắc nhở
  - ✅ Badge cho trạng thái (Sắp tới, Đã bật, Đã tắt)
  - ✅ Nút Edit/Delete/Toggle
  - ✅ Hiển thị ngày nhắc tiếp theo
  - ✅ Hiển thị lần làm cuối

#### 3. TestReminderForm
- **Location**: `components/goals/TestReminderForm.tsx`
- **Props**:
  - `reminder?`: TestReminder (optional - cho edit mode)
  - `onSubmit`: Callback function
  - `onCancel`: Callback function
  - `isOpen`, `onOpenChange`: Dialog state
- **Tính năng**:
  - ✅ Form tạo mới / chỉnh sửa nhắc nhở
  - ✅ Chọn loại test
  - ✅ Chọn tần suất (Hàng tuần, 2 tuần, Hàng tháng, Hàng quý)
  - ✅ Chọn ngày và giờ nhắc nhở
  - ✅ Chọn phương thức nhắc nhở (Notification, Email)
  - ✅ Bật/tắt nhắc nhở ngay
  - ✅ Validation

### Cách sử dụng
```tsx
import { TestRemindersManager } from '@/components/goals/TestRemindersManager';

<TestRemindersManager userId={user.id} />
```

---

## 🔔 Tính năng 3: Hệ thống Push Notifications

### Mô tả
Hệ thống thông báo đẩy (Push Notifications) hoàn chỉnh sử dụng Service Worker và Web Push API.

### Components & Services

#### 1. Service Worker
- **Location**: `public/service-worker.js`
- **Tính năng**:
  - ✅ Xử lý push events
  - ✅ Hiển thị notifications
  - ✅ Xử lý notification clicks
  - ✅ Tự động focus/open app khi click notification

#### 2. NotificationService
- **Location**: `services/notification.service.ts`
- **Tính năng**:
  - ✅ Singleton pattern
  - ✅ Check browser support
  - ✅ Request permission
  - ✅ Register service worker
  - ✅ Subscribe/Unsubscribe to push
  - ✅ Show local notifications
  - ✅ Schedule test reminders
  - ✅ Schedule action reminders

**API Methods**:
```typescript
// Check support
notificationService.isSupported(): boolean
notificationService.getPermission(): NotificationPermission

// Permission
notificationService.requestPermission(): Promise<NotificationPermission>

// Service Worker
notificationService.registerServiceWorker(): Promise<ServiceWorkerRegistration>
notificationService.getRegistration(): Promise<ServiceWorkerRegistration | null>

// Push Subscription
notificationService.subscribeToPush(vapidPublicKey: string): Promise<PushSubscription | null>
notificationService.unsubscribeFromPush(): Promise<boolean>

// Show Notifications
notificationService.showNotification(payload: NotificationPayload): Promise<void>
notificationService.scheduleTestReminder(testType, testName, date): Promise<void>
notificationService.scheduleActionReminder(title, actionId): Promise<void>
```

#### 3. useNotifications Hook
- **Location**: `hooks/useNotifications.ts`
- **Tính năng**:
  - ✅ React hook wrapper cho NotificationService
  - ✅ State management
  - ✅ Loading & error handling
  - ✅ Easy to use trong React components

**Hook API**:
```typescript
const {
  isSupported,           // boolean
  permission,            // NotificationPermission
  isRegistered,         // boolean
  isSubscribed,         // boolean
  isLoading,           // boolean
  error,               // string | null
  hasPermission,       // boolean
  requestPermission,   // () => Promise<NotificationPermission>
  subscribe,          // (key: string) => Promise<PushSubscription>
  unsubscribe,        // () => Promise<boolean>
  showNotification,   // (payload) => Promise<void>
  scheduleTestReminder,    // (type, name, date) => Promise<void>
  scheduleActionReminder,  // (title, id) => Promise<void>
} = useNotifications();
```

#### 4. NotificationSettings Component
- **Location**: `components/goals/NotificationSettings.tsx`
- **Tính năng**:
  - ✅ Hiển thị trạng thái permission
  - ✅ Nút request permission
  - ✅ Nút test notification
  - ✅ Hướng dẫn chi tiết
  - ✅ Error handling UI

### PWA Setup

#### Manifest.json
- **Location**: `public/manifest.json`
- **Tính năng**:
  - ✅ PWA configuration
  - ✅ Icons configuration
  - ✅ Display mode: standalone
  - ✅ Theme colors
  - ✅ GCM sender ID

#### Updated Layout
- **Location**: `app/layout.tsx`
- **Changes**:
  - ✅ Added manifest link
  - ✅ Added PWA meta tags
  - ✅ Added icons configuration
  - ✅ Apple Web App support

### Cách sử dụng

#### 1. Request Permission
```tsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { requestPermission, hasPermission } = useNotifications();

  const handleEnable = async () => {
    const permission = await requestPermission();
    if (permission === 'granted') {
      console.log('Notifications enabled!');
    }
  };

  return (
    <button onClick={handleEnable} disabled={hasPermission}>
      Enable Notifications
    </button>
  );
}
```

#### 2. Show Notification
```tsx
const { showNotification } = useNotifications();

await showNotification({
  title: 'Test Notification',
  body: 'This is a test message',
  icon: '/icon-192x192.png',
  tag: 'test',
});
```

#### 3. Schedule Test Reminder
```tsx
const { scheduleTestReminder } = useNotifications();

await scheduleTestReminder(
  'DASS21',
  'DASS-21',
  new Date('2024-12-10T09:00:00')
);
```

---

## 🎯 Trang Demo

### Location
- **Page**: `app/(dashboard)/goals/page.tsx`
- **Component**: `app/(dashboard)/goals/GoalsAndRemindersPage.tsx`

### URL
```
/goals
```

### Tính năng
- ✅ 3 tabs: Mục tiêu, Nhắc nhở, Cài đặt
- ✅ Tab Mục tiêu:
  - Chọn mục tiêu
  - Hiển thị biểu đồ tiến độ
  - Thống kê chi tiết
- ✅ Tab Nhắc nhở:
  - Quản lý test reminders
  - CRUD operations
- ✅ Tab Cài đặt:
  - Notification settings
  - Hướng dẫn sử dụng

---

## 📋 Database Schema

Các bảng đã được tạo trong `supabase/schema.sql`:

### 1. user_goals
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- title, description
- category: goal category
- target_metric, target_value, current_value
- start_date, target_date
- status, completion_percentage
- motivation_text, reward_text
- completed_at
- created_at, updated_at
```

### 2. action_plans
```sql
- id: UUID (PK)
- goal_id: UUID (FK)
- user_id: UUID (FK)
- title, description
- action_type
- frequency_type, frequency_value, frequency_days
- reminder_enabled, reminder_time, reminder_days
- total_completions, current_streak, longest_streak
- last_completed_at
- is_active
- created_at, updated_at
```

### 3. action_completions
```sql
- id: UUID (PK)
- action_plan_id: UUID (FK)
- user_id: UUID (FK)
- completed_at, completion_date
- notes, mood
- created_at
```

### 4. test_reminders
```sql
- id: UUID (PK)
- user_id: UUID (FK)
- test_type
- frequency
- next_reminder_date, last_completed_date
- reminder_enabled, reminder_time, reminder_method[]
- is_active
- created_at, updated_at
```

---

## 🚀 Cài đặt & Sử dụng

### 1. Cài đặt dependencies
```bash
cd nextjs-app
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Truy cập trang demo
```
http://localhost:3001/goals
```

### 4. Enable Notifications
1. Vào tab "Cài đặt"
2. Click "Bật thông báo"
3. Cho phép notifications trong browser
4. Click "Gửi thông báo thử nghiệm" để test

### 5. Tạo Test Reminder
1. Vào tab "Nhắc nhở"
2. Click "Thêm nhắc nhở"
3. Điền form:
   - Chọn loại test
   - Chọn tần suất
   - Chọn ngày & giờ
   - Chọn phương thức (Notification/Email)
4. Click "Tạo mới"

---

## 🔧 Dependencies

Đã có sẵn trong project:
- ✅ `recharts` - Biểu đồ
- ✅ `date-fns` - Xử lý ngày tháng
- ✅ `@radix-ui/*` - UI components
- ✅ `zustand` - State management (optional)

---

## 📱 Browser Support

### Notifications
- ✅ Chrome/Edge 50+
- ✅ Firefox 44+
- ✅ Safari 16+ (macOS)
- ❌ Safari iOS (không hỗ trợ web push)

### Service Workers
- ✅ Chrome/Edge 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+

---

## 🎨 Customization

### Theme Colors
Có thể customize trong:
- `manifest.json` - theme_color, background_color
- `tailwind.config.js` - màu sắc components

### Notification Icons
Thay thế các icon trong `/public`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png
- badge-72x72.png

---

## 🐛 Troubleshooting

### Notifications không hoạt động
1. Check browser support: `notificationService.isSupported()`
2. Check permission: `Notification.permission`
3. Check service worker: DevTools > Application > Service Workers
4. Check console logs

### Service Worker không register
1. Phải dùng HTTPS hoặc localhost
2. Check file path: `/service-worker.js` phải tồn tại
3. Check console errors

### Chart không hiển thị
1. Check data format
2. Check recharts version
3. Check browser console

---

## 📚 Tài liệu tham khảo

- [Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [Recharts Documentation](https://recharts.org/)
- [Date-fns Documentation](https://date-fns.org/)

---

## ✅ Checklist Hoàn thành

- [x] Biểu đồ tiến độ mục tiêu theo thời gian
- [x] UI quản lý nhắc nhở test
  - [x] TestRemindersManager
  - [x] TestReminderCard
  - [x] TestReminderForm
- [x] Hệ thống Push Notifications
  - [x] Service Worker
  - [x] NotificationService
  - [x] useNotifications Hook
  - [x] NotificationSettings Component
- [x] PWA Configuration
  - [x] manifest.json
  - [x] Layout meta tags
- [x] Trang demo (/goals)
- [x] Database schema đã có sẵn
- [x] Documentation

---

## 🎉 Kết luận

Tất cả các tính năng đã được triển khai đầy đủ và sẵn sàng sử dụng. Hệ thống bao gồm:

1. **Biểu đồ tiến độ** - Trực quan hóa tiến độ mục tiêu
2. **Quản lý nhắc nhở** - UI đầy đủ để quản lý test reminders
3. **Push Notifications** - Hệ thống thông báo đẩy hoàn chỉnh
4. **PWA Support** - Progressive Web App với manifest và service worker

Tất cả components đều responsive, có error handling, và tuân theo best practices của Next.js 16 và React 19.
