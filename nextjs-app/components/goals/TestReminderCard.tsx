'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import type { TestReminder } from '@/types/goals';

interface TestReminderCardProps {
  reminder: TestReminder;
  onEdit?: (reminder: TestReminder) => void;
  onDelete?: (reminderId: string) => void;
  onToggle?: (reminderId: string, enabled: boolean) => void;
}

const TEST_NAMES: Record<string, string> = {
  DASS21: 'DASS-21',
  PHQ9: 'PHQ-9',
  GAD7: 'GAD-7',
  PSS: 'PSS',
  MBTI: 'MBTI',
  BIG5: 'Big Five',
  SISRI24: 'SISRI-24',
};

const FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Hàng tuần',
  biweekly: 'Hai tuần một lần',
  monthly: 'Hàng tháng',
  quarterly: 'Hàng quý',
};

export function TestReminderCard({ reminder, onEdit, onDelete, onToggle }: TestReminderCardProps) {
  const testName = TEST_NAMES[reminder.test_type] || reminder.test_type;
  const frequencyLabel = FREQUENCY_LABELS[reminder.frequency] || reminder.frequency;

  const nextReminderDate = parseISO(reminder.next_reminder_date);
  const isUpcoming = nextReminderDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Within 7 days

  return (
    <Card className={reminder.reminder_enabled ? '' : 'opacity-60'}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {testName}
              {reminder.reminder_enabled ? (
                <Bell className="h-4 w-4 text-blue-500" />
              ) : (
                <BellOff className="h-4 w-4 text-gray-400" />
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {frequencyLabel}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit?.(reminder)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-600"
              onClick={() => onDelete?.(reminder.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Next reminder date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">Nhắc nhở tiếp theo:</span>
          <span className="font-medium">
            {format(nextReminderDate, 'dd/MM/yyyy', { locale: vi })}
          </span>
          {isUpcoming && (
            <Badge variant="secondary" className="ml-auto">
              Sắp tới
            </Badge>
          )}
        </div>

        {/* Reminder time */}
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">Thời gian:</span>
          <span className="font-medium">{reminder.reminder_time}</span>
        </div>

        {/* Last completed date */}
        {reminder.last_completed_date && (
          <div className="text-xs text-gray-500">
            Làm lần cuối: {format(parseISO(reminder.last_completed_date), 'dd/MM/yyyy', { locale: vi })}
          </div>
        )}

        {/* Reminder methods */}
        <div className="flex flex-wrap gap-1">
          {reminder.reminder_method.map((method) => (
            <Badge key={method} variant="outline" className="text-xs">
              {method === 'notification' ? 'Thông báo' : 'Email'}
            </Badge>
          ))}
        </div>

        {/* Toggle button */}
        <Button
          variant={reminder.reminder_enabled ? 'outline' : 'default'}
          size="sm"
          className="w-full mt-2"
          onClick={() => onToggle?.(reminder.id, !reminder.reminder_enabled)}
        >
          {reminder.reminder_enabled ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Tắt nhắc nhở
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Bật nhắc nhở
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
