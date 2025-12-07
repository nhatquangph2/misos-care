// TypeScript types for Goals and Action Plans system

export type GoalCategory = 'mental_health' | 'personality_growth' | 'habits' | 'relationships' | 'career' | 'custom';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export type ActionType = 'daily_habit' | 'weekly_habit' | 'one_time' | 'test_schedule' | 'custom';

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type MoodRating = 'great' | 'good' | 'okay' | 'bad' | 'terrible';

export type TestFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly';

export type ReminderMethod = 'notification' | 'email';

// ============================================
// USER GOAL
// ============================================

export interface UserGoal {
  id: string;
  user_id: string;

  // Goal info
  title: string;
  description?: string;
  category: GoalCategory;

  // Target
  target_metric?: string; // e.g., 'stress_level', 'test_frequency'
  target_value?: number;
  current_value: number;

  // Timeline
  start_date: string; // ISO date
  target_date: string; // ISO date

  // Status
  status: GoalStatus;
  completion_percentage: number; // 0-100

  // Motivation
  motivation_text?: string;
  reward_text?: string;

  // Tracking
  completed_at?: string; // ISO timestamp

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface CreateGoalInput {
  title: string;
  description?: string;
  category: GoalCategory;
  target_metric?: string;
  target_value?: number;
  target_date: string;
  motivation_text?: string;
  reward_text?: string;
}

export interface UpdateGoalInput {
  title?: string;
  description?: string;
  status?: GoalStatus;
  current_value?: number;
  completion_percentage?: number;
  target_date?: string;
  motivation_text?: string;
  reward_text?: string;
}

// ============================================
// ACTION PLAN
// ============================================

export interface ActionPlan {
  id: string;
  goal_id?: string; // Optional - can be standalone
  user_id: string;

  // Action info
  title: string;
  description?: string;
  action_type: ActionType;

  // Frequency
  frequency_type?: FrequencyType;
  frequency_value?: number; // e.g., 3 times per week
  frequency_days?: DayOfWeek[];

  // Reminders
  reminder_enabled: boolean;
  reminder_time?: string; // HH:MM format
  reminder_days?: DayOfWeek[];

  // Progress tracking
  total_completions: number;
  current_streak: number;
  longest_streak: number;
  last_completed_at?: string;

  // Status
  is_active: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface CreateActionPlanInput {
  goal_id?: string;
  title: string;
  description?: string;
  action_type: ActionType;
  frequency_type?: FrequencyType;
  frequency_value?: number;
  frequency_days?: DayOfWeek[];
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_days?: DayOfWeek[];
}

export interface UpdateActionPlanInput {
  title?: string;
  description?: string;
  frequency_type?: FrequencyType;
  frequency_value?: number;
  frequency_days?: DayOfWeek[];
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_days?: DayOfWeek[];
  is_active?: boolean;
}

// ============================================
// ACTION COMPLETION
// ============================================

export interface ActionCompletion {
  id: string;
  action_plan_id: string;
  user_id: string;

  // Completion info
  completed_at: string;
  completion_date: string; // ISO date

  // Notes
  notes?: string;
  mood?: MoodRating;

  // Metadata
  created_at: string;
}

export interface CreateCompletionInput {
  action_plan_id: string;
  notes?: string;
  mood?: MoodRating;
  completion_date?: string; // Optional, defaults to today
}

// ============================================
// TEST REMINDER
// ============================================

export interface TestReminder {
  id: string;
  user_id: string;

  // Test info
  test_type: string;

  // Schedule
  frequency: TestFrequency;
  next_reminder_date: string; // ISO date
  last_completed_date?: string;

  // Reminder settings
  reminder_enabled: boolean;
  reminder_time: string; // HH:MM format
  reminder_method: ReminderMethod[];

  // Status
  is_active: boolean;

  // Metadata
  created_at: string;
  updated_at: string;
}

export interface CreateTestReminderInput {
  test_type: string;
  frequency: TestFrequency;
  next_reminder_date: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_method?: ReminderMethod[];
}

export interface UpdateTestReminderInput {
  frequency?: TestFrequency;
  next_reminder_date?: string;
  reminder_enabled?: boolean;
  reminder_time?: string;
  reminder_method?: ReminderMethod[];
  is_active?: boolean;
}

// ============================================
// GOALS SUMMARY
// ============================================

export interface GoalsSummary {
  goals: UserGoal[];
  actionPlans: ActionPlan[];
  testReminders: TestReminder[];
  stats: {
    activeGoals: number;
    completedGoals: number;
    totalActions: number;
    activeActions: number;
    totalCompletionsThisWeek: number;
    totalCompletionsThisMonth: number;
    longestStreak: number;
  };
}
