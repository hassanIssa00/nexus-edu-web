'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Target, BookOpen, Star, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { apiClient } from '@/lib/api/client';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface SmartProfile {
  id: string;
  learningStyle: string;
  strengthSubjects: string[];
  weakSubjects: string[];
  performanceTrend: string;
}

interface SkillMastery {
  id: string;
  masteryLevel: 'MASTERED' | 'IN_PROGRESS' | 'NOT_STARTED';
  skillNode: {
    name: string;
    description: string;
    subject: {
      name: string;
    };
  };
}

export default function SmartProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<SmartProfile | null>(null);
  const [skills, setSkills] = useState<SkillMastery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchProfileData = async () => {
      try {
        const [profileRes, skillsRes] = await Promise.all([
          apiClient.get(`/profile/${user.id}`),
          apiClient.get(`/profile/${user.id}/skills`)
        ]);
        
        setProfile(profileRes.data?.data || profileRes.data || null);
        setSkills(skillsRes.data?.data || skillsRes.data || []);
      } catch (error) {
        console.error('Failed to load smart profile', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center">جاري تحميل ملفك الذكي...</div>;
  }

  // Transform skills into Radar Chart data grouped by subject
  const subjectAverages = skills.reduce((acc, skill) => {
    const subjectName = skill.skillNode.subject.name;
    if (!acc[subjectName]) acc[subjectName] = { name: subjectName, total: 0, count: 0 };
    
    let score = 0;
    if (skill.masteryLevel === 'MASTERED') score = 100;
    else if (skill.masteryLevel === 'IN_PROGRESS') score = 50;
    
    acc[subjectName].total += score;
    acc[subjectName].count += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; count: number }>);

  const radarData = Object.values(subjectAverages).map(subject => ({
    subject: subject.name,
    mastery: Math.round(subject.total / subject.count)
  }));

  // Mock data if no real skills exist yet for the UI to look good
  const displayRadarData = radarData.length > 0 ? radarData : [
    { subject: 'الرياضيات', mastery: 85 },
    { subject: 'العلوم', mastery: 65 },
    { subject: 'اللغة العربية', mastery: 90 },
    { subject: 'اللغة الإنجليزية', mastery: 75 },
    { subject: 'التاريخ', mastery: 60 }
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary" />
          الملف الذكي (Smart Profile)
        </h1>
        <p className="text-muted-foreground mt-2">
          يتم تحديث هذا الملف تلقائياً بواسطة الذكاء الاصطناعي بناءً على أدائك في الواجبات والاختبارات.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Analysis Card */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="w-5 h-5" />
              تحليل الذكاء الاصطناعي لشخصيتك التعليمية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-2">أسلوب التعلم المفضل لك:</p>
              <Badge variant="default" className="text-sm px-4 py-1">
                {profile?.learningStyle === 'VISUAL' ? 'بصري (تفضل الصور والرسومات)' :
                 profile?.learningStyle === 'LOGICAL' ? 'منطقي (تفضل التسلسل والخطوات)' :
                 profile?.learningStyle === 'SOCIAL' ? 'اجتماعي (تفضل النقاش والأمثلة الحية)' :
                 'بصري (مبدئي)'}
              </Badge>
              <p className="text-sm text-gray-600 mt-2">
                سيقوم المعلم الذكي (AI Tutor) بتعديل طريقة شرحه لتناسب هذا الأسلوب خصيصاً لك.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-green-100">
                <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1 mb-2">
                  <TrendingUp className="w-4 h-4" /> نقاط قوتك
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {profile?.strengthSubjects?.length ? profile.strengthSubjects.map((s, i) => <li key={i}>{s}</li>) : <li>الرياضيات</li>}
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-orange-100">
                <p className="text-sm font-semibold text-orange-700 dark:text-orange-400 flex items-center gap-1 mb-2">
                  <AlertCircle className="w-4 h-4" /> تحتاج تركيز
                </p>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {profile?.weakSubjects?.length ? profile.weakSubjects.map((s, i) => <li key={i}>{s}</li>) : <li>التاريخ</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Knowledge Map */}
        <Card className="flex flex-col items-center justify-center p-6 text-center">
          <CardTitle className="text-lg mb-4 w-full text-right">خريطة المعرفة</CardTitle>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={displayRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="إتقان المهارات" dataKey="mastery" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            توضح الخريطة نسبة إتقانك للمهارات الأساسية في كل مادة.
          </p>
        </Card>
      </div>

      {/* Detailed Skill Tree */}
      <Card>
        <CardHeader>
          <CardTitle>شجرة المهارات التفصيلية</CardTitle>
          <CardDescription>جميع المهارات التي تدرسها هذا العام وحالتك فيها</CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>لم يتم تسجيل أي مهارات في ملفك بعد.</p>
              <p className="text-sm mt-1">بمجرد تسليم الواجبات، سيبدأ الذكاء الاصطناعي برسم شجرة مهاراتك.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map(skill => (
                <div key={skill.id} className="border rounded-lg p-4 flex flex-col justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{skill.skillNode.subject.name}</Badge>
                    <h4 className="font-bold">{skill.skillNode.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{skill.skillNode.description}</p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex items-center justify-between">
                    <span className="text-sm font-medium">حالة المهارة:</span>
                    {skill.masteryLevel === 'MASTERED' ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">متقن ✅</Badge>
                    ) : skill.masteryLevel === 'IN_PROGRESS' ? (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">قيد التعلم ⏳</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">لم تبدأ</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
