const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AnalyticsOverview {
    users: {
        total: number;
        students: number;
        teachers: number;
        parents: number;
    };
    classes: {
        total: number;
    };
    subjects: {
        total: number;
    };
    enrollments: {
        total: number;
    };
    recentActivity: Array<{
        type: string;
        description: string;
        timestamp: string;
    }>;
}

class AnalyticsService {
    async getOverview(): Promise<AnalyticsOverview> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/analytics/overview`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch analytics');
        return response.json();
    }

    async getUserGrowth(days: number = 30) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/analytics/user-growth?days=${days}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch user growth');
        return response.json();
    }
}

export const analyticsService = new AnalyticsService();
