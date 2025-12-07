'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, X } from 'lucide-react';
import type { TestReminder, CreateTestReminderInput, UpdateTestReminderInput, TestFrequency, ReminderMethod } from '@/types/goals';

interface TestReminderFormProps {
  reminder?: TestReminder;
  onSubmit: (data: CreateTestReminderInput | UpdateTestReminderInput) => Promise<void>;
  onCancel?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const TEST_OPTIONS = [
  { value: 'DASS21', label: 'DASS-21 - Trầm cảm, Lo âu, Stress' },
  { value: 'PHQ9', label: 'PHQ-9 - Trầm cảm' },
  { value: 'GAD7', label: 'GAD-7 - Lo âu' },
  { value: 'PSS', label: 'PSS - Stress' },
  { value: 'MBTI', label: 'MBTI - Tính cách' },
  { value: 'BIG5', label: 'Big Five - Tính cách 5 yếu tố' },
  { value: 'SISRI24', label: 'SISRI-24 - Trí tuệ cảm xúc' },
];

const FREQUENCY_OPTIONS: { value: TestFrequency; label: string }[] = [
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'biweekly', label: 'Hai tuần một lần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý (3 tháng)' },
];

export function TestReminderForm({ reminder, onSubmit, onCancel, isOpen = true, onOpenChange }: TestReminderFormProps) {
  const [testType, setTestType] = useState<string>(reminder?.test_type || 'DASS21');
  const [frequency, setFrequency] = useState<TestFrequency>(reminder?.frequency || 'monthly');
  const [nextReminderDate, setNextReminderDate] = useState<string>(
    reminder?.next_reminder_date || new Date().toISOString().split('T')[0]
  );
  const [reminderTime, setReminderTime] = useState<string>(reminder?.reminder_time || '09:00');
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(reminder?.reminder_enabled ?? true);
  const [reminderMethod, setReminderMethod] = useState<ReminderMethod[]>(
    reminder?.reminder_method || ['notification']
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (reminder) {
        // Update existing reminder
        await onSubmit({
          frequency,
          next_reminder_date: nextReminderDate,
          reminder_enabled: reminderEnabled,
          reminder_time: reminderTime,
          reminder_method: reminderMethod,
        });
      } else {
        // Create new reminder
        await onSubmit({
          test_type: testType,
          frequency,
          next_reminder_date: nextReminderDate,
          reminder_enabled: reminderEnabled,
          reminder_time: reminderTime,
          reminder_method: reminderMethod,
        });
      }

      onOpenChange?.(false);
    } catch (error) {
      console.error('Error saving reminder:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReminderMethod = (method: ReminderMethod) => {
    setReminderMethod(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {reminder ? 'Chỉnh sửa nhắc nhở' : 'Tạo nhắc nhở mới'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {reminder
              ? 'Cập nhật thông tin nhắc nhở làm test định kỳ'
              : 'Thiết lập nhắc nhở để không bỏ lỡ các bài test quan trọng'}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Test Type (only for new reminder) */}
          {!reminder && (
            <div className="space-y-2">
              <Label htmlFor="testType">Loại test *</Label>
              <select
                id="testType"
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {TEST_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Frequency */}
          <div className="space-y-2">
            <Label htmlFor="frequency">Tần suất *</Label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as TestFrequency)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {FREQUENCY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Next Reminder Date */}
          <div className="space-y-2">
            <Label htmlFor="nextReminderDate">Ngày nhắc nhở tiếp theo *</Label>
            <Input
              id="nextReminderDate"
              type="date"
              value={nextReminderDate}
              onChange={(e) => setNextReminderDate(e.target.value)}
              required
            />
          </div>

          {/* Reminder Time */}
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Thời gian nhắc nhở *</Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              required
            />
          </div>

          {/* Reminder Method */}
          <div className="space-y-2">
            <Label>Phương thức nhắc nhở *</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={reminderMethod.includes('notification') ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReminderMethod('notification')}
              >
                Thông báo
              </Button>
              <Button
                type="button"
                variant={reminderMethod.includes('email') ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleReminderMethod('email')}
              >
                Email
              </Button>
            </div>
          </div>

          {/* Reminder Enabled */}
          <div className="flex items-center gap-2">
            <input
              id="reminderEnabled"
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="reminderEnabled" className="cursor-pointer">
              Bật nhắc nhở ngay
            </Label>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" onClick={onCancel}>
              Hủy
            </AlertDialogCancel>
            <Button type="submit" disabled={isSubmitting || reminderMethod.length === 0}>
              {isSubmitting ? 'Đang lưu...' : reminder ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
