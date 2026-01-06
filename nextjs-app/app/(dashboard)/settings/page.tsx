'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUserProfile, updateUserProfile, type UserProfileData } from '@/services/user-profile.service';
import type { Gender, ProfileVisibility } from '@/types/enums';
import {
  User as UserIcon,
  Phone,
  Shield,
  Bell,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import NotificationSettingsCard from '@/components/settings/NotificationSettingsCard';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState<UserProfileData>({});

  const loadProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const userData = await getCurrentUserProfile();
    if (userData) {
      setFormData({
        full_name: userData.full_name || '',
        nickname: userData.nickname || '',
        phone: userData.phone || '',
        date_of_birth: userData.date_of_birth || '',
        gender: userData.gender || undefined,
        bio: userData.bio || '',
        occupation: userData.occupation || '',
        education: userData.education || '',
        location: userData.location || '',
        phone_secondary: userData.phone_secondary || '',
        zalo: userData.zalo || '',
        facebook: userData.facebook || '',
        instagram: userData.instagram || '',
        linkedin: userData.linkedin || '',
        emergency_contact_name: userData.emergency_contact_name || '',
        emergency_contact_phone: userData.emergency_contact_phone || '',
        emergency_contact_relationship: userData.emergency_contact_relationship || '',
        profile_visibility: userData.profile_visibility || 'private',
        consent_data_sharing: userData.consent_data_sharing || false,
        consent_mentor_access: userData.consent_mentor_access || false,
      });
    }

    setLoading(false);
  }, [router, supabase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProfile]);

  const handleInputChange = (field: keyof UserProfileData, value: string | boolean | Gender | ProfileVisibility) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    const result = await updateUserProfile(formData);

    if (result.success) {
      setSuccess('Đã lưu thông tin thành công!');
      // Reload profile
      await loadProfile();
    } else {
      setError(result.error || 'Không thể lưu thông tin. Vui lòng thử lại.');
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 relative">
          <Link href="/profile" className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại hồ sơ
          </Link>
          <div className="blob-purple absolute -top-10 -left-10" />
          <h1 className="text-3xl font-heading font-bold">
            Cài đặt <span className="gradient-text">hồ sơ</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Quản lý thông tin cá nhân và quyền riêng tư</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 glass-card">
            <TabsTrigger value="personal" className="dark:data-[state=active]:bg-gray-700">
              <UserIcon className="w-4 h-4 mr-2" />
              Cá nhân
            </TabsTrigger>
            <TabsTrigger value="contact" className="dark:data-[state=active]:bg-gray-700">
              <Phone className="w-4 h-4 mr-2" />
              Liên lạc
            </TabsTrigger>
            <TabsTrigger value="privacy" className="dark:data-[state=active]:bg-gray-700">
              <Shield className="w-4 h-4 mr-2" />
              Riêng tư
            </TabsTrigger>
            <TabsTrigger value="notifications" className="dark:data-[state=active]:bg-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Thông báo
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card className="glass-card shape-organic-1">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Thông tin cá nhân</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Cập nhật thông tin cơ bản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="dark:text-gray-200">Họ và tên</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name || ''}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nickname" className="dark:text-gray-200">Biệt danh</Label>
                    <Input
                      id="nickname"
                      value={formData.nickname || ''}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date_of_birth" className="dark:text-gray-200">Ngày sinh</Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth || ''}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label className="dark:text-gray-200">Giới tính</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        { value: 'male', label: 'Nam' },
                        { value: 'female', label: 'Nữ' },
                        { value: 'other', label: 'Khác' },
                        { value: 'prefer_not_to_say', label: 'Không nói' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleInputChange('gender', option.value as Gender)}
                          className={`px-3 py-2 rounded-lg border text-sm transition-all ${formData.gender === option.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:text-gray-300'
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="occupation" className="dark:text-gray-200">Nghề nghiệp</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation || ''}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="education" className="dark:text-gray-200">Học vấn</Label>
                    <Input
                      id="education"
                      value={formData.education || ''}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="dark:text-gray-200">Địa điểm</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Thành phố, Quốc gia"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="bio" className="dark:text-gray-200">Giới thiệu bản thân</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Viết vài dòng về bản thân..."
                    rows={3}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <div className="space-y-6">
              <Card className="glass-card shape-organic-2">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Thông tin liên lạc</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Số điện thoại và mạng xã hội
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="dark:text-gray-200">Số điện thoại chính</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone_secondary" className="dark:text-gray-200">Số điện thoại phụ</Label>
                      <Input
                        id="phone_secondary"
                        type="tel"
                        value={formData.phone_secondary || ''}
                        onChange={(e) => handleInputChange('phone_secondary', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zalo" className="dark:text-gray-200">Zalo</Label>
                      <Input
                        id="zalo"
                        value={formData.zalo || ''}
                        onChange={(e) => handleInputChange('zalo', e.target.value)}
                        placeholder="Số điện thoại Zalo"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook" className="dark:text-gray-200">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.facebook || ''}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                        placeholder="Link Facebook hoặc username"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram" className="dark:text-gray-200">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.instagram || ''}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                        placeholder="@username"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin" className="dark:text-gray-200">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin || ''}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="Link LinkedIn"
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card shape-organic-1">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Liên hệ khẩn cấp</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Người liên hệ trong trường hợp khẩn cấp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="emergency_contact_name" className="dark:text-gray-200">Tên người liên hệ</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name || ''}
                      onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                      className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergency_contact_phone" className="dark:text-gray-200">Số điện thoại</Label>
                      <Input
                        id="emergency_contact_phone"
                        type="tel"
                        value={formData.emergency_contact_phone || ''}
                        onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_relationship" className="dark:text-gray-200">Mối quan hệ</Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={formData.emergency_contact_relationship || ''}
                        onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                        placeholder="Cha/Mẹ, Anh/Chị, Bạn..."
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="glass-card shape-organic-3">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Cài đặt quyền riêng tư</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Kiểm soát ai có thể xem thông tin của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="dark:text-gray-200 mb-3 block">Mức độ hiển thị hồ sơ</Label>
                  <div className="space-y-2">
                    {[
                      { value: 'private', label: 'Riêng tư', desc: 'Chỉ bạn có thể xem' },
                      { value: 'mentors_only', label: 'Chỉ Mentor', desc: 'Mentor của bạn có thể xem' },
                      { value: 'public', label: 'Công khai', desc: 'Mọi người có thể xem' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${formData.profile_visibility === option.value
                          ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                          }`}
                      >
                        <input
                          type="radio"
                          name="visibility"
                          value={option.value}
                          checked={formData.profile_visibility === option.value}
                          onChange={() => handleInputChange('profile_visibility', option.value as ProfileVisibility)}
                          className="w-4 h-4 text-purple-600"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{option.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t dark:border-gray-700">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Quyền truy cập dữ liệu</h3>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consent_data_sharing || false}
                      onChange={(e) => handleInputChange('consent_data_sharing', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Cho phép phân tích dữ liệu ẩn danh
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dữ liệu được sử dụng để cải thiện dịch vụ (không nhận dạng cá nhân)
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consent_mentor_access || false}
                      onChange={(e) => handleInputChange('consent_mentor_access', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Cho phép mentor xem kết quả test
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mentor của bạn có thể xem kết quả test để hỗ trợ tư vấn
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <NotificationSettingsCard />
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
