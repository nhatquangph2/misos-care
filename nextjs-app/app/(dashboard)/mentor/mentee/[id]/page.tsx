'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getMenteeProfile,
  getMenteeTestResults,
  getMenteePersonalityProfile,
  getMenteeNotes,
  createMentorNote,
  type CreateNoteData,
} from '@/services/mentor.service';
import { getCurrentUserProfile } from '@/services/user-profile.service';
import type { User, MentalHealthRecord, PersonalityProfile, MentorNote } from '@/types/database';
import type { MentorNoteType } from '@/types/enums';
import {
  ArrowLeft,
  User as UserIcon,
  Brain,
  Heart,
  FileText,
  Plus,
  AlertTriangle,
  Clock,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function MenteeDetailPage({ params }: PageProps) {
  const { id: menteeId } = use(params);
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [menteeProfile, setMenteeProfile] = useState<Partial<User> | null>(null);
  const [testResults, setTestResults] = useState<MentalHealthRecord[]>([]);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | null>(null);
  const [notes, setNotes] = useState<MentorNote[]>([]);

  // New note form
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    noteType: 'general' as MentorNoteType,
    requiresFollowUp: false,
    followUpDate: '',
  });
  const [savingNote, setSavingNote] = useState(false);

  const loadData = useCallback(async () => {
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

    // Load mentee data
    const [profile, tests, personality, mentorNotes] = await Promise.all([
      getMenteeProfile(menteeId),
      getMenteeTestResults(menteeId),
      getMenteePersonalityProfile(menteeId),
      getMenteeNotes(menteeId),
    ]);

    if (!profile) {
      router.push('/mentor');
      return;
    }

    setMenteeProfile(profile);
    setTestResults(tests);
    setPersonalityProfile(personality);
    setNotes(mentorNotes);
    setLoading(false);
  }, [menteeId, router, supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveNote = async () => {
    if (!newNote.content.trim()) return;

    setSavingNote(true);

    // Find relationship ID (we need to get this from the relationship)
    const { data: relationshipData } = await supabase
      .from('mentor_relationships')
      .select('id')
      .eq('user_id', menteeId)
      .eq('status', 'active')
      .single();

    const relationshipId = (relationshipData as { id: string } | null)?.id;
    if (!relationshipId) {
      setSavingNote(false);
      return;
    }

    const noteData: CreateNoteData = {
      relationshipId: relationshipId,
      menteeId: menteeId,
      title: newNote.title || undefined,
      content: newNote.content,
      noteType: newNote.noteType,
      requiresFollowUp: newNote.requiresFollowUp,
      followUpDate: newNote.followUpDate || undefined,
    };

    const result = await createMentorNote(noteData);

    if (result.success) {
      // Reload notes
      const updatedNotes = await getMenteeNotes(menteeId);
      setNotes(updatedNotes);
      setNewNote({
        title: '',
        content: '',
        noteType: 'general',
        requiresFollowUp: false,
        followUpDate: '',
      });
      setShowNoteForm(false);
    }

    setSavingNote(false);
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'normal': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50';
      case 'mild': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
      case 'moderate': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50';
      case 'severe': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
      case 'extremely_severe': return 'text-red-700 dark:text-red-300 bg-red-200 dark:bg-red-900/70';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/50';
    }
  };

  const getSeverityLabel = (level: string) => {
    switch (level) {
      case 'normal': return 'Bình thường';
      case 'mild': return 'Nhẹ';
      case 'moderate': return 'Trung bình';
      case 'severe': return 'Nặng';
      case 'extremely_severe': return 'Rất nặng';
      default: return level;
    }
  };

  const getTestTypeLabel = (type: string) => {
    switch (type) {
      case 'PHQ9': return 'Trầm cảm (PHQ-9)';
      case 'GAD7': return 'Lo âu (GAD-7)';
      case 'DASS21': return 'DASS-21';
      case 'PSS': return 'Stress (PSS)';
      default: return type;
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/mentor" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
              {(menteeProfile?.full_name || menteeProfile?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {menteeProfile?.full_name || menteeProfile?.name || 'Mentee'}
              </h1>
              {menteeProfile?.email && (
                <p className="text-gray-600 dark:text-gray-400">{menteeProfile.email}</p>
              )}
              {menteeProfile?.occupation && (
                <p className="text-sm text-gray-500 dark:text-gray-500">{menteeProfile.occupation}</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="dark:bg-gray-800">
            <TabsTrigger value="tests" className="dark:data-[state=active]:bg-gray-700">
              <Heart className="w-4 h-4 mr-2" />
              Kết quả Test
            </TabsTrigger>
            <TabsTrigger value="personality" className="dark:data-[state=active]:bg-gray-700">
              <Brain className="w-4 h-4 mr-2" />
              Tính cách
            </TabsTrigger>
            <TabsTrigger value="notes" className="dark:data-[state=active]:bg-gray-700">
              <FileText className="w-4 h-4 mr-2" />
              Ghi chú ({notes.length})
            </TabsTrigger>
            <TabsTrigger value="profile" className="dark:data-[state=active]:bg-gray-700">
              <UserIcon className="w-4 h-4 mr-2" />
              Thông tin
            </TabsTrigger>
          </TabsList>

          {/* Test Results Tab */}
          <TabsContent value="tests">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Lịch sử kết quả Test</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  Các bài test sức khỏe tinh thần đã làm
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Chưa có kết quả test nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {getTestTypeLabel(result.test_type)}
                              </h3>
                              {result.crisis_flag && (
                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 text-xs rounded-full flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3" />
                                  Khẩn cấp
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {new Date(result.completed_at).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                              {result.total_score}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(result.severity_level)}`}>
                              {getSeverityLabel(result.severity_level)}
                            </span>
                          </div>
                        </div>

                        {result.subscale_scores && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Chi tiết:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {Object.entries(result.subscale_scores as Record<string, number>).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="text-gray-600 dark:text-gray-400 capitalize">{key}:</span>{' '}
                                  <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personality Tab */}
          <TabsContent value="personality">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MBTI */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">MBTI</CardTitle>
                </CardHeader>
                <CardContent>
                  {personalityProfile?.mbti_type ? (
                    <div className="text-center">
                      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {personalityProfile.mbti_type}
                      </p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">Chưa có dữ liệu</p>
                  )}
                </CardContent>
              </Card>

              {/* Big Five */}
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-gray-100">Big Five</CardTitle>
                </CardHeader>
                <CardContent>
                  {personalityProfile?.big5_openness !== null ? (
                    <div className="space-y-3">
                      {[
                        { label: 'Cởi mở', value: personalityProfile?.big5_openness },
                        { label: 'Tận tâm', value: personalityProfile?.big5_conscientiousness },
                        { label: 'Hướng ngoại', value: personalityProfile?.big5_extraversion },
                        { label: 'Dễ chịu', value: personalityProfile?.big5_agreeableness },
                        { label: 'Nhạy cảm', value: personalityProfile?.big5_neuroticism },
                      ].map((trait) => (
                        <div key={trait.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">{trait.label}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {trait.value?.toFixed(1) || 0}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div
                              className="h-full bg-purple-600 rounded-full"
                              style={{ width: `${((trait.value || 0) / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">Chưa có dữ liệu</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-gray-100">Ghi chú của Mentor</CardTitle>
                  <CardDescription className="dark:text-gray-400">
                    Ghi chú và theo dõi tiến trình
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm ghi chú
                </Button>
              </CardHeader>
              <CardContent>
                {/* New Note Form */}
                {showNoteForm && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                    <div>
                      <Label className="dark:text-gray-200">Tiêu đề (tùy chọn)</Label>
                      <Input
                        value={newNote.title}
                        onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        placeholder="Tiêu đề ghi chú..."
                      />
                    </div>

                    <div>
                      <Label className="dark:text-gray-200">Nội dung</Label>
                      <Textarea
                        value={newNote.content}
                        onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                        className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        placeholder="Viết ghi chú..."
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="dark:text-gray-200">Loại ghi chú</Label>
                        <select
                          value={newNote.noteType}
                          onChange={(e) => setNewNote({ ...newNote, noteType: e.target.value as MentorNoteType })}
                          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                          <option value="general">Chung</option>
                          <option value="session">Phiên tư vấn</option>
                          <option value="observation">Quan sát</option>
                          <option value="recommendation">Đề xuất</option>
                          <option value="follow_up">Follow-up</option>
                        </select>
                      </div>

                      <div>
                        <Label className="dark:text-gray-200">Ngày follow-up</Label>
                        <Input
                          type="date"
                          value={newNote.followUpDate}
                          onChange={(e) => setNewNote({ ...newNote, followUpDate: e.target.value, requiresFollowUp: !!e.target.value })}
                          className="mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowNoteForm(false)}
                        className="dark:border-gray-600 dark:text-gray-300"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSaveNote}
                        disabled={savingNote || !newNote.content.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {savingNote ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Đang lưu...
                          </>
                        ) : (
                          'Lưu ghi chú'
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Notes List */}
                {notes.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Chưa có ghi chú nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {note.title && (
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {note.title}
                              </h4>
                            )}
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              {note.note_type}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {new Date(note.created_at).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {note.content}
                        </p>
                        {note.requires_follow_up && note.follow_up_date && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className={note.follow_up_completed ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}>
                              Follow-up: {new Date(note.follow_up_date).toLocaleDateString('vi-VN')}
                              {note.follow_up_completed && ' (Đã hoàn thành)'}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="dark:text-gray-100">Thông tin Mentee</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {menteeProfile?.full_name && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Họ tên</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{menteeProfile.full_name}</p>
                    </div>
                  )}
                  {menteeProfile?.nickname && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Biệt danh</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{menteeProfile.nickname}</p>
                    </div>
                  )}
                  {menteeProfile?.email && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{menteeProfile.email}</p>
                    </div>
                  )}
                  {menteeProfile?.phone && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Điện thoại</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{menteeProfile.phone}</p>
                    </div>
                  )}
                  {menteeProfile?.occupation && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nghề nghiệp</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{menteeProfile.occupation}</p>
                    </div>
                  )}
                  {menteeProfile?.bio && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Giới thiệu</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{menteeProfile.bio}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
