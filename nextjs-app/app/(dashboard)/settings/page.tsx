'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getCurrentUserProfile, updateUserProfile, type UserProfileData } from '@/services/user-profile.service';
import type { User } from '@/types/database';
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

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);

  // Form data
  const [formData, setFormData] = useState<UserProfileData>({});

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    const userData = await getCurrentUserProfile();
    if (userData) {
      setProfile(userData);
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
  }

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
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-12 px-4 relative overflow-hidden">
      <div className="blob-purple -top-10 -left-10" />
      <div className="blob-blue top-20 right-10" />
      <div className="blob-pink bottom-10 left-20" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 relative">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 text-sm text-slate-700 dark:text-slate-200">
            <Link href="/profile" className="flex items-center gap-1 hover:text-purple-600 dark:hover:text-purple-300 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Quay lại hồ sơ
            </Link>
          </div>
          <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">
            Cài đặt <span className="gradient-text">hồ sơ</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            Quản lý thông tin cá nhân, quyền riêng tư và kết nối thông báo của bạn.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 glass-card rounded-2xl text-red-700 dark:text-red-200 text-sm flex items-center gap-2 border border-red-200/60 dark:border-red-800/60">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 glass-card rounded-2xl text-green-700 dark:text-green-200 text-sm flex items-center gap-2 border border-green-200/60 dark:border-green-800/60">
            <CheckCircle className="w-4 h-4" />
            {success}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 glass-card p-1 gap-2 rounded-2xl">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <UserIcon className="w-4 h-4 mr-2" />
              Cá nhân
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <Phone className="w-4 h-4 mr-2" />
              Liên lạc
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <Shield className="w-4 h-4 mr-2" />
              Riêng tư
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/70 dark:data-[state=active]:bg-slate-800 rounded-xl">
              <Bell className="w-4 h-4 mr-2" />
              Thông báo
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card className="glass-card shape-organic-3 border border-white/60 dark:border-white/10">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Thông tin cá nhân</CardTitle>
                <CardDescription className="dark:text-gray-300 text-slate-600">
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
                      className="mt-1 glass-card border border-white/50 dark:border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nickname" className="dark:text-gray-200">Biệt danh</Label>
                    <Input
                      id="nickname"
                      value={formData.nickname || ''}
                      onChange={(e) => handleInputChange('nickname', e.target.value)}
                      className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                      className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                          className={`px-3 py-2 rounded-lg border text-sm transition-all glass-card ${
                            formData.gender === option.value
                              ? 'border-purple-500/60 bg-purple-50/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-200'
                              : 'border-white/40 dark:text-gray-200 hover:border-purple-300/60'
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
                      className="mt-1 glass-card border border-white/50 dark:border-white/10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="education" className="dark:text-gray-200">Học vấn</Label>
                    <Input
                      id="education"
                      value={formData.education || ''}
                      onChange={(e) => handleInputChange('education', e.target.value)}
                      className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                    className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                    className="mt-1 glass-card border border-white/50 dark:border-white/10"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <div className="space-y-6">
              <Card className="glass-card shape-organic-1 border border-white/60 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Thông tin liên lạc</CardTitle>
                  <CardDescription className="dark:text-gray-300 text-slate-600">
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
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone_secondary" className="dark:text-gray-200">Số điện thoại phụ</Label>
                      <Input
                        id="phone_secondary"
                        type="tel"
                        value={formData.phone_secondary || ''}
                        onChange={(e) => handleInputChange('phone_secondary', e.target.value)}
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="facebook" className="dark:text-gray-200">Facebook</Label>
                      <Input
                        id="facebook"
                        value={formData.facebook || ''}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                        placeholder="Link Facebook hoặc username"
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin" className="dark:text-gray-200">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin || ''}
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="Link LinkedIn"
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card shape-organic-2 border border-white/60 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Liên hệ khẩn cấp</CardTitle>
                  <CardDescription className="dark:text-gray-300 text-slate-600">
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
                      className="mt-1 glass-card border border-white/50 dark:border-white/10"
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
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergency_contact_relationship" className="dark:text-gray-200">Mối quan hệ</Label>
                      <Input
                        id="emergency_contact_relationship"
                        value={formData.emergency_contact_relationship || ''}
                        onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                        placeholder="Cha/Mẹ, Anh/Chị, Bạn..."
                        className="mt-1 glass-card border border-white/50 dark:border-white/10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy">
            <Card className="glass-card shape-organic-3 border border-white/60 dark:border-white/10">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Cài đặt quyền riêng tư</CardTitle>
                <CardDescription className="dark:text-gray-300 text-slate-600">
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
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors glass-card ${
                          formData.profile_visibility === option.value
                            ? 'border-purple-500/60 bg-purple-50/80 dark:bg-purple-900/30'
                            : 'border-white/40 dark:hover:border-purple-400/60'
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
                          <p className="text-sm text-gray-600 dark:text-gray-300">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t dark:border-white/10 border-white/40">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Quyền truy cập dữ liệu</h3>

                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer glass-card hover:border-purple-300/60 dark:hover:border-purple-400/50 transition-colors">
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
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Dữ liệu được sử dụng để cải thiện dịch vụ (không nhận dạng cá nhân)
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer glass-card hover:border-purple-300/60 dark:hover:border-purple-400/50 transition-colors">
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
                      <p className="text-sm text-gray-600 dark:text-gray-300">
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
            <Card className="glass-card shape-organic-4 border border-white/60 dark:border-white/10">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Cài đặt thông báo</CardTitle>
                <CardDescription className="dark:text-gray-300 text-slate-600">
                  Chọn cách bạn muốn nhận thông báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 glass-card rounded-xl border border-blue-200/60 dark:border-blue-800/40">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    Tính năng thông báo sẽ sớm được cập nhật!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="btn-liquid"
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
