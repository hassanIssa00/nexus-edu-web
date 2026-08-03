'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, Clock, Upload, Filter, Search } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { Link } from '@/i18n/routing'
import { SkeletonList } from '@/components/ui/skeleton-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'

interface Assignment {
  id: string
  title: string
  description?: string
  dueDate?: string
  subject: { name: string }
  status: 'pending' | 'submitted' | 'graded'
  grade?: number | null
}

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filtering state
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        const response = await apiClient.get<any>('/assignments/student')
        setAssignments(response.data?.data ?? response.data ?? [])
      } catch (err) {
        console.error(err)
        setError('تعذر تحميل الواجبات الحالية.')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const getStatusInfo = (status: Assignment['status']) => {
    if (status === 'graded') {
      return { 
        icon: <CheckCircle className="h-4 w-4" />, 
        label: 'تم التقييم',
        color: 'border-green-200 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      }
    }
    if (status === 'submitted') {
      return { 
        icon: <Upload className="h-4 w-4" />, 
        label: 'تم التسليم',
        color: 'border-blue-200 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
      }
    }
    return { 
      icon: <Clock className="h-4 w-4" />, 
      label: 'قيد الانتظار',
      color: 'border-amber-200 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
    }
  }

  const filteredAssignments = assignments.filter((a) => {
    if (filter !== 'all' && a.status !== filter) return false
    if (searchQuery) {
      return (
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        a.subject.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">الواجبات والتكليفات</h1>
          <p className="text-muted-foreground mt-1">تابع واجباتك الحالية، سلم تكليفاتك، واعرض تقييماتك.</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('all')}
              className="rounded-full"
            >
              الكل
            </Button>
            <Button 
              variant={filter === 'pending' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('pending')}
              className="rounded-full whitespace-nowrap"
            >
              قيد الانتظار
            </Button>
            <Button 
              variant={filter === 'submitted' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('submitted')}
              className="rounded-full whitespace-nowrap"
            >
              تم التسليم
            </Button>
            <Button 
              variant={filter === 'graded' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setFilter('graded')}
              className="rounded-full whitespace-nowrap"
            >
              تم التقييم
            </Button>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="ابحث عن واجب أو مادة..." 
              className="pr-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <SkeletonList count={5} />
      ) : filteredAssignments.length === 0 ? (
        <EmptyState 
          type={searchQuery ? 'search' : 'assignments'} 
          className="border border-border rounded-2xl bg-card" 
        />
      ) : (
        <div className="grid gap-4">
          {filteredAssignments.map((assignment) => {
            const statusInfo = getStatusInfo(assignment.status)
            return (
              <Card key={assignment.id} className="hover:border-primary/50 transition-colors shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 text-sm">
                      {assignment.subject.name}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`gap-1 px-2.5 py-0.5 ${statusInfo.color}`}>
                        {statusInfo.icon}
                        {statusInfo.label}
                      </Badge>
                      {assignment.grade != null && (
                        <Badge variant="default" className="bg-primary font-bold">
                          {assignment.grade}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-3">{assignment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {assignment.description || 'لا يوجد وصف للواجب.'}
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      تاريخ التسليم: <span className="font-medium text-foreground">{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('ar-SA') : 'غير محدد'}</span>
                    </div>

                    {assignment.status === 'pending' ? (
                      <Link href={`/student/assignments/submit?id=${assignment.id}`}>
                        <Button className="w-full sm:w-auto shadow-sm">تسليم الواجب</Button>
                      </Link>
                    ) : (
                      <Link href={`/student/assignments/${assignment.id}`}>
                        <Button variant="outline" className="w-full sm:w-auto">عرض التسليم</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
