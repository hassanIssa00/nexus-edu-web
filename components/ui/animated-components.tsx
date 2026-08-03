'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    hoverScale?: number;
    onClick?: () => void;
}

export function AnimatedCard({ 
    children, 
    className = '', 
    delay = 0, 
    hoverScale = 1.02,
    onClick 
}: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: delay * 0.1, ease: 'easeOut' }}
            whileHover={{ scale: hoverScale, boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {children}
        </motion.div>
    );
}

interface AnimatedListProps {
    children: ReactNode[];
    staggerDelay?: number;
}

export function AnimatedList({ children, staggerDelay = 0.05 }: AnimatedListProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {children.map((child, index) => (
                <motion.div
                    key={index}
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
}

interface PulseLoaderProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

export function PulseLoader({ size = 'md', color = 'bg-blue-500' }: PulseLoaderProps) {
    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4',
    };

    return (
        <div className="flex gap-1 items-center justify-center">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className={`${sizeClasses[size]} ${color} rounded-full`}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.15,
                    }}
                />
            ))}
        </div>
    );
}

interface SkeletonProps {
    className?: string;
    animate?: boolean;
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
    return (
        <motion.div
            className={`bg-gray-200 dark:bg-gray-700 rounded ${className}`}
            animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
        />
    );
}

interface CountUpProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
}

export function CountUp({ end, duration = 2, prefix = '', suffix = '', className = '' }: CountUpProps) {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {prefix}
            </motion.span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration }}
            >
                {end}
            </motion.span>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: duration }}
            >
                {suffix}
            </motion.span>
        </motion.span>
    );
}
