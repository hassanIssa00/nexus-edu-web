'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, AlertCircle, XCircle, Send, Loader2 } from 'lucide-react';

type RubricLevel = 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'UNSATISFACTORY';

interface QuickGradeProps {
  submissionId: string;
  studentName: string;
  maxScore: number;
  onGraded?: (score: number, feedback: string) => void;
}

const levelConfig: Record<RubricLevel, {
  label: string;
  labelAr: string;
  icon: typeof Star;
  color: string;
  bgColor: string;
  multiplier: number;
}> = {
  'EXCELLENT': {
    label: 'Excellent',
    labelAr: 'ممتاز',
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300',
    multiplier: 0.95,
  },
  'GOOD': {
    label: 'Good',
    labelAr: 'جيد',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100 hover:bg-green-200 border-green-300',
    multiplier: 0.80,
  },
  'NEEDS_IMPROVEMENT': {
    label: 'Needs Improvement',
    labelAr: 'يحتاج تحسين',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 hover:bg-orange-200 border-orange-300',
    multiplier: 0.60,
  },
  'UNSATISFACTORY': {
    label: 'Unsatisfactory',
    labelAr: 'غير مرضٍ',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-100 hover:bg-red-200 border-red-300',
    multiplier: 0.40,
  },
};

const feedbackTemplates: Record<RubricLevel, string[]> = {
  'EXCELLENT': [
    'عمل ممتاز! استمر على هذا المستوى المتميز. 🌟',
    'أداء رائع! أنت من أفضل الطلاب في هذه المهمة.',
    'تميز واضح في الإجابات. أحسنت!',
  ],
  'GOOD': [
    'عمل جيد جداً! مع القليل من الجهد ستصل للتميز.',
    'أداء جيد! هناك مجال للتحسين في بعض النقاط.',
    'إجابات جيدة بشكل عام. استمر في التطوير.',
  ],
  'NEEDS_IMPROVEMENT': [
    'تحتاج لمراجعة بعض النقاط. لا تتردد في طلب المساعدة.',
    'هناك بعض الأخطاء التي يمكن تجنبها. راجع الدرس مرة أخرى.',
    'المستوى مقبول لكن يحتاج تحسين. تواصل معي للمساعدة.',
  ],
  'UNSATISFACTORY': [
    'يبدو أنك تحتاج لمراجعة شاملة للمادة. تواصل معي.',
    'هناك صعوبات واضحة. ننصح بحضور دروس إضافية.',
    'المستوى أقل من المطلوب. نحتاج للعمل معاً على تحسينه.',
  ],
};

export function QuickGradeCard({ submissionId, studentName, maxScore, onGraded }: QuickGradeProps) {
  const [selectedLevel, setSelectedLevel] = useState<RubricLevel | null>(null);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleLevelSelect = (level: RubricLevel) => {
    setSelectedLevel(level);
    // Auto-fill feedback template
    const templates = feedbackTemplates[level];
    setFeedback(templates[Math.floor(Math.random() * templates.length)] || '');
  };

  const calculatedScore = selectedLevel 
    ? Math.round(maxScore * levelConfig[selectedLevel].multiplier) 
    : 0;

  const handleSubmit = async () => {
    if (!selectedLevel) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/assignments/submissions/${submissionId}/grade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: calculatedScore,
          feedback,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        onGraded?.(calculatedScore, feedback);
      }
    } catch {
      console.error('Failed to submit grade');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <p className="text-lg font-medium text-green-700">تم حفظ الدرجة بنجاح!</p>
          <p className="text-sm text-gray-600 mt-1">
            {studentName}: {calculatedScore}/{maxScore}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">تقييم سريع</CardTitle>
        <CardDescription>{studentName}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Level Selection */}
        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(levelConfig) as RubricLevel[]).map((level) => {
            const config = levelConfig[level];
            const Icon = config.icon;
            const isSelected = selectedLevel === level;
            
            return (
              <button
                key={level}
                onClick={() => handleLevelSelect(level)}
                className={`p-4 rounded-lg border-2 transition-all ${config.bgColor} ${
                  isSelected ? 'ring-2 ring-offset-2 ring-blue-500 scale-105' : ''
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${config.color}`} />
                <p className={`font-bold ${config.color}`}>{config.labelAr}</p>
                <p className="text-xs text-gray-600">
                  {Math.round(maxScore * config.multiplier)}/{maxScore}
                </p>
              </button>
            );
          })}
        </div>

        {/* Score Preview */}
        {selectedLevel && (
          <div className="text-center py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600">الدرجة المقترحة</p>
            <p className="text-3xl font-bold text-blue-600">
              {calculatedScore}<span className="text-lg text-gray-500">/{maxScore}</span>
            </p>
          </div>
        )}

        {/* Feedback */}
        <div>
          <label className="block text-sm font-medium mb-2">ملاحظات للطالب</label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="أضف ملاحظاتك هنا..."
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedLevel || loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 ml-2" />
              حفظ التقييم
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
