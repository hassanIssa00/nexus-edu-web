'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
    name: string;
    score: number;
    icon: LucideIcon;
    color: string;
}

export default function CategoryCard({ name, score, icon: Icon, color }: CategoryCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-card border rounded-lg p-4 cursor-pointer transition-shadow hover:shadow-lg"
        >
            <div className="flex items-center justify-between mb-3">
                <Icon className="w-6 h-6" style={{ color }} />
                <span className="text-2xl font-bold" style={{ color }}>
                    {score}%
                </span>
            </div>

            <h4 className="font-semibold mb-2">{name}</h4>

            <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: color }}
                />
            </div>
        </motion.div>
    );
}
