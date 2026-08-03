# Dashboard Starter Kit Components

A comprehensive, reusable dashboard component library for Saudi EdTech products with **RTL-first** design.

## 📦 Installation

The components are already installed. Just import them:

```tsx
import { 
  ProgressRing, 
  ActivityFeed, 
  Timeline, 
  KPICard,
  ChartPlaceholder,
  AssignmentForm,
  GradeEntryForm,
  AttendanceModal 
} from "@/components/dashboard";

import { DataTable } from "@/components/ui/data-table";
```

## 🎨 Components

### 1. KPICard - لوحة عرض المؤشرات

عرض الإحصائيات الرئيسية مع التغيير النسبي.

**Props:**
- `title`: string - عنوان المؤشر
- `value`: string | number - القيمة
- `change?`: { value: number, trend: "up" | "down" } - التغيير
- `icon?`: LucideIcon - أيقونة
- `className?`: string

**مثال:**

```tsx
import { Users } from "lucide-react";

<KPICard
  title="إجمالي الطلاب"
  value="1,234"
  change={{ value: 12, trend: "up" }}
  icon={Users}
/>
```

### 2. ProgressRing - حلقة التقدم

حلقة SVG دائرية لعرض النسب المئوية.

**Props:**
- `value`: number (0-100) - النسبة المئوية
- `size?`: number (default: 120) - الحجم بالبكسل
- `strokeWidth?`: number (default: 10) - سمك الحلقة
- `color?`: string (default: "text-primary")
- `children?`: React.ReactNode - محتوى داخلي

**مثال:**

```tsx
<ProgressRing value={75} size={150} color="text-teal-500">
  <div className="text-center">
    <div className="text-2xl font-bold">75%</div>
    <div className="text-xs">مكتمل</div>
  </div>
</ProgressRing>
```

### 3. ActivityFeed - سجل الأنشطة

قائمة عمودية للأنشطة الأخيرة مع صور أفاتار.

**Props:**
- `items`: ActivityItem[] - قائمة الأنشطة
- `className?`: string

**ActivityItem Type:**
```tsx
{
  id: string;
  user: { name: string; avatar?: string; initials: string };
  action: string;
  target?: string;
  time: string;
}
```

**مثال:**

```tsx
const activities = [
  {
    id: "1",
    user: { name: "أحمد علي", initials: "أع" },
    action: "قام بتسليم",
    target: "واجب الرياضيات",
    time: "منذ 5 دقائق"
  }
];

<ActivityFeed items={activities} />
```

### 4. Timeline - الخط الزمني

عرض زمني للأحداث مع حالات (مكتمل/حالي/قادم).

**Props:**
- `items`: TimelineItem[]
- `className?`: string

**TimelineItem Type:**
```tsx
{
  id: string;
  title: string;
  description?: string;
  date: string;
  status: "completed" | "current" | "upcoming";
}
```

**مثال:**

```tsx
const timeline = [
  {
    id: "1",
    title: "اختبار الفصل الأول",
    description: "رياضيات وعلوم",
    date: "15 يناير",
    status: "completed"
  }
];

<Timeline items={timeline} />
```

### 5. ChartPlaceholder - مكان الرسم البياني

بديل مؤقت للرسوم البيانية (جاهز لـ recharts).

**Props:**
- `type?`: "bar" | "line" | "pie" (default: "bar")
- `title?`: string
- `height?`: number | string (default: 300)
- `className?`: string

**مثال:**

```tsx
<ChartPlaceholder 
  type="line" 
  title="تقدم الطلاب الشهري" 
  height={350}
/>
```

### 6. DataTable - جدول البيانات

جدول متقدم مع Sorting و Pagination و Selection.

**Props:**
- `columns`: ColumnDef<TData, TValue>[]
- `data`: TData[]

**مثال:**

