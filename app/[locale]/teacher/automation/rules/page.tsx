'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Plus, Trash2, Settings, AlertCircle, ArrowLeft, CheckCircle2, Zap, Bell, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';

interface AutomationRule {
  id: string;
  name: string;
  triggerType: string;
  condition: string;
  actionType: string;
  isActive: boolean;
  _count?: { logs: number };
  createdAt?: string;
}

const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'تنبيه الغياب المتكرر لولي الأمر',
    triggerType: 'ABSENCE_LIMIT',
    condition: 'غياب 3 أيام أو أكثر خلال الشهر',
    actionType: 'NOTIFY_PARENT',
    isActive: true,
    _count: { logs: 14 },
    createdAt: '2026-09-01',
  },
  {
    id: 'rule-2',
    name: 'إنذار أكاديمي عند تدني الدرجات',
    triggerType: 'LOW_GRADE',
    condition: 'الحصول على درجة أقل من 60% في أي تقييم',
    actionType: 'SEND_WARNING',
    isActive: true,
    _count: { logs: 6 },
    createdAt: '2026-09-05',
  },
  {
    id: 'rule-3',
    name: 'تعويض الواجبات غير المسلمة',
    triggerType: 'HOMEWORK_MISSED',
    condition: 'تجاوز موعد التسليم بيومين دون عذر',
    actionType: 'ASSIGN_EXTRA_WORK',
    isActive: false,
    _count: { logs: 2 },
    createdAt: '2026-09-12',
  },
  {
    id: 'rule-4',
    name: 'إحالة للمرشد الطلابي عند السلوك السلبي',
    triggerType: 'LOW_PARTICIPATION',
    condition: 'تسجيل ملاحظتين سلوكيتين متتاليتين',
    actionType: 'ALERT_COUNSELOR',
    isActive: true,
    _count: { logs: 5 },
    createdAt: '2026-09-18',
  },
];

const LOCAL_STORAGE_KEY = 'nexus_automation_rules';

