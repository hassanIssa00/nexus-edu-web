'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CheckCircle, Save, ArrowLeft, Search, Filter, AlertCircle, Sparkles, BookOpen, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { nexusBridge, SchoolClass, ClassStudentRecord, HomeworkAssignment } from '@/lib/nexusDataBridge';

interface StudentGradeRow {
  id: string;
  name: string;
  photoUrl?: string;
  universalId?: string;
  grade: string;
  participation: string;
  behavior: string;
  feedback: string;
  status: 'pending' | 'graded';
}

export default function BulkGradingAutomation() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [assignments, setAssignments] = useState<Array<{ id: string; name: string; maxScore: number }>>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [students, setStudents] = useState<StudentGradeRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultGrade, setDefaultGrade] = useState('10');
  const [defaultParticipation, setDefaultParticipation] = useState('ممتاز');
  const [defaultBehavior, setDefaultBehavior] = useState('ممتاز');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load Classes and Assignments
  useEffect(() => {
    const cls = nexusBridge.getClasses();
    setClasses(cls);
    if (cls.length > 0) {
      setSelectedClass(cls[0].id);
    }

    const hw = nexusBridge.getHomework();
    const quizzes = nexusBridge.getQuizzes();
    const combined = [
      ...hw.map((h) => ({ id: `hw_${h.id}`, name: `واجب: ${h.title}`, maxScore: h.totalScore || 10 })),
      ...quizzes.map((q) => ({ id: `quiz_${q.id}`, name: `اختبار: ${q.title}`, maxScore: q.totalPoints || 20 })),
      { id: 'eval_monthly', name: 'التقويم الشهري والمشاركة الصفية', maxScore: 10 },
      { id: 'eval_project', name: 'المشروع الفصلي والمهام الأدائية', maxScore: 10 },
    ];
    setAssignments(combined);
    if (combined.length > 0) {
      setSelectedAssignment(combined[0].id);
    }
  }, []);

  // Load Students for Selected Class
  useEffect(() => {
    if (!selectedClass) return;
    const realStudents = nexusBridge.getStudents(selectedClass);

    // Check if there are previously saved bulk grades in localStorage for this assignment and class
    const savedKey = `nexus_grades_${selectedClass}_${selectedAssignment}`;
    let savedGradesMap: Record<string, Partial<StudentGradeRow>> = {};
    try {
      const raw = localStorage.getItem(savedKey);
      if (raw) savedGradesMap = JSON.parse(raw);
    } catch {}

    const rows: StudentGradeRow[] = realStudents.map((s) => {
      const prev = savedGradesMap[s.id];
      return {
        id: s.id,
        name: s.fullName,
        photoUrl: s.photoUrl,
        universalId: s.universalId || s.id,
        grade: prev?.grade || '',
        participation: prev?.participation || '',
        behavior: prev?.behavior || '',
        feedback: prev?.feedback || '',
        status: prev?.grade ? 'graded' : 'pending',
      };
    });

    setStudents(rows);
    setIsSaved(false);
  }, [selectedClass, selectedAssignment]);

  // Bulk action handler
  const applyBulkGrades = () => {
    setStudents((prev) =>
      prev.map((s) => ({
        ...s,
        grade: s.grade || defaultGrade,
        participation: s.participation || defaultParticipation,
        behavior: s.behavior || defaultBehavior,
        status: 'graded',
      }))
    );
  };

  const updateStudent = (id: string, field: keyof StudentGradeRow, value: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              [field]: value,
              status: 'graded',
            }
          : s
      )
    );
  };

  // Filtered students by search
  const filteredStudents = useMemo(() => {
    if (!searchQuery.trim()) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.universalId?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const handleSave = () => {
    setIsSaving(true);

    try {
      // 1. Save assignment grades map to localStorage
      const savedKey = `nexus_grades_${selectedClass}_${selectedAssignment}`;
      const payload: Record<string, StudentGradeRow> = {};
      students.forEach((s) => {
        payload[s.id] = s;
      });
      localStorage.setItem(savedKey, JSON.stringify(payload));

      // 2. Also update student evaluations & average in nexusBridge
      students.forEach((s) => {
        if (s.grade) {
          const numGrade = parseFloat(s.grade);
          const studentObj = nexusBridge.getStudentById(s.id);
          if (studentObj && !isNaN(numGrade)) {
            // Update student records slightly if valid
            studentObj.averageGrade = Math.min(100, Math.max(60, Math.round((studentObj.averageGrade * 4 + numGrade * 10) / 5)));
            nexusBridge.saveStudent(studentObj);
          }
        }
      });

      // 3. Dispatch data update
      window.dispatchEvent(new CustomEvent('nexus:data-changed'));

      setTimeout(() => {
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }, 700);
    } catch (e) {
      console.error('Failed to save bulk grades:', e);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/teacher/automation">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">الرصد الجماعي السريع</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 mr-14">
            أتمتة رصد الدرجات والمهارات للفصل كاملاً بضغطة زر واحدة وتحديث السجلات الأكاديمية فوراً.
          </p>
        </div>
      </div>

      {/* Selection Controls */}
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">الفصل الدراسي</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-emerald-500">
                  <SelectValue placeholder="اختر الفصل..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.enrolledCount} طالب)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">الواجب أو التقييم</label>
              <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-emerald-500">
                  <SelectValue placeholder="اختر التقييم..." />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} (من {a.maxScore})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Automation Toolbar */}
          <div className="bg-emerald-50 dark:bg-emerald-950/20 p-5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">
                  الدرجة الافتراضية:
                </span>
                <Input
                  type="number"
                  className="w-20 font-bold bg-background text-center"
                  value={defaultGrade}
                  onChange={(e) => setDefaultGrade(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">المشاركة:</span>
                <Select value={defaultParticipation} onValueChange={setDefaultParticipation}>
                  <SelectTrigger className="w-28 bg-background font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ممتاز">ممتاز</SelectItem>
                    <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                    <SelectItem value="جيد">جيد</SelectItem>
                    <SelectItem value="مقبول">مقبول</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-900 dark:text-emerald-400 whitespace-nowrap">السلوك:</span>
                <Select value={defaultBehavior} onValueChange={setDefaultBehavior}>
                  <SelectTrigger className="w-28 bg-background font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ممتاز">ممتاز</SelectItem>
                    <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                    <SelectItem value="جيد">جيد</SelectItem>
                    <SelectItem value="يحتاج توجيه">يحتاج توجيه</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={applyBulkGrades}
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md h-10 px-6 rounded-md shrink-0 transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 ml-2 text-amber-300" />
              رصد للكل بضغطة زر
            </Button>
          </div>

          {/* Search bar & count */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="ابحث عن اسم طالب أو رقمه..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-9 h-10 rounded-lg text-sm bg-card border-border"
              />
            </div>
            <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>
                {filteredStudents.length} طالب (تم رصد {students.filter((s) => s.status === 'graded').length} من {students.length})
              </span>
            </div>
          </div>

          {/* Students List */}
          <Card className="border-border shadow-sm overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-muted-foreground w-12 text-center">#</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">اسم الطالب</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground w-32">الدرجة</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground w-36">المشاركة</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground w-36">السلوك</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground">ملاحظة للمعلم</th>
                    <th className="p-4 text-sm font-semibold text-muted-foreground w-28">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4 text-muted-foreground text-center text-sm">{index + 1}</td>
                      <td className="p-4 font-semibold text-foreground">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden border border-emerald-200 dark:border-emerald-800">
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt={student.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              student.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <span className="text-sm block">{student.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{student.universalId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Input
                          type="number"
                          value={student.grade}
                          onChange={(e) => updateStudent(student.id, 'grade', e.target.value)}
                          placeholder="0"
                          className={`w-full font-bold text-center h-9 ${
                            student.grade
                              ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
                              : ''
                          }`}
                        />
                      </td>
                      <td className="p-4">
                        <Select
                          value={student.participation}
                          onValueChange={(v) => updateStudent(student.id, 'participation', v)}
                        >
                          <SelectTrigger
                            className={`h-9 ${
                              student.participation
                                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 font-semibold'
                                : ''
                            }`}
                          >
                            <SelectValue placeholder="اختر..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ممتاز">ممتاز</SelectItem>
                            <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                            <SelectItem value="جيد">جيد</SelectItem>
                            <SelectItem value="مقبول">مقبول</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Select
                          value={student.behavior}
                          onValueChange={(v) => updateStudent(student.id, 'behavior', v)}
                        >
                          <SelectTrigger
                            className={`h-9 ${
                              student.behavior
                                ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 font-semibold'
                                : ''
                            }`}
                          >
                            <SelectValue placeholder="اختر..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ممتاز">ممتاز</SelectItem>
                            <SelectItem value="جيد جداً">جيد جداً</SelectItem>
                            <SelectItem value="جيد">جيد</SelectItem>
                            <SelectItem value="يحتاج توجيه">يحتاج توجيه</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-4">
                        <Input
                          value={student.feedback}
                          onChange={(e) => updateStudent(student.id, 'feedback', e.target.value)}
                          placeholder="ملاحظة تقديرية..."
                          className="h-9 text-xs"
                        />
                      </td>
                      <td className="p-4">
                        {student.status === 'pending' ? (
                          <Badge variant="secondary" className="text-muted-foreground border-border font-medium">
                            قيد الانتظار
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 border-none font-medium">
                            تم الرصد ✓
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Floating Save Action */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <AnimatePresence>
              {students.some((s) => s.status === 'graded') && !isSaved && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="bg-foreground text-background p-3 pl-4 pr-5 rounded-full shadow-2xl flex items-center gap-5 border border-border backdrop-blur-md"
                >
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-emerald-400" />
                    جاهز للحفظ ({students.filter((s) => s.status === 'graded').length} طلاب تم رصدهم)
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full h-9 px-6 min-w-[130px] shadow-md transition-transform active:scale-95"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-1.5" />
                        حفظ في النظام
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              {isSaved && (
                <motion.div
                  initial={{ y: 100, scale: 0.9, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 100, scale: 0.9, opacity: 0 }}
                  className="bg-emerald-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-semibold border-2 border-emerald-500"
                >
                  <CheckCircle className="w-5 h-5" />
                  تم رصد وحفظ درجات الفصل بنجاح في السجل المركزي!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
