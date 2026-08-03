'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Event {
    date: Date;
    title: string;
    type: 'class' | 'assignment' | 'exam' | 'event';
    color: string;
}

const mockEvents: Event[] = [
    { date: new Date(2024, 11, 5), title: 'Math Exam', type: 'exam', color: 'bg-red-500' },
    { date: new Date(2024, 11, 10), title: 'Physics Assignment Due', type: 'assignment', color: 'bg-blue-500' },
    { date: new Date(2024, 11, 15), title: 'Chemistry Lab', type: 'class', color: 'bg-green-500' },
    { date: new Date(2024, 11, 20), title: 'School Event', type: 'event', color: 'bg-purple-500' },
];

export function ScheduleWidget() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const previousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const getEventsForDate = (date: Date) => {
        return mockEvents.filter(event => isSameDay(event.date, date));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Schedule</CardTitle>
                        <CardDescription>
                            {format(currentMonth, 'MMMM yyyy')}
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={previousMonth}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={nextMonth}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-xs font-medium text-gray-600 dark:text-gray-400 py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {days.map((day, index) => {
                        const events = getEventsForDate(day);
                        const hasEvents = events.length > 0;

                        return (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(day)}
                                className={`
                  aspect-square p-2 rounded-lg text-sm relative
                  ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-900 dark:text-white'}
                  ${isToday(day) ? 'bg-primary-500 text-white font-bold' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}
                  ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-primary-500' : ''}
                  transition-all
                `}
                            >
                                {format(day, 'd')}
                                {hasEvents && (
                                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {events.slice(0, 3).map((event, i) => (
                                            <div key={i} className={`w-1 h-1 rounded-full ${event.color}`} />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Events for selected date */}
                {selectedDate && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="font-medium text-sm mb-2">
                            Events on {format(selectedDate, 'MMMM d, yyyy')}
                        </h4>
                        <div className="space-y-2">
                            {getEventsForDate(selectedDate).map((event, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className={`w-2 h-2 rounded-full ${event.color}`} />
                                    <span className="text-gray-900 dark:text-white">{event.title}</span>
                                </div>
                            ))}
                            {getEventsForDate(selectedDate).length === 0 && (
                                <p className="text-sm text-gray-500">No events scheduled</p>
                            )}
                        </div>
                    </div>
                )}

                <Button variant="outline" className="w-full mt-4">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    View Full Calendar
                </Button>
            </CardContent>
        </Card>
    );
}
