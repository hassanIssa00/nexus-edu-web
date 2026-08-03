'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    showIcon?: boolean;
}

export function Tooltip({ 
    content, 
    children, 
    position = 'top',
    showIcon = false 
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 border-x-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 border-x-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 border-y-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 border-y-transparent border-l-transparent',
    };

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsVisible(true), 300);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsVisible(false);
    };

    return (
        <div 
            className="relative inline-flex items-center gap-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {showIcon && (
                <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            )}
            
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positionClasses[position]}`}
                    >
                        <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs whitespace-normal">
                            {content}
                        </div>
                        <div className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface FeatureHighlightProps {
    id: string;
    title: string;
    description: string;
    targetSelector: string;
    onDismiss: () => void;
}

export function FeatureHighlight({ 
    id, 
    title, 
    description, 
    targetSelector,
    onDismiss 
}: FeatureHighlightProps) {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const target = document.querySelector(targetSelector);
        if (target) {
            const rect = target.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 10,
                left: rect.left + rect.width / 2,
            });
        }
    }, [targetSelector]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem(`feature-seen-${id}`, 'true');
        onDismiss();
    };

    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed z-50"
            style={{ 
                top: position.top, 
                left: position.left, 
                transform: 'translateX(-50%)' 
            }}
        >
            <div className="bg-blue-600 text-white rounded-xl p-4 shadow-2xl max-w-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold">{title}</h4>
                    <button 
                        onClick={handleDismiss}
                        className="p-1 hover:bg-white/20 rounded"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-sm text-blue-100">{description}</p>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rotate-45" />
            </div>
        </motion.div>
    );
}
