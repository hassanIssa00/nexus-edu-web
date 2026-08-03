'use client';

import { SidebarProvider } from '@/contexts/SidebarContext';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { AssignmentsDrawer } from '@/components/drawers/AssignmentsDrawer';
import { GradesDrawer } from '@/components/drawers/GradesDrawer';
import { AttendanceDrawer } from '@/components/drawers/AttendanceDrawer';
import { NotificationsDrawer } from '@/components/drawers/NotificationsDrawer';

export function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1">
                    {children}
                </main>

                {/* All Drawers */}
                <AssignmentsDrawer />
                <GradesDrawer />
                <AttendanceDrawer />
                <NotificationsDrawer />
            </div>
        </SidebarProvider>
    );
}

export default AppLayout;