```tsx
import { ColumnDef } from "@tanstack/react-table";

type Student = {
  id: string;
  name: string;
  grade: number;
};

const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
  },
  {
    accessorKey: "grade",
    header: "الدرجة",
  },
];

const data: Student[] = [
  { id: "1", name: "أحمد", grade: 95 },
  { id: "2", name: "فاطمة", grade: 88 },
];

<DataTable columns={columns} data={data} />
```

### 7. AssignmentForm - نموذج الواجب

نموذج لإنشاء واجبات جديدة.

**Props:**
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `onSubmit`: (data: AssignmentFormData) => void

**AssignmentFormData:**
```tsx
{ title: string; description: string; dueDate: string; totalPoints: number }
```

**مثال:**

```tsx
const [isOpen, setIsOpen] = useState(false);

<AssignmentForm
  open={isOpen}
  onOpenChange={setIsOpen}
  onSubmit={(data) => console.log("Created:", data)}
/>
```

### 8. GradeEntryForm - نموذج إدخال الدرجات

نموذج لتقييم واجبات الطلاب.

**Props:**
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `studentName`: string
- `assignmentTitle`: string
- `maxPoints`: number
- `onSubmit`: (grade: number, feedback: string) => void

**مثال:**

```tsx
<GradeEntryForm
  open={isOpen}
  onOpenChange={setIsOpen}
  studentName="أحمد علي"
  assignmentTitle="واجب الرياضيات"
  maxPoints={100}
  onSubmit={(grade, feedback) => console.log(grade, feedback)}
/>
```

### 9. AttendanceModal - نموذج الحضور

نموذج لتسجيل حضور الطلاب.

**Props:**
- `open`: boolean
- `onOpenChange`: (open: boolean) => void
- `students`: Student[]
- `date`: string
- `onSubmit`: (attendance: Record<string, "present" | "absent" | "late">) => void

**Student Type:**
```tsx
{ id: string; name: string; status?: "present" | "absent" | "late" }
```

**مثال:**

```tsx
const students = [
  { id: "1", name: "أحمد علي" },
  { id: "2", name: "فاطمة محمد" },
];

<AttendanceModal
  open={isOpen}
  onOpenChange={setIsOpen}
  students={students}
  date="2025-01-15"
  onSubmit={(attendance) => console.log(attendance)}
/>
```

## 🎯 Usage Example: Student Dashboard

```tsx
"use client"

import { 
  KPICard, 
  ProgressRing, 
  ActivityFeed, 
  Timeline 
} from "@/components/dashboard";
import { BookOpen, Award, Clock } from "lucide-react";

export default function StudentDashboard() {
  const stats = [
    { title: "الواجبات المكتملة", value: "12/15", icon: BookOpen },
    { title: "المعدل التراكمي", value: "3.8", icon: Award },
    { title: "ساعات الدراسة", value: "24", icon: Clock },
  ];

  const activities = [
    {
      id: "1",
      user: { name: "أستاذ محمد", initials: "أم" },
      action: "قام بإضافة",
      target: "واجب الرياضيات الفصل 3",
      time: "منذ ساعتين"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <KPICard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">التقدم الدراسي</h3>
          <div className="flex justify-center">
            <ProgressRing value={80} />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">آخر الأنشطة</h3>
          <ActivityFeed items={activities} />
        </div>
      </div>
    </div>
  );
}
```

## 🌐 RTL Support

All components are RTL-ready:
- Text alignment handled automatically via `dir` attribute
- Flex directions adjust for Arabic
- Icon positions are mirrored correctly
- Tailwind's `rtl:` prefix works seamlessly

## ♿ Accessibility

- Keyboard navigation support
- ARIA labels on interactive elements
- Focus states visible
- Screen reader compatible

## 📝 Notes

- All forms use controlled components
- Toast notifications integrated (use `useToast` hook)
- Charts are placeholders - integrate with Recharts or Chart.js
- Avatar component requires `@radix-ui/react-avatar` ✅ installed

## 🚀 Next Steps

1. Integrate real backend APIs
2. Add Recharts to ChartPlaceholder
3. Implement dark mode toggle
4. Add more specialized widgets (attendance tracker, grade analyzer)
