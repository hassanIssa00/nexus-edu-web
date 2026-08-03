'use client';

import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface ProbabilityGaugeProps {
    probability: number;
    consistencyIndex: number;
}

export default function ProbabilityGauge({ probability, consistencyIndex }: ProbabilityGaugeProps) {
    const getColor = (value: number) => {
        if (value >= 70) return '#10B981'; // Green
        if (value >= 40) return '#F59E0B'; // Orange
        return '#EF4444'; // Red
    };

    return (
        <div className="bg-card border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Winning Probability</h3>

            <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke="hsl(var(--secondary))"
                            strokeWidth="12"
                            fill="none"
                        />
                        <motion.circle
                            cx="96"
                            cy="96"
                            r="80"
                            stroke={getColor(probability)}
                            strokeWidth="12"
                            fill="none"
                            strokeLinecap="round"
                            initial={{ strokeDashoffset: 502 }}
                            animate={{
                                strokeDashoffset: 502 - (502 * probability) / 100,
                            }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            strokeDasharray="502"
                        />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Target className="w-8 h-8 mb-2" style={{ color: getColor(probability) }} />
                        <span className="text-4xl font-bold" style={{ color: getColor(probability) }}>
                            {probability}%
                        </span>
                        <span className="text-xs text-muted-foreground">Winning Chance</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Consistency Index</span>
                    <span className="font-semibold">{(consistencyIndex * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                    <div
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${consistencyIndex * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
