'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { completeOnboarding, type OnboardingData } from '@/services/user-profile.service';
import { ArrowRight, ArrowLeft, Check, User, Phone, Briefcase, Shield } from 'lucide-react';
import type { Gender } from '@/types/enums';

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Form data
  const [formData, setFormData] = useState<OnboardingData>({
    full_name: '',
    nickname: '',
    date_of_birth: '',
    gender: undefined,
    phone: '',
    occupation: '',
    consent_data_sharing: false,
    consent_mentor_access: false,
  });

  // Check auth and onboarding status
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Check if already completed onboarding
    const { data: userDataRaw } = await supabase
      .from('users')
      .select('onboarding_completed, name, email')
      .eq('id', user.id)
      .single();

    const userData = userDataRaw as { onboarding_completed: boolean; name: string; email: string } | null;

    if (userData?.onboarding_completed) {
      router.push('/dashboard');
      return;
    }

    // Pre-fill name if available
    if (userData?.name) {
      setFormData(prev => ({ ...prev, full_name: userData.name }));
    }

    setLoading(false);
  }

  const handleInputChange = (field: keyof OnboardingData, value: string | boolean | Gender) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateStep = (step: Step): boolean => {
    switch (step) {
      case 1:
        if (!formData.full_name.trim()) {
          setError('Vui lòng nhập họ tên');
          return false;
        }
        return true;
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional fields
      case 4:
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4) as Step);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1) as Step);
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setSubmitting(true);
    setError(null);

    const result = await completeOnboarding(formData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🐬</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Chào mừng đến Miso's Care!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hãy hoàn thành hồ sơ để có trải nghiệm tốt nhất
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  step < currentStep
                    ? 'bg-green-500 text-white'
                    : step === currentStep
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}
              >
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-1 transition-all ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  <CardTitle className="dark:text-gray-100">Thông tin cơ bản</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">
                  Hãy cho chúng tôi biết về bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="full_name" className="dark:text-gray-200">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="nickname" className="dark:text-gray-200">Biệt danh (tùy chọn)</Label>
                  <Input
                    id="nickname"
                    value={formData.nickname || ''}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    placeholder="Tên mọi người hay gọi bạn"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth" className="dark:text-gray-200">Ngày sinh (tùy chọn)</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label className="dark:text-gray-200">Giới tính (tùy chọn)</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                    {[
                      { value: 'male', label: 'Nam' },
                      { value: 'female', label: 'Nữ' },
                      { value: 'other', label: 'Khác' },
                      { value: 'prefer_not_to_say', label: 'Không muốn nói' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleInputChange('gender', option.value as Gender)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          formData.gender === option.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Contact Info */}
          {currentStep === 2 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  <CardTitle className="dark:text-gray-100">Thông tin liên lạc</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">
                  Thông tin này giúp mentor có thể liên lạc với bạn khi cần
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="phone" className="dark:text-gray-200">Số điện thoại (tùy chọn)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0901234567"
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Lưu ý:</strong> Thông tin liên lạc của bạn sẽ được bảo mật và chỉ được chia sẻ với mentor khi bạn cho phép.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Additional Info */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                  <CardTitle className="dark:text-gray-100">Thông tin bổ sung</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">
                  Giúp chúng tôi hiểu bạn hơn để đưa ra gợi ý phù hợp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="occupation" className="dark:text-gray-200">Nghề nghiệp / Công việc (tùy chọn)</Label>
                  <Input
                    id="occupation"
                    value={formData.occupation || ''}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    placeholder="Sinh viên, Nhân viên văn phòng, ..."
                    className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Privacy & Consent */}
          {currentStep === 4 && (
            <>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <CardTitle className="dark:text-gray-100">Quyền riêng tư</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">
                  Chọn cách bạn muốn chia sẻ dữ liệu
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consent_data_sharing}
                      onChange={(e) => handleInputChange('consent_data_sharing', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Cho phép phân tích dữ liệu ẩn danh
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Dữ liệu của bạn sẽ được sử dụng để cải thiện dịch vụ (không nhận dạng cá nhân)
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.consent_mentor_access}
                      onChange={(e) => handleInputChange('consent_mentor_access', e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        Cho phép mentor xem kết quả test
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mentor của bạn có thể xem kết quả test để hỗ trợ tư vấn tốt hơn
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Bạn có thể thay đổi các cài đặt này bất cứ lúc nào trong phần Cài đặt hồ sơ.
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="p-6 pt-0 flex justify-between">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="dark:border-gray-600 dark:text-gray-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Tiếp theo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Hoàn thành
                    <Check className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>

        {/* Skip option */}
        <p className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
          Bạn có thể bỏ qua và{' '}
          <button
            onClick={handleSubmit}
            className="text-purple-600 hover:underline"
          >
            hoàn thành sau
          </button>
        </p>
      </div>
    </div>
  );
}
