import { apiClient } from './client'

export interface StudentDashboardResponse {
  student: {
    id: string
    name: string
    schoolId?: string | null
  }
  summary: {
    totalSubjects: number
    pendingAssignments: number
    completedAssignments: number
    attendanceRate: number
    averageGrade: number
  }
  upcomingAssignments: Array<{
    id: string
    title: string
    description?: string | null
    dueDate?: string | null
    subject: { id: string; name: string }
    status: 'pending' | 'submitted' | 'graded'
    grade?: number | null
  }>
  attendance: {
    present: number
    absent: number
    late: number
    excused: number
  }
  weeklyActivity: Array<{
    label: string
    submissions: number
    attended: number
  }>
  subjectPerformance: Array<{
    id: string
    name: string
    teacher: string
    averageGrade: number
    progress: number
    totalLessons: number
    totalAssignments: number
    submittedAssignments: number
  }>
  gamification: {
    level: number
    totalXP: number
    streakDays: number
    achievementsUnlocked: number
  }
}

export interface TeacherDashboardResponse {
  teacher: {
    id: string
    name: string
    schoolId?: string | null
  }
  summary: {
    totalClasses: number
    totalStudents: number
    totalAssignments: number
    totalLessons: number
    pendingSubmissions: number
    attendanceRate: number
  }
  classPerformance: Array<{
    id: string
    name: string
    studentCount: number
    subjectCount: number
    averageGrade: number
  }>
  recentAssignments: Array<{
    id: string
    title: string
    subject: string
    dueDate?: string | null
    submissions: number
  }>
  gradingQueue: Array<{
    id: string
    submittedAt: string
    assignment: {
      id: string
      title: string
      dueDate?: string | null
    }
    student: {
      id: string
      name?: string | null
      email: string
    }
  }>
  attendanceSummary: {
    totalRecords: number
    present: number
    late: number
    absent: number
  }
  interventionAlerts?: Array<{
    id: string
    title: string
    body: string
    data: any
    createdAt: string
  }>
}

export interface AdminDashboardResponse {
  admin: {
    id: string
    name: string
    schoolId?: string | null
  }
  kpis: {
    totalUsers: number
    totalStudents: number
    totalTeachers: number
    totalClasses: number
    totalSubjects: number
    activeUsers: number
    totalRevenue: number
  }
  enrollmentSeries: Array<{ label: string; value: number }>
  revenueSeries: Array<{ label: string; value: number }>
  invoiceSummary: {
    total: number
    paid: number
    pending: number
    requiresAction: number
    failed: number
    refunded: number
  }
  recentActivity: Array<{
    id: string
    action: string
    entityType: string
    entityId?: string | null
    actor: string
    createdAt: string
  }>
  systemHealth: Array<{
    name: string
    status: 'healthy' | 'warning'
    value: number
    detail: string
  }>
}

