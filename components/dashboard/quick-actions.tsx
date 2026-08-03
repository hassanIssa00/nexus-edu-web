'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, Users, TrendingUp, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

interface QuickAction {
    icon: React.ReactNode;
    title: string;
    description: string;
    href: string;
    color: string;
}

const quickActions: QuickAction[] = [
    {
        icon: <FileText className="w-6 h-6" />,
        title: 'Submit Assignment',
        description: '3 pending',
        href: '/student/assignments',
        color: 'bg-blue-500'
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: 'View Schedule',
        description: 'Today\'s classes',
        href: '/student/schedule',
        color: 'bg-purple-500'
    },
    {
        icon: <Users className="w-6 h-6" />,
        title: 'Join Class',
        description: 'Live now',
        href: '/student/courses',
        color: 'bg-green-500'
    },
    {
        icon: <Award className="w-6 h-6" />,
        title: 'View Grades',
        description: 'Check results',
        href: '/student/grades',
        color: 'bg-yellow-500'
    }
];

export function QuickActions() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
                <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={action.href}>
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`${action.color} p-3 rounded-xl text-white group-hover:scale-110 transition-transform`}>
                                        {action.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                            {action.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}

interface Activity {
    id: string;
    type: 'assignment' | 'grade' | 'announcement' | 'class';
    title: string;
    description: string;
    time: string;
    icon: React.ReactNode;
    color: string;
}

const activities: Activity[] = [
    {
        id: '1',
        type: 'assignment',
        title: 'New Assignment Posted',
        description: 'Math Chapter 5 Homework',
        time: '2 hours ago',
        icon: <FileText className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
        id: '2',
        type: 'grade',
        title: 'Grade Updated',
        description: 'Physics Quiz - 95/100',
        time: '5 hours ago',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
        id: '3',
        type: 'announcement',
        title: 'School Announcement',
        description: 'Winter break schedule updated',
        time: '1 day ago',
        icon: <Users className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
        id: '4',
        type: 'class',
        title: 'Class Reminder',
        description: 'Chemistry Lab at 2:00 PM',
        time: '2 days ago',
        icon: <Clock className="w-5 h-5" />,
        color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
];

export function RecentActivity() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest updates and notifications</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className={`${activity.color} p-2 rounded-lg`}>
                                {activity.icon}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                    {activity.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {activity.description}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    {activity.time}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                    View All Activity
                </Button>
            </CardContent>
        </Card>
    );
}
