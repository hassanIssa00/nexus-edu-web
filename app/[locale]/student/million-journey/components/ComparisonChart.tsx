'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
    lastWeek: number;
    lastMonth: number;
}

export default function ComparisonChart({ lastWeek, lastMonth }: ComparisonChartProps) {
    const data = [
        { name: 'Last Week', points: lastWeek },
        { name: 'This Week', points: lastWeek + 150 },
        { name: 'Last Month', points: lastMonth },
        { name: 'This Month', points: lastMonth + 500 },
    ];

    return (
        <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Performance Comparison</h3>

            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                        }}
                    />
                    <Bar dataKey="points" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
