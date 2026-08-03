'use client';

import { Suspense } from 'react';
import { AdminSettingsPanel } from '@/components/admin/settings-panel';
import { Card, CardContent } from '@/components/ui/card';

function LoadingSettings() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <Card>
                <CardContent className="h-96 bg-gray-100 dark:bg-gray-800"></CardContent>
            </Card>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-6">
            <Suspense fallback={<LoadingSettings />}>
                <AdminSettingsPanel />
            </Suspense>
        </div>
    );
}
