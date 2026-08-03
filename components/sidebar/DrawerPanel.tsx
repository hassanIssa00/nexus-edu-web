'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/contexts/SidebarContext';
import { useEffect } from 'react';

interface DrawerPanelProps {
    drawerId: string;
    title: string;
    children: React.ReactNode;
}

export function DrawerPanel({ drawerId, title, children }: DrawerPanelProps) {
    const { activeDrawer, closeDrawer } = useSidebar();
    const isOpen = activeDrawer === drawerId;

    // Close on ESC key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                closeDrawer();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, closeDrawer]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeDrawer}
                        className="fixed inset-0 bg-black/50 z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full md:w-[500px] bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-white">{title}</h2>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeDrawer}
                                className="text-white hover:bg-white/20"
                            >
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default DrawerPanel;
