# 🧪 TESTING GUIDE - Miso's Care

Hướng dẫn test đầy đủ các tính năng của ứng dụng

---

## 🎯 MỤC TIÊU TEST

Sau khi hoàn thành guide này, bạn sẽ đã test:
- ✅ Authentication (Login/Signup)
- ✅ Dashboard page
- ✅ 7 Personality & Mental Health Tests
- ✅ Profile page với charts
- ✅ Goals & Action Plans system
- ✅ Dolphin Mascot interactions
- ✅ Database persistence

---

## 📋 CHECKLIST TEST

### **PHASE 1: Authentication & Dashboard**

#### 1.1 Tạo tài khoản mới
```
URL: http://localhost:3001/auth/login
```

**Steps:**
1. [ ] Mở http://localhost:3001
2. [ ] Click "Sign Up" hoặc điền form đăng ký
3. [ ] Nhập email và password
4. [ ] Submit form
5. [ ] Kiểm tra email để verify (nếu có)
6. [ ] Login thành công

**Expected Results:**
- ✅ Redirect về Dashboard (/)
- ✅ Thấy welcome message với tên bạn
- ✅ Thấy 4 stat cards (tất cả = 0)
- ✅ Thấy Quick Actions cards
- ✅ Thấy Recommendations section
- ✅ Dolphin Mascot xuất hiện góc dưới bên phải

#### 1.2 Kiểm tra Dashboard
**Checklist:**
- [ ] Stats cards hiển thị đúng (Tests: 0, MBTI: —, Streak: 0, Goals: 0)
- [ ] Quick Actions cards có link
- [ ] Recommendations cho người mới
- [ ] GSAP animations chạy mượt
- [ ] Mascot có thể click và minimize

---

### **PHASE 2: Tests - Personality**

#### 2.1 MBTI Test
```
URL: http://localhost:3001/tests/mbti
```

**Steps:**
1. [ ] Vào /tests → Click "MBTI"
2. [ ] Đọc instructions
3. [ ] Trả lời 60 câu hỏi
4. [ ] Submit test
5. [ ] Xem results page

**Expected Results:**
- ✅ Questions scroll mượt mà
- ✅ Progress bar cập nhật
- ✅ Submit button xuất hiện khi hoàn thành
- ✅ Results hiển thị MBTI type (ví dụ: INTJ)
- ✅ Có detailed description
- ✅ Data được lưu vào Supabase

**Verify in Supabase:**
1. Vào Table Editor → `personality_profiles`
2. Thấy 1 record mới với mbti_type và mbti_scores

#### 2.2 Big5 Test
```
URL: http://localhost:3001/tests/big5
```

**Steps:**
1. [ ] Vào /tests → Click "Big Five"
2. [ ] Trả lời 50 câu hỏi
3. [ ] Submit và xem results

**Expected Results:**
- ✅ 5 dimensions hiển thị (O, C, E, A, N)
- ✅ Mỗi dimension có score 0-100
- ✅ Radar chart hoặc bar chart
- ✅ Data được update trong `personality_profiles`

#### 2.3 SISRI-24 Test
```
URL: http://localhost:3001/tests/sisri24
```

**Steps:**
1. [ ] Vào /tests → Click "SISRI-24"
2. [ ] Trả lời 24 câu hỏi
3. [ ] Submit và xem results

**Expected Results:**
- ✅ Spiritual intelligence score
- ✅ Results page với detailed analysis
- ✅ Mascot shows achievement notification

---

### **PHASE 3: Tests - Mental Health**

#### 3.1 PHQ-9 (Depression)
```
URL: http://localhost:3001/tests/phq9
```

**Steps:**
1. [ ] Vào /tests → Click "PHQ-9"
2. [ ] Trả lời 9 câu hỏi (scale 0-3)
3. [ ] Submit và xem results

**Expected Results:**
- ✅ Total score displayed
- ✅ Severity level (Normal/Mild/Moderate/Severe/Extremely Severe)
- ✅ Crisis detection nếu score cao
- ✅ Recommendations based on severity
- ✅ Data lưu vào `mental_health_records`

**Verify in Supabase:**
1. Vào Table Editor → `mental_health_records`
2. Thấy record với test_type='PHQ9', total_score, severity_level

#### 3.2 GAD-7 (Anxiety)
```
URL: http://localhost:3001/tests/gad7
```

**Steps:**
1. [ ] Vào /tests → Click "GAD-7"
2. [ ] Trả lời 7 câu hỏi
3. [ ] Submit và xem results

**Expected Results:**
- ✅ Anxiety level assessment
- ✅ Severity classification
- ✅ Data persisted

#### 3.3 DASS-21 (Depression, Anxiety, Stress)
```
URL: http://localhost:3001/tests/dass21
```

**Steps:**
1. [ ] Vào /tests → Click "DASS-21"
2. [ ] Trả lời 21 câu hỏi
3. [ ] Submit và xem results

**Expected Results:**
- ✅ 3 separate scores (Depression, Anxiety, Stress)
- ✅ Each with severity level
- ✅ Subscale_scores saved as JSONB

#### 3.4 PSS (Perceived Stress Scale)
```
URL: http://localhost:3001/tests/pss
```

**Steps:**
1. [ ] Vào /tests → Click "PSS"
2. [ ] Trả lời 10 câu hỏi
3. [ ] Submit và xem results

