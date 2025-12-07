'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Bell } from 'lucide-react';
import { TestReminderCard } from './TestReminderCard';
import { TestReminderForm } from './TestReminderForm';
import { goalsService } from '@/services/goals.service';
import type { TestReminder, CreateTestReminderInput, UpdateTestReminderInput } from '@/types/goals';

interface TestRemindersManagerProps {
  userId: string;
}

export function TestRemindersManager({ userId }: TestRemindersManagerProps) {
  const [reminders, setReminders] = useState<TestReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<TestReminder | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);

  // Load reminders
  const loadReminders = async () => {
    try {
      setIsLoading(true);
      const data = await goalsService.getTestReminders(userId, false);
      setReminders(data);
    } catch (error) {
      console.error('Error loading reminders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [userId]);

  // Create new reminder
  const handleCreate = async (data: CreateTestReminderInput) => {
    try {
      await goalsService.createTestReminder(userId, data);
      await loadReminders();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  };

  // Update reminder
  const handleUpdate = async (data: UpdateTestReminderInput) => {
    if (!editingReminder) return;

    try {
      await goalsService.updateTestReminder(editingReminder.id, data);
      await loadReminders();
      setEditingReminder(undefined);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  };

  // Delete reminder
  const handleDelete = async () => {
    if (!reminderToDelete) return;

    try {
      await goalsService.deleteTestReminder(reminderToDelete);
      await loadReminders();
      setDeleteConfirmOpen(false);
      setReminderToDelete(null);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Toggle reminder enabled
  const handleToggle = async (reminderId: string, enabled: boolean) => {
    try {
      await goalsService.updateTestReminder(reminderId, {
        reminder_enabled: enabled,
      });
      await loadReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  // Open edit form
  const handleEdit = (reminder: TestReminder) => {
    setEditingReminder(reminder);
    setIsFormOpen(true);
  };

  // Handle form submit (create or update)
  const handleSubmit = async (data: CreateTestReminderInput | UpdateTestReminderInput) => {
    if (editingReminder) {
      await handleUpdate(data as UpdateTestReminderInput);
    } else {
      await handleCreate(data as CreateTestReminderInput);
    }
  };

  // Open delete confirmation
  const handleDeleteClick = (reminderId: string) => {
    setReminderToDelete(reminderId);
    setDeleteConfirmOpen(true);
  };

  // Open create form
  const handleCreateClick = () => {
    setEditingReminder(undefined);
    setIsFormOpen(true);
  };

  // Close form
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingReminder(undefined);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nhắc nhở làm test</CardTitle>
          <CardDescription>Đang tải...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Nhắc nhở làm test
              </CardTitle>
              <CardDescription className="mt-1">
                Quản lý lịch nhắc nhở làm các bài test định kỳ
              </CardDescription>
            </div>
            <Button onClick={handleCreateClick} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhắc nhở
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có nhắc nhở nào</p>
              <p className="text-xs mt-1">Tạo nhắc nhở để không bỏ lỡ các bài test quan trọng</p>
              <Button onClick={handleCreateClick} variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Tạo nhắc nhở đầu tiên
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reminders.map((reminder) => (
                <TestReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {isFormOpen && (
        <TestReminderForm
          reminder={editingReminder}
          onSubmit={handleSubmit}
          onCancel={handleFormClose}
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhắc nhở này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
