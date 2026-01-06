'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Clock, CheckCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import {
    getNotificationSettings,
    saveNotificationSettings,
    type NotificationSettings,
    DEFAULT_NOTIFICATION_SETTINGS
} from '@/lib/notification-scheduler';

export default function NotificationSettingsCard() {
    const { hasPermission, permission, requestPermission, isLoading } = useNotifications();
    const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        setSettings(getNotificationSettings());
    }, []);

    const handleToggle = () => {
        const newSettings = { ...settings, enabled: !settings.enabled };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleTimeChange = (field: 'morningTime' | 'eveningTime', value: string) => {
        const newSettings = { ...settings, [field]: value };
        setSettings(newSettings);
        saveNotificationSettings(newSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleRequestPermission = async () => {
        try {
            await requestPermission();
        } catch (e) {
            console.error('Failed to request permission:', e);
        }
    };

    return (
        <Card className="glass-card shape-organic-4">
            <CardHeader>
                <CardTitle className="dark:text-gray-100 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Cài đặt thông báo
                </CardTitle>
                <CardDescription className="dark:text-gray-400">
                    Nhận nhắc nhở check-in và làm test hàng ngày
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Permission Status */}
                {!hasPermission && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                            Bạn cần cấp quyền thông báo để nhận nhắc nhở.
                        </p>
                        <Button
                            onClick={handleRequestPermission}
                            disabled={isLoading}
                            variant="outline"
                            className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
                        >
                            {isLoading ? 'Đang xử lý...' : 'Cấp quyền thông báo'}
                        </Button>
                    </div>
                )}

                {permission === 'denied' && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <p className="text-sm text-red-700 dark:text-red-300">
                            Bạn đã chặn thông báo. Vui lòng vào cài đặt trình duyệt để bật lại.
                        </p>
                    </div>
                )}

                {/* Toggle Enable/Disable */}
                <div className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        {settings.enabled ? (
                            <Bell className="h-5 w-5 text-purple-500" />
                        ) : (
                            <BellOff className="h-5 w-5 text-gray-400" />
                        )}
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                Thông báo nhắc nhở
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {settings.enabled ? 'Đang bật' : 'Đã tắt'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleToggle}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>

                {/* Time Settings */}
                {settings.enabled && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="h-4 w-4" />
                            <span>Thời gian nhắc nhở</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="morningTime" className="dark:text-gray-200">
                                    Buổi sáng
                                </Label>
                                <Input
                                    id="morningTime"
                                    type="time"
                                    value={settings.morningTime}
                                    onChange={(e) => handleTimeChange('morningTime', e.target.value)}
                                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div>
                                <Label htmlFor="eveningTime" className="dark:text-gray-200">
                                    Buổi tối
                                </Label>
                                <Input
                                    id="eveningTime"
                                    type="time"
                                    value={settings.eveningTime}
                                    onChange={(e) => handleTimeChange('eveningTime', e.target.value)}
                                    className="mt-1 dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Saved indicator */}
                {saved && (
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span>Đã lưu!</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