**Expected Results:**
- ✅ Stress score và level
- ✅ Coping recommendations

---

### **PHASE 4: Profile Page**

#### 4.1 View Profile
```
URL: http://localhost:3001/profile
```

**Steps:**
1. [ ] Click Profile link hoặc vào /profile
2. [ ] Xem tất cả sections

**Expected Results:**
- ✅ **Personality Overview**
  - MBTI type card
  - Big5 radar chart
- ✅ **Mental Health Chart**
  - Line chart với test scores theo thời gian
  - Multiple test types
- ✅ **Test History**
  - List của tất cả tests đã làm
  - Date, type, score, severity
- ✅ **Recommendations**
  - AI-generated suggestions based on results

---

### **PHASE 5: Goals & Action Plans**

#### 5.1 Create a Goal
```
URL: http://localhost:3001/goals
```

**Steps:**
1. [ ] Vào /goals
2. [ ] Click "Create Goal"
3. [ ] Fill form:
   - Title: "Reduce stress level"
   - Category: Mental Health
   - Target date: 30 days from now
4. [ ] Submit

**Expected Results:**
- ✅ Goal appears in list
- ✅ Status: Active
- ✅ Progress bar showing 0%
- ✅ Data in `user_goals` table

#### 5.2 Create Action Plan
**Steps:**
1. [ ] Click on the goal
2. [ ] Click "Add Action Plan"
3. [ ] Fill form:
   - Title: "Meditate daily"
   - Type: Daily Habit
   - Reminder: 9:00 AM
4. [ ] Submit

**Expected Results:**
- ✅ Action plan appears
- ✅ Reminder enabled
- ✅ Data in `action_plans` table

#### 5.3 Complete Action
**Steps:**
1. [ ] Click "Mark as complete" on action
2. [ ] Add notes (optional)
3. [ ] Select mood
4. [ ] Submit

**Expected Results:**
- ✅ Completion recorded
- ✅ Streak increments
- ✅ Mascot celebrates
- ✅ Data in `action_completions` table

---

### **PHASE 6: Dolphin Mascot**

#### 6.1 Interactions
**Steps:**
1. [ ] Click on mascot
2. [ ] View chat dialog
3. [ ] See messages based on context
4. [ ] Check achievements

**Expected Results:**
- ✅ Mascot changes mood based on your mental health
- ✅ Messages are contextual
- ✅ Achievements unlock when milestones reached
- ✅ Points and level system working

#### 6.2 Achievements to Test
- [ ] "First Step" - Complete 1 test
- [ ] "Test Trio" - Complete 3 tests
- [ ] "Week Warrior" - 7 day streak
- [ ] "Spiritual Explorer" - Complete SISRI-24
- [ ] "Personality Master" - Complete MBTI + Big5

---

### **PHASE 7: Database Verification**

#### 7.1 Check All Tables
```
Supabase Dashboard → Table Editor
```

**Checklist:**
- [ ] `users` - Your user record exists
- [ ] `personality_profiles` - MBTI + Big5 scores
- [ ] `mental_health_records` - All test results
- [ ] `user_goals` - Goals created
- [ ] `action_plans` - Action plans
- [ ] `action_completions` - Completions logged
- [ ] `test_reminders` - Reminders (if any)

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Cannot read properties of null"
**Fix:** Refresh page, check if logged in

### Issue: Test results not saving
**Fix:** Check Supabase Table Editor, verify RLS policies

### Issue: Mascot not appearing
**Fix:** Check console for errors, ensure Zustand store is working

### Issue: Charts not displaying
**Fix:** Ensure you have test data, check Recharts library

---

## ✅ SUCCESS CRITERIA

Sau khi test xong, bạn đã:
1. ✅ Tạo tài khoản và login thành công
2. ✅ Làm ít nhất 3 tests khác nhau
3. ✅ Xem Profile page với data
4. ✅ Tạo 1 goal và 1 action plan
5. ✅ Complete 1 action
6. ✅ Mascot hoạt động và hiển thị achievements
7. ✅ Data được lưu đúng trong Supabase

---

## 📊 TEST REPORT TEMPLATE

```markdown
## Test Report - [Date]

### Environment
- Browser: [Chrome/Firefox/Safari]
- Device: [Mac/Windows/Mobile]
- URL: http://localhost:3001

### Tests Completed
- [ ] Authentication: ✅ / ❌
- [ ] Dashboard: ✅ / ❌
- [ ] MBTI Test: ✅ / ❌
- [ ] Big5 Test: ✅ / ❌
- [ ] SISRI-24: ✅ / ❌
- [ ] PHQ-9: ✅ / ❌
- [ ] GAD-7: ✅ / ❌
- [ ] DASS-21: ✅ / ❌
- [ ] PSS: ✅ / ❌
- [ ] Profile Page: ✅ / ❌
- [ ] Goals System: ✅ / ❌
- [ ] Mascot: ✅ / ❌

### Bugs Found
1. [Description]
2. [Description]

### Notes
[Any additional observations]
```

---

## 🚀 NEXT STEPS

Sau khi test xong và mọi thứ hoạt động:
1. Deploy lên Vercel
2. Setup production database
3. Configure custom domain
4. Setup analytics

**Chúc bạn test thành công! 🎉**
