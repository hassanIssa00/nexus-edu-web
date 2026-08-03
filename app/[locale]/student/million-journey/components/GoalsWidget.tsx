'use client';

import { Target, Calendar } from 'lucide-react';

interface Goal {
    target: number;
    current: number;
    percentage: number;
}

interface GoalsWidgetProps {
    weekly: Goal;
    monthly: Goal;
}

export default function GoalsWidget({ weekly, monthly }: GoalsWidgetProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weekly Goal */}
            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Target className="w-8 h-8 text-blue-500" />
                    <div>
                        <h3 className="font-semibold">Weekly Goal</h3>
                        <p className="text-sm text-muted-foreground">
                            {weekly.current} / {weekly.target} points
                        </p>
                    </div>
                </div>

                <div className="relative w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(weekly.percentage, 100)}%` }}
                    />
                </div>

                <p className="mt-2 text-sm text-center font-medium text-blue-600">
                    {weekly.percentage.toFixed(0)}% Complete
                </p>
            </div>

            {/* Monthly Goal */}
            <div className="bg-card border rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-purple-500" />
                    <div>
                        <h3 className="font-semibold">Monthly Goal</h3>
                        <p className="text-sm text-muted-foreground">
                            {monthly.current} / {monthly.target} points
                        </p>
                    </div>
                </div>

                <div className="relative w-full bg-secondary rounded-full h-3 overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(monthly.percentage, 100)}%` }}
                    />
                </div>

                <p className="mt-2 text-sm text-center font-medium text-purple-600">
                    {monthly.percentage.toFixed(0)}% Complete
                </p>
            </div>
        </div>
    );
}
