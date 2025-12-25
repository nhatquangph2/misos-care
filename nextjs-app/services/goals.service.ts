import { BaseService } from './base.service';
import type {
  UserGoal,
  CreateGoalInput,
  UpdateGoalInput,
  ActionPlan,
  CreateActionPlanInput,
  UpdateActionPlanInput,
  ActionCompletion,
  CreateCompletionInput,
  TestReminder,
  CreateTestReminderInput,
  UpdateTestReminderInput,
  GoalsSummary
} from '@/types/goals';

export class GoalsService extends BaseService {
  // ============================================
  // USER GOALS
  // ============================================

  /**
   * Get all goals for a user
   */
  async getUserGoals(userId: string, status?: string): Promise<UserGoal[]> {
    let query = this.supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Get a single goal by ID
   */
  async getGoalById(goalId: string): Promise<UserGoal | null> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .select('*')
      .eq('id', goalId)
      .maybeSingle();

    if (error) throw error;
    return data as any;
  }

  /**
   * Create a new goal
   */
  async createGoal(userId: string, input: CreateGoalInput): Promise<UserGoal> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .insert({
        user_id: userId,
        ...input,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as any as UserGoal;
  }

  /**
   * Update a goal
   */
  async updateGoal(goalId: string, input: UpdateGoalInput): Promise<UserGoal> {
    const { data, error } = await this.supabase
      .from('user_goals')
      .update(input as any)
      .eq('id', goalId)
      .select()
      .single();

    if (error) throw error;
    return data as any as UserGoal;
  }

  /**
   * Complete a goal
   */
  async completeGoal(goalId: string): Promise<UserGoal> {
    return this.updateGoal(goalId, {
      status: 'completed',
      completion_percentage: 100,
    });
  }

  /**
   * Delete a goal
   */
  async deleteGoal(goalId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_goals')
      .delete()
      .eq('id', goalId);

    if (error) throw error;
  }

  // ============================================
  // ACTION PLANS
  // ============================================

  /**
   * Get all action plans for a user
   */
  async getActionPlans(userId: string, activeOnly = true): Promise<ActionPlan[]> {
    let query = this.supabase
      .from('action_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Get action plans for a specific goal
   */
  async getActionPlansByGoal(goalId: string): Promise<ActionPlan[]> {
    const { data, error } = await this.supabase
      .from('action_plans')
      .select('*')
      .eq('goal_id', goalId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Create a new action plan
   */
  async createActionPlan(userId: string, input: CreateActionPlanInput): Promise<ActionPlan> {
    const { data, error } = await this.supabase
      .from('action_plans')
      .insert({
        user_id: userId,
        reminder_enabled: input.reminder_enabled ?? false,
        ...input,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as any as ActionPlan;
  }

  /**
   * Update an action plan
   */
  async updateActionPlan(planId: string, input: UpdateActionPlanInput): Promise<ActionPlan> {
    const { data, error } = await this.supabase
      .from('action_plans')
      .update(input as any)
      .eq('id', planId)
      .select()
      .single();

    if (error) throw error;
    return data as any as ActionPlan;
  }

  /**
   * Delete an action plan
   */
  async deleteActionPlan(planId: string): Promise<void> {
    const { error } = await this.supabase
      .from('action_plans')
      .delete()
      .eq('id', planId);

    if (error) throw error;
  }

  // ============================================
  // ACTION COMPLETIONS
  // ============================================

  /**
   * Get completions for an action plan
   */
  async getActionCompletions(planId: string, limit = 30): Promise<ActionCompletion[]> {
    const { data, error } = await this.supabase
      .from('action_completions')
      .select('*')
      .eq('action_plan_id', planId)
      .order('completion_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Get user's completions for a date range
   */
  async getUserCompletions(userId: string, startDate: string, endDate: string): Promise<ActionCompletion[]> {
    const { data, error } = await this.supabase
      .from('action_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completion_date', startDate)
      .lte('completion_date', endDate)
      .order('completion_date', { ascending: false });

    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Mark action as completed
   */
  async completeAction(userId: string, input: CreateCompletionInput): Promise<ActionCompletion> {
    const completionDate = input.completion_date || new Date().toISOString().split('T')[0];

    const { data, error } = await this.supabase
      .from('action_completions')
      .insert({
        user_id: userId,
        action_plan_id: input.action_plan_id,
        notes: input.notes,
        mood: input.mood,
        completion_date: completionDate,
      } as any)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Hành động này đã được đánh dấu hoàn thành hôm nay');
      }
      throw error;
    }

    return data as any as ActionCompletion;
  }

  /**
   * Delete a completion
   */
  async deleteCompletion(completionId: string): Promise<void> {
    const { error } = await this.supabase
      .from('action_completions')
      .delete()
      .eq('id', completionId);

    if (error) throw error;
  }

  // ============================================
  // TEST REMINDERS
  // ============================================

  /**
   * Get all test reminders for a user
   */
  async getTestReminders(userId: string, activeOnly = true): Promise<TestReminder[]> {
    let query = this.supabase
      .from('test_reminders')
      .select('*')
      .eq('user_id', userId)
      .order('next_reminder_date', { ascending: true });

    if (activeOnly) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Create a test reminder
   */
  async createTestReminder(userId: string, input: CreateTestReminderInput): Promise<TestReminder> {
    const { data, error } = await this.supabase
      .from('test_reminders')
      .insert({
        user_id: userId,
        reminder_enabled: input.reminder_enabled ?? true,
        reminder_time: input.reminder_time || '09:00',
        reminder_method: input.reminder_method || ['notification'],
        ...input,
      } as any)
      .select()
      .single();

    if (error) throw error;
    return data as any as TestReminder;
  }

  /**
   * Update a test reminder
   */
  async updateTestReminder(reminderId: string, input: UpdateTestReminderInput): Promise<TestReminder> {
    const { data, error } = await this.supabase
      .from('test_reminders')
      .update(input as any)
      .eq('id', reminderId)
      .select()
      .single();

    if (error) throw error;
    return data as any as TestReminder;
  }

  /**
   * Delete a test reminder
   */
  async deleteTestReminder(reminderId: string): Promise<void> {
    const { error } = await this.supabase
      .from('test_reminders')
      .delete()
      .eq('id', reminderId);

    if (error) throw error;
  }

  // ============================================
  // GOALS SUMMARY
  // ============================================

  /**
   * Get comprehensive goals summary for user
   */
  async getGoalsSummary(userId: string): Promise<GoalsSummary> {
    const [goals, actionPlans, testReminders] = await Promise.all([
      this.getUserGoals(userId),
      this.getActionPlans(userId, false),
      this.getTestReminders(userId, false),
    ]);

    const activeGoalsCount = goals.filter(g => g.status === 'active').length;
    const completedGoalsCount = goals.filter(g => g.status === 'completed').length;
    const activeActionsCount = actionPlans.filter(a => a.is_active).length;
    const longestStreak = Math.max(0, ...actionPlans.map(a => a.longest_streak));

    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [weekCompletions, monthCompletions] = await Promise.all([
      this.getUserCompletions(userId, startOfWeek.toISOString().split('T')[0], today.toISOString().split('T')[0]),
      this.getUserCompletions(userId, startOfMonth.toISOString().split('T')[0], today.toISOString().split('T')[0]),
    ]);

    return {
      goals,
      actionPlans,
      testReminders,
      stats: {
        activeGoals: activeGoalsCount,
        completedGoals: completedGoalsCount,
        totalActions: actionPlans.length,
        activeActions: activeActionsCount,
        totalCompletionsThisWeek: weekCompletions.length,
        totalCompletionsThisMonth: monthCompletions.length,
        longestStreak,
      },
    };
  }
}

export const goalsService = new GoalsService();

export const getUserGoals = (id: string, s?: string) => goalsService.getUserGoals(id, s);
export const getGoalById = (id: string) => goalsService.getGoalById(id);
export const createGoal = (id: string, input: CreateGoalInput) => goalsService.createGoal(id, input);
export const updateGoal = (id: string, input: UpdateGoalInput) => goalsService.updateGoal(id, input);
export const completeGoal = (id: string) => goalsService.completeGoal(id);
export const deleteGoal = (id: string) => goalsService.deleteGoal(id);
export const getActionPlans = (id: string, active?: boolean) => goalsService.getActionPlans(id, active);
export const getActionPlansByGoal = (id: string) => goalsService.getActionPlansByGoal(id);
export const createActionPlan = (id: string, input: CreateActionPlanInput) => goalsService.createActionPlan(id, input);
export const updateActionPlan = (id: string, input: UpdateActionPlanInput) => goalsService.updateActionPlan(id, input);
export const deleteActionPlan = (id: string) => goalsService.deleteActionPlan(id);
export const getActionCompletions = (id: string, l?: number) => goalsService.getActionCompletions(id, l);
export const getUserCompletions = (id: string, s: string, e: string) => goalsService.getUserCompletions(id, s, e);
export const completeAction = (id: string, input: CreateCompletionInput) => goalsService.completeAction(id, input);
export const deleteCompletion = (id: string) => goalsService.deleteCompletion(id);
export const getTestReminders = (id: string, active?: boolean) => goalsService.getTestReminders(id, active);
export const createTestReminder = (id: string, input: CreateTestReminderInput) => goalsService.createTestReminder(id, input);
export const updateTestReminder = (id: string, input: UpdateTestReminderInput) => goalsService.updateTestReminder(id, input);
export const deleteTestReminder = (id: string) => goalsService.deleteTestReminder(id);
export const getGoalsSummary = (id: string) => goalsService.getGoalsSummary(id);
