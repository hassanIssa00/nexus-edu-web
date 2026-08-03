'use client';

import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecommendationsProps {
    recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
    return (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
            </div>

            <ul className="space-y-3">
                {recommendations.map((recommendation, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start gap-3"
                    >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white text-sm flex items-center justify-center font-semibold mt-0.5">
                            {index + 1}
                        </span>
                        <span className="text-sm flex-1">{recommendation}</span>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}
