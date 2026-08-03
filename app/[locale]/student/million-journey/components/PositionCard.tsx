'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PositionCardProps {
    scope: string;
    rank: number;
    icon: LucideIcon;
    color: 'blue' | 'purple' | 'orange';
}

export default function PositionCard({ scope, rank, icon: Icon, color }: PositionCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
    };

    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-card border rounded-lg p-6 text-center"
        >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses[color]} mb-4`}>
                <Icon className="w-8 h-8 text-white" />
            </div>

            <h4 className="font-semibold text-muted-foreground mb-2">{scope} Rank</h4>

            <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold">#{rank}</span>
                {getMedalEmoji(rank) && (
                    <span className="text-3xl">{getMedalEmoji(rank)}</span>
                )}
            </div>
        </motion.div>
    );
}
