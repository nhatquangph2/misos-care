'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getMentees,
  getFollowUpNotes,
  respondToMentorRequest,
  getCurrentMentorProfile,
  type MenteeInfo,
} from '@/services/mentor.service';
import { getCurrentUserProfile } from '@/services/user-profile.service';
import type { MentorProfile, MentorNote } from '@/types/database';
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Bell,
  Settings,
  UserPlus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

export default function MentorDashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [mentees, setMentees] = useState<MenteeInfo[]>([]);
  const [followUpNotes, setFollowUpNotes] = useState<MentorNote[]>([]);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Check if user is a mentor
    const userProfile = await getCurrentUserProfile();
    if (!userProfile || (userProfile.role !== 'mentor' && userProfile.role !== 'admin')) {
      router.push('/dashboard');
      return;
    }

    // Load mentor data
    const [profile, menteeList, followUps] = await Promise.all([
      getCurrentMentorProfile(),
      getMentees(),
      getFollowUpNotes(),
    ]);

    setMentorProfile(profile);
    setMentees(menteeList);
    setFollowUpNotes(followUps);
    setLoading(false);
  }

  const handleRespondToRequest = async (relationshipId: string, accept: boolean) => {
    setProcessingRequest(relationshipId);

    const result = await respondToMentorRequest(relationshipId, accept);

    if (result.success) {
      // Reload mentees
      const updatedMentees = await getMentees();
      setMentees(updatedMentees);
    }

    setProcessingRequest(null);
  };

  const pendingRequests = mentees.filter(m => m.status === 'pending');
  const activeMentees = mentees.filter(m => m.status === 'active');

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Mentor Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Quản lý mentee và theo dõi tiến trình
            </p>
          </div>
          <Link href="/mentor/settings">
            <Button variant="outline" className="dark:border-gray-600 dark:text-gray-300">
              <Settings className="w-4 h-4 mr-2" />
              Cài đặt Mentor
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {activeMentees.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mentee hiện tại</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {pendingRequests.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yêu cầu chờ</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {followUpNotes.length}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Follow-up</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {mentorProfile?.rating?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Đánh giá</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-yellow-800 dark:text-yellow-200">
              Bạn có <strong>{pendingRequests.length}</strong> yêu cầu mentoring mới đang chờ phản hồi
            </p>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="mentees" className="space-y-6">
          <TabsList className="dark:bg-gray-800">
            <TabsTrigger value="mentees" className="dark:data-[state=active]:bg-gray-700">
              <Users className="w-4 h-4 mr-2" />
              Mentee ({activeMentees.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="dark:data-[state=active]:bg-gray-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Yêu cầu ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="followups" className="dark:data-[state=active]:bg-gray-700">
              <Bell className="w-4 h-4 mr-2" />
              Follow-up ({followUpNotes.length})
            </TabsTrigger>
          </TabsList>

          {/* Mentees Tab */}
          <TabsContent value="mentees">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Danh sách Mentee</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Những người bạn đang hỗ trợ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeMentees.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Chưa có mentee nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeMentees.map((mentee) => (
                      <div
                        key={mentee.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {mentee.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {mentee.user_name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {mentee.user_email}
                            </p>
                            {mentee.started_at && (
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Bắt đầu: {new Date(mentee.started_at).toLocaleDateString('vi-VN')}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/mentor/mentee/${mentee.user_id}`}>
                            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
                              <Eye className="w-4 h-4 mr-1" />
                              Xem
                            </Button>
                          </Link>
                          <Link href={`/mentor/mentee/${mentee.user_id}/notes`}>
                            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
                              <FileText className="w-4 h-4 mr-1" />
                              Ghi chú
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Yêu cầu Mentoring</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Phản hồi các yêu cầu từ người dùng
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Không có yêu cầu nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                              {request.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {request.user_name}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.user_email}
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">
                            Đang chờ
                          </span>
                        </div>

                        <div className="mt-4 flex gap-2">
                          <Button
                            onClick={() => handleRespondToRequest(request.id, true)}
                            disabled={processingRequest === request.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            {processingRequest === request.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-2" />
                            )}
                            Chấp nhận
                          </Button>
                          <Button
                            onClick={() => handleRespondToRequest(request.id, false)}
                            disabled={processingRequest === request.id}
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            size="sm"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Follow-ups Tab */}
          <TabsContent value="followups">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Ghi chú cần Follow-up</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Các ghi chú cần được theo dõi
                </CardDescription>
              </CardHeader>
              <CardContent>
                {followUpNotes.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Không có follow-up nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followUpNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {note.title || 'Ghi chú'}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {note.content}
                            </p>
                          </div>
                          {note.follow_up_date && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              new Date(note.follow_up_date) < new Date()
                                ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                                : 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                            }`}>
                              {new Date(note.follow_up_date).toLocaleDateString('vi-VN')}
                            </span>
                          )}
                        </div>
                        <div className="mt-3">
                          <Link href={`/mentor/mentee/${note.user_id}`}>
                            <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300">
                              <Eye className="w-4 h-4 mr-1" />
                              Xem Mentee
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
