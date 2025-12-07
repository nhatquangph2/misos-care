'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Check, X, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

export function NotificationSettings() {
  const {
    isSupported,
    permission,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    showNotification,
  } = useNotifications();

  const [testSent, setTestSent] = useState(false);

  const handleRequestPermission = async () => {
    try {
      const result = await requestPermission();
      if (result === 'granted') {
        // Show a welcome notification
        setTimeout(() => {
          showNotification({
            title: 'Thông báo đã được bật!',
            body: 'Bạn sẽ nhận được nhắc nhở cho các test và hành động.',
            icon: '/icon-192x192.png',
          });
        }, 500);
      }
    } catch (err) {
      console.error('Error requesting permission:', err);
    }
  };

  const handleTestNotification = async () => {
    try {
      await showNotification({
        title: 'Thông báo thử nghiệm',
        body: 'Đây là thông báo thử nghiệm. Hệ thống thông báo của bạn đang hoạt động tốt!',
        icon: '/icon-192x192.png',
        tag: 'test-notification',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } catch (err) {
      console.error('Error showing test notification:', err);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5 text-gray-400" />
            Thông báo không được hỗ trợ
          </CardTitle>
          <CardDescription>
            Trình duyệt của bạn không hỗ trợ thông báo đẩy. Vui lòng sử dụng trình duyệt khác như Chrome, Firefox, hoặc Edge.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasPermission ? (
            <Bell className="h-5 w-5 text-green-500" />
          ) : (
            <BellOff className="h-5 w-5 text-gray-400" />
          )}
          Cài đặt thông báo
        </CardTitle>
        <CardDescription>
          Quản lý thông báo nhắc nhở cho test và hành động
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex-1">
            <div className="font-medium mb-1">Trạng thái thông báo</div>
            <div className="text-sm text-gray-500">
              {permission === 'granted' && 'Thông báo đã được bật'}
              {permission === 'denied' && 'Thông báo đã bị chặn'}
              {permission === 'default' && 'Chưa cấp quyền thông báo'}
            </div>
          </div>
          <Badge
            variant={permission === 'granted' ? 'default' : 'secondary'}
            className={
              permission === 'granted'
                ? 'bg-green-500 hover:bg-green-600'
                : permission === 'denied'
                ? 'bg-red-500 hover:bg-red-600'
                : ''
            }
          >
            {permission === 'granted' && (
              <>
                <Check className="h-3 w-3 mr-1" />
                Đã bật
              </>
            )}
            {permission === 'denied' && (
              <>
                <X className="h-3 w-3 mr-1" />
                Bị chặn
              </>
            )}
            {permission === 'default' && 'Chưa cấp'}
          </Badge>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          {!hasPermission && permission !== 'denied' && (
            <Button
              onClick={handleRequestPermission}
              disabled={isLoading}
              className="w-full"
            >
              <Bell className="h-4 w-4 mr-2" />
              {isLoading ? 'Đang xử lý...' : 'Bật thông báo'}
            </Button>
          )}

          {permission === 'denied' && (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg text-sm">
              <p className="font-medium mb-1">Thông báo đã bị chặn</p>
              <p className="text-xs">
                Để bật thông báo, vui lòng vào cài đặt trình duyệt và cho phép thông báo cho trang web này.
              </p>
            </div>
          )}

          {hasPermission && (
            <Button
              onClick={handleTestNotification}
              variant="outline"
              className="w-full"
              disabled={testSent}
            >
              {testSent ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Đã gửi
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Gửi thông báo thử nghiệm
                </>
              )}
            </Button>
          )}
        </div>

        {/* Information */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p>• Thông báo sẽ được gửi khi đến thời gian nhắc nhở</p>
          <p>• Bạn có thể tắt thông báo bất cứ lúc nào trong cài đặt trình duyệt</p>
          <p>• Thông báo chỉ hoạt động khi bạn cho phép</p>
        </div>
      </CardContent>
    </Card>
  );
}
