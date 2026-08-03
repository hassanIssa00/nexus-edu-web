'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PointsDisplayProps {
    totalPoints: number;
    trend: 'up' | 'down' | 'stable';
    change: number;
}

export default function PointsDisplay({ totalPoints, trend, change }: PointsDisplayProps) {
    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-6 h-6 text-green-500" />;
        if (trend === 'down') return <TrendingDown className="w-6 h-6 text-red-500" />;
        return <Minus className="w-6 h-6 text-gray-500" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-500';
        if (trend === 'down') return 'text-red-500';
        return 'text-gray-500';
    };

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/20 rounded-xl p-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-muted-foreground">Total Points</h3>
                {getTrendIcon()}
            </div>

            <motion.div
                key={totalPoints}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2"
            >
                {totalPoints.toLocaleString()}
            </motion.div>

            <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getTrendColor()}`}>
                    {change >= 0 ? '+' : ''}{change} points
                </span>
                <span className="text-sm text-muted-foreground">this week</span>
            </div>
        </motion.div>
    );
}