export const dashboardApi = {
  getStudentDashboard: async (): Promise<StudentDashboardResponse> => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo') === 'true') {
      return {
        student: { id: 'demo-student', name: 'Demo Student', schoolId: 'demo-school' },
        summary: { totalSubjects: 8, pendingAssignments: 3, completedAssignments: 12, attendanceRate: 95, averageGrade: 88 },
        upcomingAssignments: [
          { id: '1', title: 'Math Quiz 1', subject: { id: 's1', name: 'Mathematics' }, status: 'pending', dueDate: new Date(Date.now() + 86400000).toISOString() },
          { id: '2', title: 'Science Project', subject: { id: 's2', name: 'Science' }, status: 'pending', dueDate: new Date(Date.now() + 172800000).toISOString() }
        ],
        attendance: { present: 45, absent: 2, late: 1, excused: 0 },
        weeklyActivity: [
          { label: 'Mon', submissions: 1, attended: 1 },
          { label: 'Tue', submissions: 2, attended: 1 },
          { label: 'Wed', submissions: 0, attended: 1 },
          { label: 'Thu', submissions: 1, attended: 1 },
          { label: 'Fri', submissions: 3, attended: 1 }
        ],
        subjectPerformance: [
          { id: 's1', name: 'Mathematics', teacher: 'Mr. Smith', averageGrade: 92, progress: 80, totalLessons: 20, totalAssignments: 10, submittedAssignments: 8 },
          { id: 's2', name: 'Science', teacher: 'Mrs. Davis', averageGrade: 85, progress: 75, totalLessons: 18, totalAssignments: 8, submittedAssignments: 6 }
        ],
        gamification: { level: 5, totalXP: 2500, streakDays: 7, achievementsUnlocked: 12 }
      }
    }
    const response = await apiClient.get<StudentDashboardResponse>('/dashboard/student')
    return response.data
  },
  getTeacherDashboard: async (): Promise<TeacherDashboardResponse> => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo') === 'true') {
      return {
        teacher: { id: 'demo-teacher', name: 'فاطمة الزهراني', schoolId: 'demo-school' },
        summary: { totalClasses: 4, totalStudents: 120, totalAssignments: 25, totalLessons: 40, pendingSubmissions: 15, attendanceRate: 92 },
        classPerformance: [
          { id: 'c1', name: 'Grade 10 Math', studentCount: 30, subjectCount: 1, averageGrade: 85 },
          { id: 'c2', name: 'Grade 11 Math', studentCount: 28, subjectCount: 1, averageGrade: 82 }
        ],
        recentAssignments: [
          { id: 'a1', title: 'Algebra Worksheet', subject: 'Math', submissions: 25, dueDate: new Date().toISOString() }
        ],
        gradingQueue: [
          { id: 'g1', submittedAt: new Date().toISOString(), assignment: { id: 'a1', title: 'Algebra Worksheet' }, student: { id: 'st1', name: 'Alice', email: 'alice@test.com' } }
        ],
        attendanceSummary: { totalRecords: 200, present: 180, late: 10, absent: 10 }
      }
    }
    const response = await apiClient.get<TeacherDashboardResponse>('/dashboard/teacher')
    return response.data
  },
  getAdminDashboard: async (): Promise<AdminDashboardResponse> => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo') === 'true') {
      return {
        admin: { id: 'demo-admin', name: 'Demo Admin', schoolId: 'demo-school' },
        kpis: { totalUsers: 5000, totalStudents: 4000, totalTeachers: 300, totalClasses: 150, totalSubjects: 25, activeUsers: 4500, totalRevenue: 150000 },
        enrollmentSeries: [{ label: 'Jan', value: 100 }, { label: 'Feb', value: 150 }],
        revenueSeries: [{ label: 'Jan', value: 5000 }, { label: 'Feb', value: 7500 }],
        invoiceSummary: { total: 1000, paid: 800, pending: 150, requiresAction: 30, failed: 10, refunded: 10 },
        recentActivity: [{ id: 'act1', action: 'Created Class', entityType: 'Class', actor: 'Admin', createdAt: new Date().toISOString() }],
        systemHealth: [{ name: 'API Server', status: 'healthy', value: 99.9, detail: 'Uptime 99.9%' }]
      }
    }
    const response = await apiClient.get<AdminDashboardResponse>('/dashboard/admin')
    return response.data
  },
  getParentDashboard: async (): Promise<any> => {
    if (typeof window !== 'undefined' && localStorage.getItem('is_demo') === 'true') {
        return {
            children: [
                {
                    id: '1',
                    name: 'أحمد فيصل الغامدي',
                    grade: 'الصف العاشر',
                    avatar: '/avatars/ahmed.png',
                    gpa: '3.9',
                    attendanceRate: 100,
                    attendance: { present: 45, absent: 0, late: 0, excused: 0 },
                    nextExam: 'الرياضيات - الأحد القادم',
                    recentGrades: [
                        { subject: 'الرياضيات', score: 18, total: 20 },
                        { subject: 'الفيزياء', score: 45, total: 50 },
                        { subject: 'الكيمياء', score: 92, total: 100 },
                        { subject: 'اللغة الإنجليزية', score: 95, total: 100 },
                    ],
                    gradeHistory: [
                      { label: 'سبتمبر', value: 85 },
                      { label: 'أكتوبر', value: 88 },
                      { label: 'نوفمبر', value: 92 },
                      { label: 'ديسمبر', value: 95 },
                      { label: 'يناير', value: 96 }
                    ],
                    upcomingAssignments: [
                      { title: 'واجب الفيزياء الفصل الثالث', subject: { name: 'الفيزياء' }, dueDate: new Date(Date.now() + 86400000).toISOString(), status: 'pending' },
                      { title: 'تمارين الرياضيات', subject: { name: 'الرياضيات' }, dueDate: new Date(Date.now() + 172800000).toISOString(), status: 'pending' }
                    ],
                    gamification: { achievementsUnlocked: 5, level: 4 }
                }
            ]
        }
    }
    const response = await apiClient.get('/dashboard/parent')
    return response.data
  }
}
