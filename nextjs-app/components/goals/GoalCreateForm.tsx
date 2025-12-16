/**
 * Goal Create Form - Using Server Actions
 * Example of Zero-API approach
 */

'use client';

import { useFormStatus } from 'react-dom';
import { createGoal } from '@/app/actions/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          Đang tạo...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Tạo mục tiêu
        </>
      )}
    </Button>
  );
}

export function GoalCreateForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo Mục Tiêu Mới</CardTitle>
        <CardDescription>
          Đặt mục tiêu cho sức khỏe tinh thần và theo dõi tiến độ
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={createGoal} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Ví dụ: Viết nhật ký cảm xúc mỗi ngày"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Mô tả chi tiết về mục tiêu của bạn..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800"
            />
          </div>

          {/* Target Date */}
          <div>
            <label htmlFor="target_date" className="block text-sm font-medium mb-2">
              Ngày hoàn thành dự kiến
            </label>
            <input
              id="target_date"
              name="target_date"
              type="date"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-800"
            />
          </div>

          {/* Submit Button */}
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
