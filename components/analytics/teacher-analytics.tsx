'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, BookOpen, Award } from 'lucide-react';

// Mock data for teacher analytics
const studentPerformanceData = [
    { name: 'Week 1', classAvg: 70, topStudent: 95, lowestStudent: 45 },
    { name: 'Week 2', classAvg: 75, topStudent: 98, lowestStudent: 50 },
    { name: 'Week 3', classAvg: 78, topStudent: 97, lowestStudent: 55 },
    { name: 'Week 4', classAvg: 82, topStudent: 99, lowestStudent: 60 },
    { name: 'Week 5', classAvg: 85, topStudent: 100, lowestStudent: 65 },
    { name: 'Week 6', classAvg: 88, topStudent: 100, lowestStudent: 70 },
];

const subjectDistribution = [
    { subject: 'A+', students: 12, color: '#10b981' },
    { subject: 'A', students: 18, color: '#3b82f6' },
    { subject: 'B+', students: 15, color: '#8b5cf6' },
    { subject: 'B', students: 8, color: '#f59e0b' },
    { subject: 'C', students: 5, color: '#ef4444' },
];

const attendanceData = [
    { name: 'Present', value: 850, color: '#10b981' },
    { name: 'Absent', value: 45, color: '#ef4444' },
    { name: 'Late', value: 30, color: '#f59e0b' },
];

const assignmentCompletion = [
    { assignment: 'HW 1', completion: 95, avgScore: 88 },
    { assignment: 'HW 2', completion: 90, avgScore: 85 },
    { assignment: 'Quiz 1', completion: 100, avgScore: 92 },
    { assignment: 'HW 3', completion: 85, avgScore: 80 },
    { assignment: 'Midterm', completion: 98, avgScore: 87 },
];

export function TeacherAnalyticsDashboard() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive insights into student performance</p>
                </div>
                <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Export Reports
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">58</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">+3 from last month</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Class Average</CardTitle>
                        <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">88%</div>
                        <p className="text-xs text-green-600 mt-1">+5% from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                        <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">92%</div>
                        <p className="text-xs text-green-600 mt-1">+2% from last week</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                        <Award className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">94%</div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Assignments completed</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Tabs */}
            <Tabs defaultValue="performance" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="grades">Grade Distribution</TabsTrigger>
                    <TabsTrigger value="attendance">Attendance</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                </TabsList>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Performance Trends</CardTitle>
                            <CardDescription>Class average vs top and lowest performing students</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={studentPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Line type="monotone" dataKey="classAvg" stroke="#3b82f6" strokeWidth={3} name="Class Average" />
                                    <Line type="monotone" dataKey="topStudent" stroke="#10b981" strokeWidth={2} name="Top Student" />
                                    <Line type="monotone" dataKey="lowestStudent" stroke="#ef4444" strokeWidth={2} name="Lowest Student" />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Grade Distribution Tab */}
                <TabsContent value="grades" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Grade Distribution</CardTitle>
                                <CardDescription>Number of students per grade</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={subjectDistribution}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="subject" stroke="#6b7280" />
                                        <YAxis stroke="#6b7280" />
                                        <Tooltip />
                                        <Bar dataKey="students" radius={[8, 8, 0, 0]}>
                                            {subjectDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Grade Breakdown</CardTitle>
                                <CardDescription>Percentage distribution</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={subjectDistribution}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            nameKey="subject"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="students"
                                        >
                                            {subjectDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Overview</CardTitle>
                            <CardDescription>Total attendance statistics for this semester</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={attendanceData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {attendanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Assignments Tab */}
                <TabsContent value="assignments">
                    <Card>
                        <CardHeader>
                            <CardTitle>Assignment Performance</CardTitle>
                            <CardDescription>Completion rate and average scores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={400}>
                                <BarChart data={assignmentCompletion}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="assignment" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="completion" fill="#3b82f6" name="Completion Rate (%)" radius={[8, 8, 0, 0]} />
                                    <Bar dataKey="avgScore" fill="#10b981" name="Average Score" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
