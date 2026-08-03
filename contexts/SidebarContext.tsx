'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SidebarContextType {
    activeDrawer: string | null;
    openDrawer: (drawerId: string) => void;
    closeDrawer: () => void;
    toggleDrawer: (drawerId: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeDrawer, setActiveDrawer] = useState<string | null>(
        searchParams.get('drawer')
    );

    const openDrawer = useCallback((drawerId: string) => {
        setActiveDrawer(drawerId);
        const params = new URLSearchParams(searchParams.toString());
        params.set('drawer', drawerId);
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const closeDrawer = useCallback(() => {
        setActiveDrawer(null);
        const params = new URLSearchParams(searchParams.toString());
        params.delete('drawer');
        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const toggleDrawer = useCallback((drawerId: string) => {
        if (activeDrawer === drawerId) {
            closeDrawer();
        } else {
            openDrawer(drawerId);
        }
    }, [activeDrawer, openDrawer, closeDrawer]);

    return (
        <SidebarContext.Provider value={{ activeDrawer, openDrawer, closeDrawer, toggleDrawer }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
}
