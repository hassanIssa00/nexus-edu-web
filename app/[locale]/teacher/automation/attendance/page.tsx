'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, CheckCircle2, XCircle, Clock, ArrowLeft, Users, Save, Calendar, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { nexusBridge, SchoolClass, ClassStudentRecord, DailyAttendanceRecord } from '@/lib/nexusDataBridge';

interface StudentAttendanceItem {
  id: string;
  name: string;
  photoUrl?: string;
  grade?: string;
  status: 'present' | 'absent' | 'late' | 'pending';
}

export default function AttendanceAutomation() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<StudentAttendanceItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Load Classes
  useEffect(() => {
    const clsList = nexusBridge.getClasses();
    setClasses(clsList);
    if (clsList.length > 0 && !selectedClass) {
      setSelectedClass(clsList[0].id);
    }
  }, []);

  // Load Students for Selected Class & Date
  useEffect(() => {
    if (!selectedClass) return;

    const classStudents = nexusBridge.getStudents(selectedClass);
    const existingAttendance = nexusBridge.getTodayAttendance(selectedDate);
    const attendanceMap = new Map(existingAttendance.map((a) => [a.studentId, a.overallStatus]));

    const mapped: StudentAttendanceItem[] = classStudents.map((s) => {
      const existingStatus = attendanceMap.get(s.id);
      return {
        id: s.id,
        name: s.fullName,
        photoUrl: s.photoUrl,
        grade: s.grade,
        status: (existingStatus as 'present' | 'absent' | 'late') || 'pending',
      };
    });

    setStudents(mapped);
    setIsSaved(false);
  }, [selectedClass, selectedDate]);

  // Statistics
  const total = students.length;
  const present = students.filter((s) => s.status === 'present').length;
  const absent = students.filter((s) => s.status === 'absent').length;
  const late = students.filter((s) => s.status === 'late').length;
  const isTouched = students.some((s) => s.status !== 'pending');

  const markAllPresent = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: 'present' })));
  };

  const setStatus = (id: string, status: 'present' | 'absent' | 'late') => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleSave = () => {
    setIsSaving(true);

    try {
      // Persist each student's attendance in nexusBridge
      students.forEach((student) => {
        if (student.status !== 'pending') {
          nexusBridge.markStudentAttendance(student.id, 1, student.status, 'manual_teacher');
        }
      });

      // Dispatch cross-portal event to update live stats and dashboards
      window.dispatchEvent(new CustomEvent('nexus:data-changed'));

      setTimeout(() => {
        setIsSaving(false);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3500);
      }, 700);
    } catch (e) {
      console.error('Failed to save attendance:', e);
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/teacher/automation">
          <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
              <ClipboardCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">تحضير الطلاب بضغطة زر</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 mr-14">
            حضّر الفصل كاملاً كحاضرين بنقرة واحدة، ثم استثنِ الغائبين فقط مع حفظ فوري في سجل المدرسة.
          </p>
        </div>
      </div>

      {/* Selection Controls */}
      <Card className="border-border shadow-sm bg-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">الفصل الدراسي</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-10 rounded-md mt-1 border-border focus:ring-violet-500">
                  <SelectValue placeholder="اختر الفصل..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex justify-between items-center w-full">
                        <span className="font-semibold">{c.name}</span>
                        <span className="text-xs text-muted-foreground mr-3">({c.enrolledCount} طالب)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">تاريخ التحضير</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 px-3 rounded-md border border-border bg-background text-sm font-medium w-full focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats & Master Action */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-none shadow-md bg-gradient-to-br from-violet-600 to-purple-700 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <CardContent className="p-8 flex flex-col items-center justify-center h-full relative z-10 text-center">
                <Users className="w-10 h-10 text-white/70 mb-3" />
                <h2 className="text-xl font-bold mb-2">تسجيل الحضور للفصل كاملاً</h2>
                <p className="text-violet-100 text-sm mb-6 max-w-sm">
                  وفّر وقتك وسجل جميع طلاب الفصل ({total} طالب) كحاضرين بضغطة زر، ثم عدل الغائبين بنقرة واحدة.
                </p>
                <Button
                  onClick={markAllPresent}
                  className="bg-white text-violet-700 hover:bg-violet-50 font-bold text-base h-12 px-8 rounded-lg shadow-md hover:scale-105 transition-transform"
                >
                  <Sparkles className="w-5 h-5 ml-2 text-amber-500" />
                  الكل حاضر (بضغطة زر واحدة)
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-rows-3 gap-3">
              <Card className="border-border shadow-sm bg-green-50 dark:bg-green-950/20 border-r-4 border-r-green-500">
                <CardContent className="p-4 flex items-center justify-between h-full">
                  <div>
                    <p className="text-green-700 dark:text-green-400 font-semibold text-sm">حاضر</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{present}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-green-500 opacity-60" />
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm bg-red-50 dark:bg-red-950/20 border-r-4 border-r-red-500">
                <CardContent className="p-4 flex items-center justify-between h-full">
                  <div>
                    <p className="text-red-700 dark:text-red-400 font-semibold text-sm">غائب</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-300">{absent}</p>
                  </div>
                  <XCircle className="w-6 h-6 text-red-500 opacity-60" />
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm bg-yellow-50 dark:bg-yellow-950/20 border-r-4 border-r-yellow-500">
                <CardContent className="p-4 flex items-center justify-between h-full">
                  <div>
                    <p className="text-yellow-700 dark:text-yellow-400 font-semibold text-sm">متأخر</p>
                    <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{late}</p>
                  </div>
                  <Clock className="w-6 h-6 text-yellow-500 opacity-60" />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Students List */}
          <Card className="border-border shadow-sm bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">قائمة طلاب الفصل المعتمدين</h3>
              </div>
              <span className="text-xs text-muted-foreground font-medium">{students.length} طالب مسجل</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 p-5">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-colors ${
                    student.status === 'present'
                      ? 'bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
                      : student.status === 'absent'
                      ? 'bg-red-50/50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                      : student.status === 'late'
                      ? 'bg-yellow-50/50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800'
                      : 'bg-card border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-muted-foreground text-xs font-semibold w-5 shrink-0">{index + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-foreground text-xs shadow-sm overflow-hidden shrink-0 border border-border">
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
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-foreground truncate">{student.name}</h4>
                      {student.status === 'pending' ? (
                        <p className="text-[11px] text-muted-foreground">لم يتم التحضير بعد</p>
                      ) : (
                        <p className="text-[11px] font-medium text-muted-foreground">
                          {student.status === 'present' && <span className="text-green-600 font-bold">حاضر ✓</span>}
                          {student.status === 'absent' && <span className="text-red-600 font-bold">غائب (إشعار الولي) ✕</span>}
                          {student.status === 'late' && <span className="text-yellow-600 font-bold">متأخر ⏱</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex bg-background rounded-lg p-1 shadow-sm border border-border shrink-0 gap-1">
                    <button
                      onClick={() => setStatus(student.id, 'present')}
                      className={`p-1.5 rounded-md transition-colors ${
                        student.status === 'present'
                          ? 'bg-green-500 text-white'
                          : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                      }`}
                      title="حاضر"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStatus(student.id, 'late')}
                      className={`p-1.5 rounded-md transition-colors ${
                        student.status === 'late'
                          ? 'bg-yellow-500 text-white'
                          : 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                      }`}
                      title="متأخر"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setStatus(student.id, 'absent')}
                      className={`p-1.5 rounded-md transition-colors ${
                        student.status === 'absent'
                          ? 'bg-red-500 text-white'
                          : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                      }`}
                      title="غائب"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Floating Save Action */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <AnimatePresence>
              {isTouched && !isSaved && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="bg-foreground text-background p-3 pl-4 pr-5 rounded-full shadow-2xl flex items-center gap-5 border border-border backdrop-blur-md"
                >
                  <div className="font-semibold text-sm">
                    تم تحضير {total - students.filter((s) => s.status === 'pending').length} من أصل {total} طلاب
                  </div>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || students.some((s) => s.status === 'pending')}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-full h-9 px-6 min-w-[130px] disabled:opacity-50 transition-transform active:scale-95"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-1.5" />
                        اعتماد الحضور
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
                  className="bg-green-600 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-semibold border-2 border-green-500"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  تم اعتماد وحفظ الحضور رسمياً في السجل!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}