export default function RulesEnginePage() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newTriggerType, setNewTriggerType] = useState('ABSENCE_LIMIT');
  const [newCondition, setNewCondition] = useState('');
  const [newActionType, setNewActionType] = useState('NOTIFY_PARENT');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRules();
  }, []);

  const saveToLocal = (newRules: AutomationRule[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newRules));
    } catch {}
  };

  const fetchRules = async () => {
    setLoading(true);

    // First try localStorage
    let localSaved: AutomationRule[] | null = null;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) localSaved = JSON.parse(raw);
    } catch {}

    if (localSaved && localSaved.length > 0) {
      setRules(localSaved);
      setLoading(false);
      return;
    }

    // Attempt API fetch
    try {
      const res = await apiClient.get('/teacher/automation/rules');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setRules(res.data.data);
        saveToLocal(res.data.data);
        setLoading(false);
        return;
      }
    } catch (e) {
      // Fallback quietly to preset initial rules
    }

    setRules(INITIAL_RULES);
    saveToLocal(INITIAL_RULES);
    setLoading(false);
  };

  const toggleRule = async (id: string) => {
    const updated = rules.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r));
    setRules(updated);
    saveToLocal(updated);

    // Try API
    try {
      await apiClient.put(`/teacher/automation/rules/${id}/toggle`);
    } catch {}

    const target = updated.find((r) => r.id === id);
    showToast(target?.isActive ? 'تم تفعيل القاعدة بنجاح' : 'تم إيقاف القاعدة مؤقتاً');
  };

  const deleteRule = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه القاعدة المؤتمتة؟')) return;
    const updated = rules.filter((r) => r.id !== id);
    setRules(updated);
    saveToLocal(updated);

    try {
      await apiClient.delete(`/teacher/automation/rules/${id}`);
    } catch {}

    showToast('تم حذف القاعدة بنجاح');
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const conditionText = newCondition.trim() || getDefaultCondition(newTriggerType);

    const newRule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName.trim(),
      triggerType: newTriggerType,
      condition: conditionText,
      actionType: newActionType,
      isActive: true,
      _count: { logs: 0 },
      createdAt: new Date().toISOString().slice(0, 10),
    };

    const updated = [newRule, ...rules];
    setRules(updated);
    saveToLocal(updated);

    try {
      await apiClient.post('/teacher/automation/rules', newRule);
    } catch {}

    setIsModalOpen(false);
    setNewRuleName('');
    setNewCondition('');
    showToast('تم إنشاء وتفعيل القاعدة الذكية بنجاح!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getDefaultCondition = (type: string) => {
    switch (type) {
      case 'ABSENCE_LIMIT':
        return 'عند غياب الطالب 3 أيام فأكثر';
      case 'LOW_GRADE':
        return 'عند الحصول على درجة أقل من 60%';
      case 'HOMEWORK_MISSED':
        return 'عند عدم تسليم الواجب في وقته المحدد';
      case 'LOW_PARTICIPATION':
        return 'عند تسجيل ملاحظة سلوكية أو قلة تفاعل';
      default:
        return 'تحقق الشرط المحدد';
    }
  };

  const translateTrigger = (type: string) => {
    const types: Record<string, string> = {
      ABSENCE_LIMIT: 'تجاوز حد الغياب',
      LOW_GRADE: 'تدني الدرجات الأكاديمية',
      HOMEWORK_MISSED: 'عدم تسليم الواجب',
      LOW_PARTICIPATION: 'سلوك أو تفاعل سلبي',
    };
    return types[type] || type;
  };

  const translateAction = (type: string) => {
    const types: Record<string, string> = {
      NOTIFY_PARENT: 'إشعار فوري لولي الأمر عبر المنصة',
      SEND_WARNING: 'توجيه إنذار رسمي للطالب',
      ASSIGN_EXTRA_WORK: 'تعيين واجب علاجي إضافي',
      ALERT_COUNSELOR: 'إرسال تقرير للمرشد الطلابي',
    };
    return types[type] || type;
  };

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto pb-20">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-foreground text-background px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold text-sm border border-border"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/automation">
            <Button variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-muted">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">محرك القواعد الذكية (IF-THEN)</h1>
            </div>
            <p className="text-muted-foreground text-sm mt-1 mr-14">
              أتمتة المهام الشرطية والمتابعة الذكية لتوفير الوقت وسرعة التواصل.
            </p>
          </div>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg h-10 px-5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4 ml-2" />
          قاعدة جديدة
        </Button>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : rules.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed rounded-xl bg-card">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">لا توجد قواعد بعد</h3>
          <p className="text-muted-foreground mb-4">قم بإنشاء أول قاعدة أتمتة لتبسيط مهامك اليومية.</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة قاعدة الآن
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {rules.map((rule) => (
            <Card
              key={rule.id}
              className={`border border-border shadow-sm transition-all duration-200 ${
                !rule.isActive ? 'opacity-60 bg-muted/20' : 'bg-card hover:border-primary/30'
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      rule.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">{rule.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={rule.isActive ? 'default' : 'secondary'} className="text-[10px] py-0">
                        {rule.isActive ? 'قيد العمل نشط' : 'معطل مؤقتاً'}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">تم تنفيذها {rule._count?.logs || 0} مرات</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleRule(rule.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      rule.isActive
                        ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-200'
                        : 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 hover:bg-green-200'
                    }`}
                    title={rule.isActive ? 'إيقاف القاعدة مؤقتاً' : 'تشغيل القاعدة'}
                  >
                    {rule.isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteRule(rule.id)}
                    className="p-2 bg-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 rounded-lg text-muted-foreground transition-colors"
                    title="حذف القاعدة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <div className="flex flex-col md:flex-row items-stretch gap-4 bg-muted/40 p-4 rounded-xl text-sm border border-border/50">
                  <div className="flex-1 md:border-l md:border-border md:pl-4">
                    <span className="text-primary font-bold ml-1">إذا حدث (الشرط):</span>
                    <span className="font-semibold text-foreground">{translateTrigger(rule.triggerType)}</span>
                    <p className="text-xs text-muted-foreground mt-1">المعيار: {rule.condition}</p>
                  </div>
                  <div className="flex-1">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">فإن الإجراء (الأثر):</span>
                    <span className="font-semibold text-foreground">{translateAction(rule.actionType)}</span>
                    <p className="text-xs text-muted-foreground mt-1">يتم التنفيذ فور استيفاء الشرط تلقائياً</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Rule Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground">إنشاء قاعدة أتمتة جديدة</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRule} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">اسم القاعدة</label>
                  <Input
                    required
                    placeholder="مثال: إشعار ولي الأمر عند الغياب المتكرر"
                    value={newRuleName}
                    onChange={(e) => setNewRuleName(e.target.value)}
                    className="h-10"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">الحدث المسبب (إذا حدث)</label>
                  <Select value={newTriggerType} onValueChange={setNewTriggerType}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ABSENCE_LIMIT">تجاوز حد الغياب</SelectItem>
                      <SelectItem value="LOW_GRADE">تدني الدرجات الأكاديمية</SelectItem>
                      <SelectItem value="HOMEWORK_MISSED">عدم تسليم الواجب</SelectItem>
                      <SelectItem value="LOW_PARTICIPATION">سلوك سلبي أو ضعف مشاركة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">الشرط أو المعيار المحدد</label>
                  <Input
                    placeholder="مثال: غياب 3 أيام أو درجة أقل من 60%"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">الإجراء المؤتمت (فإن)</label>
                  <Select value={newActionType} onValueChange={setNewActionType}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOTIFY_PARENT">إشعار فوري لولي الأمر عبر المنصة والواتساب</SelectItem>
                      <SelectItem value="SEND_WARNING">توجيه إنذار أكاديمي للطالب</SelectItem>
                      <SelectItem value="ASSIGN_EXTRA_WORK">تعيين واجب علاجي إضافي</SelectItem>
                      <SelectItem value="ALERT_COUNSELOR">إرسال تقرير عاجل للمرشد الطلابي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                    إلغاء
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground font-semibold">
                    حفظ وتفعيل القاعدة
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
