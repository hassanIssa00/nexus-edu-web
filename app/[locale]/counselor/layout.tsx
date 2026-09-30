'use client'

import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { DashboardHeader } from '@/components/layout/dashboard-header'
import { PageTransition } from '@/components/ui/page-transition'
import { SocketProvider } from '@/lib/providers/socket-provider'

export default function CounselorLayout({ children }: { children: ReactNode }) {
    return (
        <SocketProvider>
            <div className="flex min-h-screen bg-background" dir="rtl">
                <Sidebar role="counselor" />
                <div className="flex-1 flex flex-col min-w-0">
                    <DashboardHeader title="بوابة التوجيه الطلابي والإرشاد" />
                    <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </main>
                </div>
            </div>
        </SocketProvider>
    )
}
